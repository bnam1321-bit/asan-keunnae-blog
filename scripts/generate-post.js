const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { format } = require('date-fns');
const { SYSTEM_PROMPT, KEYWORDS, CLINIC_INFO } = require('./prompts');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Google Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generatePost() {
    console.log('🤖 AI(Gemini) 의사선생님이 글을 쓸 준비를 하고 있습니다...');

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
                '환절기 독감 예방과 접종의 중요성',
                '직장인 만성피로와 수액 치료',
                '속쓰림과 위염, 위내시경이 필요한 순간',
                '대장용종과 대장내시경 검사의 주기',
                '고혈압 환자의 겨울철 건강 관리',
                '당뇨병 초기 증상과 식이요법',
                '지방간 예방을 위한 생활 습관',
                '비타민D 결핍과 주사 치료',
                '대상포진 초기 증상과 예방접종',
                '헬리코박터균 감염과 제균 치료'
            ];
            topic = healthTopics[Math.floor(Math.random() * healthTopics.length)];
            console.log(`📝 랜덤 선택 주제: [${topic}]`);
        }
    }

    // KST 기준으로 날짜 설정 (UTC+9)
    const kstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const today = format(kstDate, 'yyyy-MM-dd');

    // 2. 글 작성 (Updated Gemini API)
    let content = "";

    // 재시도 로직 추가
    const MAX_RETRIES = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`🚀 Gemini 2.5 Pro 모델로 글 작성 시도 (${attempt}/${MAX_RETRIES})...`);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-pro",
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 8192,
                }
            });

            const fullPrompt = `${SYSTEM_PROMPT}

## 병원 기본 정보 (글 작성 시 참고용 - 포스팅에 직접 기재하지 말 것)
- 병원명: 아산큰내과의원
- 소재지: 인천 서구 검단로 469 4층, 5층
- 기관 유형: 여성소화기내과 전문의, 신장내과 전문의 2인 진료 의원
- 주요 진료: 위·대장내시경, 건강검진(채용검진), 만성질환(고혈압, 당뇨병, 고지혈증 등), 초음파 클리닉, 수액 치료
- 대표 번호: 032-567-0750

## 입력된 주제
- **주제**: "${topic}"
- **타겟**: 해당 증상으로 고민하는 환자, 가족, 건강에 관심있는 일반인
- **핵심 키워드**: ${KEYWORDS.join(', ')}


## 출력 요구사항

**반드시 다음 Frontmatter로 시작:**
---
title: "(매력적이고 검색 최적화된 제목)"
date: "${today}"
description: "(환자 검색어 기준, 160자 이내, 클리닉명 절대 포함 X)"
tags: ["검단신도시내과", "검단내과", "인천 서구 검단 내과", "주제관련태그1", "주제관련태그2"]
author: "아산큰내과"
coverImage: ""
---

**본문 구성:**

## 새로운 글쓰기 패턴 (매우 중요)
- **주제 내용**: [원장님 진료 경험에서 본 패턴] 1~2개를 반드시 포함하세요.
- **형식**: 자유롭게 구성하되 (질문 도입, 사례 도입, 통계 도입, 비교 도입) 중 랜덤으로 하나를 선택하여 시작하세요. 기계적인 H2 구조(원인, 증상, 치료 등)를 탈피하세요.
- **어조**: 진료실에서 환자에게 설명하듯 1인칭 표현("제가 진료를 보면서...", "저희 의원에 오시는 분들 중...")을 자연스럽게 일부 사용하세요.
- **메타 디스크립션**: 환자가 실제로 검색할 만한 검색어 기준으로 작성하고, 클리닉명(병원명)은 **절대 포함하지 마세요**.
- **글 끝부분 마무리**: 글의 마지막에는 자연스럽게 [원장님 약력 1줄 + 진료 가능 항목]을 포함하여 신뢰도를 높이세요.


---

> 💡 **진료 안내 및 주의사항**  
> 본 게시물은 의료법 제56조 1항을 준수하여 의료 정보 제공 목적으로 작성되었습니다.  
> 제공된 의학 정보는 환자의 상태 및 체질에 따라 진료 결과가 다를 수 있으며, 부작용이 발생할 수 있으므로 시술 전 반드시 내과 전문의와 충분한 상담을 진행하시기 바랍니다.

## 주의사항
- 의료광고법을 철저히 준수할 것
- 치료 효과 보장 표현 금지
- '최고', '최상' 등 최상급 표현 금지
- 단정적 표현 대신 "~ 도움이 됩니다", "~ 권장됩니다" 사용
- 부작용과 주의사항을 반드시 포함
- 본문은 반드시 3,000자 이상 작성할 것 (핵심 정보를 충분히 포함)
`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            content = response.text();
            console.log("✨ Gemini 2.5 Pro 작성 성공!");
            console.log(`📄 생성된 글 길이: ${content.length}자`);
            break; // 성공하면 루프 종료

        } catch (apiError) {
            lastError = apiError;
            console.error(`❌ Gemini API 오류 (시도 ${attempt}/${MAX_RETRIES}):`, apiError.message);

            if (attempt < MAX_RETRIES) {
                console.log(`⏳ ${attempt * 2}초 후 재시도...`);
                await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            }
        }
    }

    // 모든 재시도 실패 시 Fallback
    if (!content) {
        console.error('📋 모든 재시도 실패. Fallback 콘텐츠 생성...');
        console.error('📋 마지막 에러:', JSON.stringify(lastError, null, 2));

        // 주제별 맞춤 컨텐츠 생성 (Fallback)
        const topicContent = generateTopicContent(topic);
        content = `---
title: "${topic}"
date: "${today}"
description: "${topicContent.description}"
tags: ${JSON.stringify(topicContent.tags)}
author: "아산큰내과"
coverImage: ""
---

${topicContent.content}

---

> 💡 **중요 안내**  
> 본 정보는 일반적인 건강 가이드이며, 개인의 상태에 따라 다를 수 있습니다.  
> 정확한 진단과 치료를 위해서는 반드시 전문의와 상담하시기 바랍니다.
`;
    }

    // 3. 이미지 설정 (SEO 및 OG 태그용)
    const stockImages = ['consultation.jpg', 'equipment.jpg', 'wellness.jpg', 'lab.jpg'];
    const randomStock = stockImages[Math.floor(Math.random() * stockImages.length)];
    const imagePath = `/images/stock/${randomStock}`;

    console.log(`🖼️ SEO/OG용 커버 이미지 메타데이터 설정: ${imagePath}`);

    if (content.includes('coverImage:')) {
        content = content.replace(/coverImage: ""/, `coverImage: "${imagePath}"`);
    }

    // 4. 파일 저장

    // SEO 최적화된 Slug 생성을 위한 추가 요청
    let slug = "";
    try {
        const slugModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const slugPrompt = `
        블로그 글 제목: "${topic}"
        
        위 제목을 바탕으로 검색 엔진 최적화(SEO)에 유리한 영문 URL Slug를 만들어주세요.
        - 규칙: 소문자, 하이픈(-) 연결, 특수문자 제거
        - 예시: "겨울철 독감 예방" -> "preventing-winter-flu-symptoms"
        - 출력: 슬러그만 출력 (다른 텍스트 없이)
        `;
        const slugResult = await slugModel.generateContent(slugPrompt);
        slug = slugResult.response.text().trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        console.log(`🔗 생성된 Slug: ${slug}`);
    } catch (e) {
        console.error("Slug 생성 실패, 타임스탬프로 대체", e);
        slug = Math.random().toString(36).substring(7);
    }

    const filename = `${today}-${slug}.md`;
    const postsDirLink = path.join(__dirname, '../content/posts');

    if (!fs.existsSync(postsDirLink)) {
        fs.mkdirSync(postsDirLink, { recursive: true });
    }

    fs.writeFileSync(path.join(postsDirLink, filename), content || "");
    console.log(`✅ 글 작성 완료: content/posts/${filename}`);
}

function generateTopicContent(topic) {
    const defaultContent = {
        description: `전문의가 알려주는 ${topic.split(' ')[0]} 건강 가이드입니다.`,
        tags: ['건강정보', '내과', '진료안내'],
        content: `## ${topic}\n\n**아산큰내과**입니다.\n\n(본문 생성 실패로 인한 기본 템플릿입니다.)`
    };
    return defaultContent;
}

generatePost();
