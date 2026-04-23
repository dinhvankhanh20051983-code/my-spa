#!/usr/bin/env node
import { execSync } from 'child_process';
import process from 'process';

const run = (command) => {
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch {
    console.error(`Lỗi khi chạy: ${command}`);
    process.exit(1);
  }
};

const [,, action, ...args] = process.argv;
const branch = args[0] || 'main';
const remote = args[1] || 'origin';

switch (action) {
  case 'status':
    run('git status --short');
    break;
  case 'init':
    run('git init');
    if (args[0]) {
      run(`git remote add ${remote} ${args[0]}`);
      console.log(`Remote '${remote}' đã được thêm: ${args[0]}`);
    } else {
      console.log('Chưa cung cấp URL remote. Dùng: node git-app.js init <remote-url> [branch]');
    }
    break;
  case 'add':
    run('git add .');
    break;
  case 'commit':
    if (!args[0]) {
      console.error('Cần thông điệp commit. Dùng: node git-app.js commit "message"');
      process.exit(1);
    }
    run(`git commit -m "${args.join(' ')}"`);
    break;
  case 'push':
    run(`git push ${remote} ${branch}`);
    break;
  case 'publish':
    run('git add .');
    run(`git commit -m "${args.join(' ') || 'Update app source'}"`);
    run(`git push ${remote} ${branch}`);
    break;
  default:
    console.log('Sử dụng: node git-app.js <action> [args]');
    console.log('Actions: status, init <remote-url>, add, commit <message>, push [branch] [remote], publish <message>');
}
