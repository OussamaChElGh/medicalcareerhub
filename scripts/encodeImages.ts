import fs from 'fs';
import path from 'path';

const files = [
  'gryffindor.png', 
  'slytherin.png', 
  'ravenclaw.png', 
  'hufflepuff.png',
  'sorting-hat.png',
  'medical-background.jpg'
];
let output = 'export const mediaAssets: Record<string, string> = {\n';

for (const file of files) {
  const filePath = path.join(process.cwd(), 'public', file);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(file).replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const base64 = fs.readFileSync(filePath).toString('base64');
    const key = file.replace(/[-.]/g, '_');
    output += `  ${key}: 'data:${mime};base64,${base64}',\n`;
  }
}

output += '};\n';
fs.writeFileSync(path.join(process.cwd(), 'src', 'mediaAssets.ts'), output);
console.log('Successfully generated src/mediaAssets.ts');
