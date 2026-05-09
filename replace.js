const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Name
    content = content.replace(/청라나눔내과/g, '아산큰내과');
    content = content.replace(/청라나눔/g, '아산큰');
    
    // Address
    content = content.replace(/인천광역시 서구 청라한내로 90 MK뷰 빌딩 5층/g, '인천 서구 검단로 469 4층, 5층');
    
    // Region
    content = content.replace(/청라국제도시 청라동/g, '인천 서구 검단');
    content = content.replace(/청라동/g, '검단');
    content = content.replace(/청라신도시/g, '검단신도시');
    
    // Specialty
    content = content.replace(/소화기 내과 전문의 2인 진료 의원/g, '여성소화기내과 전문의, 내분비내과 전문의 2인 진료 의원');
    content = content.replace(/소화기 내과 전문의/g, '여성소화기내과 및 내분비내과 전문의');
    content = content.replace(/전문의 2인 진료 의원/g, '전문의 2인 진료 의원'); // keep
    
    // URL
    content = content.replace(/cheongnananum\.co\.kr/g, 'asan-keunnae.co.kr');
    
    // Colors
    content = content.replace(/#1a5c6b/g, '#005b9f'); // Asan Medical Center typical blue
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.yml')) {
            replaceInFile(filePath);
        }
    });
}

walk(path.join(__dirname, 'app'));
walk(path.join(__dirname, 'lib'));
walk(path.join(__dirname, 'scripts'));
walk(path.join(__dirname, '.github'));
replaceInFile(path.join(__dirname, 'next-sitemap.config.js'));
replaceInFile(path.join(__dirname, '.env'));

console.log('Replacement done');
