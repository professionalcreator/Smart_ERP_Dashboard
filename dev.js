import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('--- Starting SmartERP Workspace ---');
console.log('Booting Frontend and Backend services...');

const runProcess = (name, dir, args, colorCode) => {
  const proc = spawn(npmCmd, args, {
    cwd: path.join(__dirname, dir),
    shell: true
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) {
        console.error(`\x1b[31m[${name} ERROR]\x1b[0m ${line}`);
      }
    });
  });

  proc.on('close', (code) => {
    console.log(`[${name}] process exited with code ${code}`);
  });

  return proc;
};

// Run backend on PORT 5000 (color code 32 = green)
const backend = runProcess('Backend', 'backend', ['run', 'dev'], '32');

// Run frontend on PORT 5173 (color code 36 = cyan)
const frontend = runProcess('Frontend', 'frontend', ['run', 'dev'], '36');

process.on('SIGINT', () => {
  console.log('\nStopping all services...');
  backend.kill();
  frontend.kill();
  process.exit();
});
