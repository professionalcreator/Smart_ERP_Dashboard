import fs from 'fs';
import path from 'path';

const srcDir = './dist';
const destDir = './';

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

try {
  if (fs.existsSync(srcDir)) {
    console.log('Copying build from dist to root directory...');
    // Copy index.html and assets
    fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'));
    
    const assetsSrc = path.join(srcDir, 'assets');
    const assetsDest = path.join(destDir, 'assets');
    if (fs.existsSync(assetsSrc)) {
      copyFolderSync(assetsSrc, assetsDest);
    }
    
    // Copy other root public files
    fs.readdirSync(srcDir).forEach(file => {
      if (file !== 'index.html' && file !== 'assets') {
        const filePath = path.join(srcDir, file);
        if (fs.lstatSync(filePath).isFile()) {
          fs.copyFileSync(filePath, path.join(destDir, file));
        }
      }
    });
    console.log('Build files successfully copied to root!');
  } else {
    console.error('Source directory dist/ does not exist!');
  }
} catch (err) {
  console.error('Error copying build files:', err);
}
