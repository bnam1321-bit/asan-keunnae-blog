const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function downloadImage(url, filepath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
        const text = await response.text();
        throw new Error(`Invalid content-type: ${contentType}. Body: ${text.substring(0, 100)}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function regenerateImages() {
    console.log('🖼️ 기존 포스팅 이미지 일괄 교체 작업을 시작합니다...');

    const postsDir = path.join(__dirname, '../content/posts');
    const publicDir = path.join(__dirname, '../public/images/blog');

    if (!fs.existsSync(postsDir)) {
        console.error('❌ 포스트 디렉토리가 없습니다.');
        return;
    }

    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    console.log(`📚 총 ${files.length}개의 포스트를 발견했습니다.`);

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const title = data.title;
        console.log(`\n🔄 처리 중: [${title}]`);

        try {
            // 1. 이미지 프롬프트 생성 (Gemini)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const promptReq = `
            블로그 글 제목: "${title}"
            
            위 제목에 어울리는 고품질 의료/건강 관련 일러스트나 사진을 생성하기 위한 영어 프롬프트를 작성해주세요.
            - 스타일: 사실적이고 전문적인 의료 사진 또는 깔끔한 3D 메디컬 일러스트
            - 분위기: 신뢰감, 밝음, 희망적, 전문적
            - 필수: "photorealistic", "medical", "clean", "professional", "soft lighting", "high quality", "8k"
            - 제외: 텍스트, 글자, 기괴한 손, 공포스러운 분위기, 수술 장면(피)
            - 출력: 영어 프롬프트 문장만 출력 (다른 말 없이)
            `;

            const result = await model.generateContent(promptReq);
            const imagePrompt = result.response.text().trim();
            console.log(`   🖌️ 프롬프트: ${imagePrompt.substring(0, 50)}...`);

            // 2. 이미지 생성 (Pollinations AI)
            const encodedPrompt = encodeURIComponent(imagePrompt);
            const randomSeed = Math.floor(Math.random() * 10000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=600&nologo=true&seed=${randomSeed}`;

            const imageSlug = file.replace('.md', '') + '-' + Math.random().toString(36).substring(7);
            const imageFileName = `${imageSlug}.jpg`;
            const localImagePath = path.join(publicDir, imageFileName);
            const publicPath = `/images/blog/${imageFileName}`;

            console.log(`   📥 이미지 다운로드 중...`);
            await downloadImage(imageUrl, localImagePath);

            // 3. Frontmatter 업데이트
            data.coverImage = publicPath;
            const newFileContent = matter.stringify(content, data);
            fs.writeFileSync(filePath, newFileContent);

            console.log(`   ✅ 이미지 교체 완료: ${publicPath}`);

        } catch (error) {
            console.error(`   ❌ 실패: ${error.message}`);
            console.log('   ⚠️ 스톡 이미지로 대체합니다.');

            const stockImages = ['consultation.jpg', 'equipment.jpg', 'wellness.jpg', 'lab.jpg'];
            const randomStock = stockImages[Math.floor(Math.random() * stockImages.length)];
            const stockPath = path.join(__dirname, '../public/images/stock', randomStock);

            const fallbackSlug = file.replace('.md', '') + '-fallback';
            const fallbackFileName = `${fallbackSlug}.jpg`;
            const fallbackLocalPath = path.join(publicDir, fallbackFileName);
            const fallbackPublicPath = `/images/blog/${fallbackFileName}`;

            fs.copyFileSync(stockPath, fallbackLocalPath);

            data.coverImage = fallbackPublicPath;
            const newFileContent = matter.stringify(content, data);
            fs.writeFileSync(filePath, newFileContent);
            console.log(`   ✅ 대체 이미지 적용 완료: ${fallbackPublicPath}`);
        }

        // API 부하 방지용 짧은 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✨ 모든 작업이 완료되었습니다.');
}

regenerateImages();
