import fs from 'fs';

const buf = fs.readFileSync('public/sorting-hat.png');
console.log('Size:', buf.length);
console.log('Header:', buf.slice(0, 8).toString('hex'));
