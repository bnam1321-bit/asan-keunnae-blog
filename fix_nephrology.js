const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Endocrine -> Nephrology
    content = content.replace(/내분비내과/g, '신장내과');
    
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

console.log('Correction done');
