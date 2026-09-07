import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

function detectRepositoryRoot() {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: process.cwd(),
      encoding: 'utf8'
    }).trim();
  } catch {
    if (process.env.LLM_WIKI_ROOT) return process.env.LLM_WIKI_ROOT;
    throw new Error('无法定位知识库根目录；请在知识库仓库中运行，或设置 LLM_WIKI_ROOT。');
  }
}

function globalClaudeRoot() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

// settings.json 是入库的可移植源文件，安装时展开两个占位符：
// $CLAUDE_CONFIG_DIR → 已安装 hook 的绝对路径，保证 Windows 与 POSIX 都能定位；
// $LLM_WIKI_ROOT     → 本机知识库仓库根目录。在非 Git 的游戏工作目录开会话时，
//                      hook 无法靠 git rev-parse 定位仓库，必须依赖这个环境变量。
async function renderSettings(sourcePath, claudeRoot, repositoryRoot) {
  const settings = JSON.parse(await readFile(sourcePath, 'utf8'));

  if (settings.env && settings.env.LLM_WIKI_ROOT === '$LLM_WIKI_ROOT') {
    settings.env.LLM_WIKI_ROOT = repositoryRoot;
  }

  for (const groups of Object.values(settings.hooks || {})) {
    for (const group of groups || []) {
      for (const handler of group.hooks || []) {
        if (handler.type !== 'command') continue;
        handler.command = handler.command.replaceAll(
          '$CLAUDE_CONFIG_DIR',
          claudeRoot.replaceAll('\\', '/')
        );
      }
    }
  }
  return `${JSON.stringify(settings, null, 2)}\n`;
}

async function listSkills(sourceSkills) {
  try {
    const entries = await readdir(sourceSkills, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

export async function installGlobalClaude({
  repositoryRoot = detectRepositoryRoot(),
  claudeRoot = globalClaudeRoot()
} = {}) {
  const sourceSkills = path.join(repositoryRoot, '.agents', 'skills');
  const sourceHooks = path.join(repositoryRoot, '.claude', 'hooks');
  const sourceSettings = path.join(repositoryRoot, '.claude', 'settings.json');

  await mkdir(path.join(claudeRoot, 'skills'), { recursive: true });
  await mkdir(path.join(claudeRoot, 'hooks'), { recursive: true });

  await cp(
    path.join(repositoryRoot, 'CLAUDE.md'),
    path.join(claudeRoot, 'CLAUDE.md'),
    { force: true }
  );
  await cp(sourceSkills, path.join(claudeRoot, 'skills'), { recursive: true, force: true });
  await cp(sourceHooks, path.join(claudeRoot, 'hooks'), { recursive: true, force: true });
  await writeFile(
    path.join(claudeRoot, 'settings.json'),
    await renderSettings(sourceSettings, claudeRoot, repositoryRoot),
    'utf8'
  );

  return {
    repositoryRoot,
    claudeRoot,
    skills: await listSkills(sourceSkills),
    hooks: ['session-start.mjs', 'pre-tool-use.mjs']
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = await installGlobalClaude();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
