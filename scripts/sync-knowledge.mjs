import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

function runGit(argumentsList, cwd) {
  return execFileSync('git', argumentsList, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function failureMessage(error) {
  const stderr = error?.stderr?.toString().trim();
  return stderr || error?.message || '未知 Git 错误';
}

export function syncKnowledge(startDirectory = process.cwd()) {
  let root;
  try {
    root = runGit(['rev-parse', '--show-toplevel'], startDirectory);
  } catch (error) {
    return { status: 'error', message: `当前目录不是 Git 仓库：${failureMessage(error)}` };
  }

  try {
    runGit(['remote', 'get-url', 'origin'], root);
  } catch {
    return { status: 'skipped', root, message: '未配置 origin，跳过自动同步。' };
  }

  try {
    runGit(['fetch', '--prune', 'origin'], root);
  } catch (error) {
    return { status: 'error', root, message: `git fetch 失败，未修改本地文件：${failureMessage(error)}` };
  }

  let branch;
  try {
    branch = runGit(['branch', '--show-current'], root);
  } catch (error) {
    return { status: 'error', root, message: `无法识别当前分支：${failureMessage(error)}` };
  }

  if (branch !== 'main') {
    return { status: 'skipped', root, branch, message: `当前分支为 ${branch || 'detached HEAD'}；已 fetch，但仅 main 会自动快进。` };
  }

  const dirty = runGit(['status', '--porcelain'], root).length > 0;

  let upstream;
  try {
    upstream = runGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], root);
  } catch {
    return { status: 'skipped', root, branch, message: 'main 没有上游分支；已 fetch，未修改本地文件。' };
  }

  const counts = runGit(['rev-list', '--left-right', '--count', `HEAD...${upstream}`], root)
    .split(/\s+/)
    .map(Number);
  const [ahead, behind] = counts;

  if (dirty) {
    return { status: 'skipped', root, branch, upstream, ahead, behind, message: `工作区有未提交修改；已 fetch，未自动合并。本地落后 ${behind}，本地领先 ${ahead}。` };
  }

  if (ahead > 0 && behind > 0) {
    return { status: 'skipped', root, branch, upstream, ahead, behind, message: `main 已分叉；未自动合并。本地落后 ${behind}，本地领先 ${ahead}。` };
  }

  if (ahead > 0) {
    return { status: 'skipped', root, branch, upstream, ahead, behind, message: `本地 main 领先 ${ahead} 个提交；未自动推送或改写历史。` };
  }

  if (behind === 0) {
    return { status: 'current', root, branch, upstream, ahead, behind, message: '知识库已经是最新版本。' };
  }

  try {
    runGit(['merge', '--ff-only', upstream], root);
    return { status: 'updated', root, branch, upstream, ahead: 0, behind: 0, message: `已从 ${upstream} 安全快进 ${behind} 个提交。` };
  } catch (error) {
    return { status: 'error', root, branch, upstream, ahead, behind, message: `快进失败，未改写历史：${failureMessage(error)}` };
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const jsonMode = process.argv.includes('--json');
  const result = syncKnowledge();
  process.stdout.write(jsonMode ? `${JSON.stringify(result)}\n` : `${result.message}\n`);
  if (result.status === 'error') process.exitCode = 1;
}
