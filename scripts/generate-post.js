const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { format } = require('date-fns');
const { SYSTEM_PROMPT, buildUserPrompt, KEYWORDS, CLINIC_INFO, validateOutput } = require('./prompts');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Google Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function detectClusterAndKeyword(topic) {
    const topicText = topic.toLowerCase();
    
    // 신장질환 및 투석 클러스터
    if (/(투석|혈액투석|신장|인공신장|신부전|동정맥루|사구체|콩팥|nephro|dialysis)/.test(topicText)) {
        return {
            cluster: "신장질환·인공신장 클리닉",
            targetKeyword: "검단 인공신장센터",
            extraContext: "FMC 5008S 인공신장기, EWB-1000 인공신장 정수처리기, 투석 전문 의료진 상주, 정기 초음파 동정맥루 확인 사실 포함"
        };
    }
    
    // 5대암 건강검진센터
    if (/(검진|건강검진|국가검진|5대암|암검진|공단검진|종합검진|자궁경부|유방암)/.test(topicText)) {
        return {
            cluster: "건강검진센터(5대암)",
            targetKeyword: "검단 국가건강검진",
            extraContext: "국가 5대암 검진, 공단검진, 종합검진, 검진 대상 연령 및 주기 안내 포함"
        };
    }

    // 초음파 클리닉
    if (/(초음파|갑상선|경동맥|ultrasound)/.test(topicText)) {
        return {
            cluster: "초음파 클리닉",
            targetKeyword: "검단 복부초음파",
            extraContext: "복부, 갑상선, 경동맥, 신장 등 초음파 클리닉 운영 및 세부 전문의 진료 정보 포함"
        };
    }
    
    // 만성질환 클리닉
    if (/(당뇨|혈압|고혈압|고지혈증|콜레스테롤|대사증후군|만성질환)/.test(topicText)) {
        return {
            cluster: "만성질환 클리닉",
            targetKeyword: "검단 당뇨 내과",
            extraContext: "고혈압, 당뇨병, 고지혈증 등 만성질환의 예방 및 체계적인 약물/생활습관 추적 관리 포함"
        };
    }
    
    // 내 몸 맞춤 클리닉 (수액, 접종 등)
    if (/(수액|예방접종|접종|독감|비만|영양수액)/.test(topicText)) {
        return {
            cluster: "내 몸 맞춤 클리닉",
            targetKeyword: "검단 예방접종",
            extraContext: "영양수액 치료, 예방접종(독감, 대상포진, 폐렴구균 등) 종류 및 적응증 사실 기술 포함"
        };
    }
    
    // 기본값: 소화기·내시경 클리닉
    return {
        cluster: "소화기·내시경 클리닉",
        targetKeyword: "검단 위내시경",
        extraContext: "올림푸스 최신 내시경 기종 사용, 소화기내시경 세부전문의 직접 검사 및 당일 용종절제 사실 포함"
    };
}

function parseMetaBlock(text, today) {
    const metaRegex = /(?:\[META\]|```\[META\]|```meta)\s*([\s\S]+?)(?:```|---|\n\n)/i;
    const match = text.match(metaRegex);
    const metaData = {
        title: '',
        date: today,
        description: '',
        slug: '',
        author: '소화기내과 전문의',
        target_keyword: '',
        cluster: ''
    };

    if (match) {
        const metaContent = match[1];
        const lines = metaContent.split('\n');
        lines.forEach(line => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex !== -1) {
                const key = line.slice(0, separatorIndex).trim().toLowerCase();
                const value = line.slice(separatorIndex + 1).trim()
                    .replace(/^[,"'\s\\]+|[,"'\s\\]+$/g, ''); // 앞뒤의 쉼표, 따옴표, 백슬래시, 공백을 모두 제거
                
                if (key.includes('seo_title')) metaData.title = value;
                else if (key.includes('h1') && !metaData.title) metaData.title = value;
                else if (key.includes('meta_description')) metaData.description = value;
                else if (key.includes('url_slug')) metaData.slug = value;
                else if (key.includes('published')) metaData.date = value;
                else if (key.includes('author_role')) metaData.author = value;
                else if (key.includes('target_keyword')) metaData.target_keyword = value;
                else if (key.includes('cluster')) metaData.cluster = value;
            }
        });
    }

    // fallback 값을 위해 H1 제목 정규식 매칭 시도
    if (!metaData.title) {
        const h1Match = text.match(/^#\s+(.+)$/m);
        if (h1Match) metaData.title = h1Match[1].trim();
    }

    return metaData;
}

async function generatePost() {
    console.log('🤖 아산큰내과 GEO + Google SEO v3.2 AI 포스팅 엔진 시작...');

    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY가 없습니다. .env 파일을 확인해주세요.');
        process.exit(1);
    }

    // 1. 기존 글 확인 및 주제 선정
    const postsDir = path.join(__dirname, '../content/posts');
    const existingTitles = [];

    if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir);
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
                const match = content.match(/title: "(.*)"/);
                if (match) {
                    existingTitles.push(match[1]);
                }
            }
        });
    }

    console.log(`📚 기존 작성된 글: ${existingTitles.length}개`);

    let topic = "";

    // 명령줄 인수로 주제가 전달되면 해당 주제 사용
    if (process.argv[2]) {
        topic = process.argv[2];
        console.log(`🎯 지정된 주제: [${topic}]`);
    } else {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
            const topicPrompt = `
            당신은 내과 병원 블로그 마케터입니다.
            기존에 작성된 블로그 글 제목들은 다음과 같습니다:
            ${JSON.stringify(existingTitles)}
    
            위 주제들과 겹치지 않는, 내과 환자들에게 유용한 새로운 건강 정보 주제 1가지만 추천해주세요.
            출력 형식: 주제만 텍스트로 출력 (예: "겨울철 노로바이러스 장염의 증상과 예방")
            명확하고 구체적인 주제를 선정하세요.
            `;

            const result = await model.generateContent(topicPrompt);
            topic = result.response.text().trim().replace(/"/g, '');
            console.log(`💡 AI 추천 주제: [${topic}]`);
        } catch (e) {
            console.error("❌ 주제 생성 실패, 기본 리스트 사용", e);
            const healthTopics = [
                '위내시경 검사 전 금식 시간과 물 섭취 가이드',
                '대장내시경 전 용종 발견 시 당일 제거 치료',
                '만성콩팥병 환자가 혈액투석을 시작해야 하는 시점',
                '고지혈증 관리를 위한 생활 요법과 추적 혈액검사',
                '당뇨병 환자의 만성 신부전 합병증 예방법',
                '복부초음파 검사로 조기 진단 가능한 복부 장기 질환',
                '고혈압 관리 중 동정맥루와 혈액투석 주기',
                '지방간 예방을 위한 식습관과 복부초음파 중요성'
            ];
            topic = healthTopics[Math.floor(Math.random() * healthTopics.length)];
            console.log(`📝 랜덤 선택 주제: [${topic}]`);
        }
    }

    const { cluster, targetKeyword, extraContext } = detectClusterAndKeyword(topic);
    console.log(`📂 자동 분류 클러스터: [${cluster}]`);
    console.log(`🔑 타겟 키워드: [${targetKeyword}]`);

    // KST 기준으로 날짜 설정 (UTC+9)
    const kstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const today = format(kstDate, 'yyyy-MM-dd');

    let userPrompt = buildUserPrompt({ topic, targetKeyword, cluster, extraContext });

    // 2. 글 작성 (Self-Correction Loop 적용)
    let content = "";
    const MAX_ATTEMPTS = 3;
    let attempts = 0;
    let validationResult = { passed: false, issues: [] };

    while (attempts < MAX_ATTEMPTS && !validationResult.passed) {
        attempts++;
        try {
            console.log(`🚀 Gemini 2.5 Pro 모델 호출 시도 (${attempts}/${MAX_ATTEMPTS})...`);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-pro",
                generationConfig: {
                    temperature: 0.5, // 팩트 및 지시사항 준수율을 높이기 위해 낮은 온도로 설정
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 8192,
                }
            });

            // 검증 오류 피드백 프롬프트 추가
            let currentPrompt = userPrompt;
            if (attempts > 1 && validationResult.issues.length > 0) {
                console.log(`⚠️ 이전 출력에 검증 오류가 있습니다. 피드백을 전달하여 재작성을 요청합니다.`);
                currentPrompt += `\n\n[🚨 재시도 피드백: 이전 출력에서 다음과 같은 검증 오류가 발생했습니다. 아래 지적 사항을 반드시 해결하여 전체 본문을 처음부터 다시 생성하십시오.]\n- ${validationResult.issues.join('\n- ')}`;
            }

            const result = await model.generateContent([
                { text: SYSTEM_PROMPT },
                { text: currentPrompt }
            ]);
            
            const response = await result.response;
            content = response.text().trim();
            
            // 검증 수행
            console.log(`🔍 생성된 출력 검증 중...`);
            validationResult = validateOutput(content);
            
            if (validationResult.passed) {
                console.log(`✅ 검증 통과! (글자수: 공백제외 ${validationResult.charCount}자, 브랜드 노출: ${validationResult.brandCount}회)`);
            } else {
                console.warn(`❌ 검증 실패 (오류 항목 수: ${validationResult.issues.length}개):`);
                validationResult.issues.forEach(issue => console.warn(`   - ${issue}`));
            }

        } catch (apiError) {
            console.error(`❌ Gemini API 오류 (시도 ${attempts}/${MAX_ATTEMPTS}):`, apiError.message);
            if (attempts < MAX_ATTEMPTS) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    // 만약 최종적으로도 실패했으나 글이 있다면 일단 저장 시도
    if (!content) {
        console.error('📋 모든 시도 실패. 포스팅 생성을 중단합니다.');
        process.exit(1);
    }

    // 3. META 파싱 및 Frontmatter 포맷팅
    const metaData = parseMetaBlock(content, today);
    
    // 이미지 선택
    const stockImages = ['consultation.jpg', 'equipment.jpg', 'wellness.jpg', 'lab.jpg'];
    const randomStock = stockImages[Math.floor(Math.random() * stockImages.length)];
    const imagePath = `/images/stock/${randomStock}`;

    // 본문 내용 정제 ([META] 부분 제거)
    let cleanContent = content.replace(/(?:\[META\]|```\[META\]|```meta)[\s\S]+?(?:```|---)\s*/gi, '').trim();
    
    // AI가 본문 전체를 불필요하게 ```markdown ... ``` 또는 ``` ... ``` 으로 한 번 더 감쌌을 경우 이를 제거
    if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```[a-zA-Z]*\n/, ''); // 첫 줄의 ``` 또는 ```markdown 제거
        cleanContent = cleanContent.replace(/\n```$/, ''); // 마지막 줄의 ``` 제거
    }
    cleanContent = cleanContent.trim();
    
    // 질환명 추출
    let mainDisease = "내과질환";
    if (metaData.target_keyword) {
        mainDisease = metaData.target_keyword
            .replace(/(인천\s*서구|검단신도시|검단사거리|검단|왕길동)\s*/g, '')
            .replace(/^[,"'\s\\]+|[,"'\s\\]+$/g, '') // 여분의 특수문자 제거
            .trim();
    }

    const finalTags = [mainDisease, "검단신도시내과", "검단내과", "인천 서구 검단 내과"];

    // 마크다운 파일 조립 (Next.js 호환 Frontmatter 구성)
    const finalFileContent = `---
title: "${metaData.title || topic}"
date: "${metaData.date}"
description: "${metaData.description}"
tags: ${JSON.stringify(finalTags)}
author: "아산큰내과"
coverImage: "${imagePath}"
author_role: "${metaData.author}"
target_keyword: "${metaData.target_keyword}"
cluster: "${metaData.cluster}"
---

${cleanContent}
`;

    // 4. 파일 저장
    let filenameSlug = metaData.slug || today;
    filenameSlug = filenameSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
    if (!filenameSlug) {
        filenameSlug = Math.random().toString(36).substring(7);
    }

    const filename = `${today}-${filenameSlug}.md`;
    const postsDirLink = path.join(__dirname, '../content/posts');

    if (!fs.existsSync(postsDirLink)) {
        fs.mkdirSync(postsDirLink, { recursive: true });
    }

    fs.writeFileSync(path.join(postsDirLink, filename), finalFileContent);
    console.log(`🎉 최종 포스트 저장 완료: content/posts/${filename}`);
}

generatePost();
