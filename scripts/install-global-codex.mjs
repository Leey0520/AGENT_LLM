import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
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

function globalCodexRoot() {
  return process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
}

function sourceHookPath(repoRoot, hookName) {
  return path.join(repoRoot, '.codex', 'hooks', hookName);
}

function globalHookPath(codexRoot, hookName) {
  return path.join(codexRoot, 'hooks', hookName);
}

async function renderGlobalHooks(sourcePath, codexRoot) {
  const hooks = JSON.parse(await readFile(sourcePath, 'utf8'));
  for (const [eventName, groups] of Object.entries(hooks.hooks || {})) {
    for (const group of groups || []) {
      for (const handler of group.hooks || []) {
        if (handler.type !== 'command') continue;
        const hookName = eventName === 'SessionStart' ? 'session-start.mjs' : 'pre-tool-use.mjs';
        const posixPath = globalHookPath(codexRoot, hookName).replaceAll('\\', '/');
        const windowsPath = globalHookPath(codexRoot, hookName);
        handler.command = `node "${posixPath}"`;
        handler.commandWindows = `node "${windowsPath}"`;
      }
    }
  }
  return `${JSON.stringify(hooks, null, 2)}\n`;
}

export async function installGlobalCodex({ repositoryRoot = detectRepositoryRoot(), codexRoot = globalCodexRoot() } = {}) {
  const sourceSkills = path.join(repositoryRoot, '.agents', 'skills');
  const sourceHooks = path.join(repositoryRoot, '.codex', 'hooks');
  const sourceHooksConfig = path.join(repositoryRoot, '.codex', 'hooks.json');

  await mkdir(path.join(codexRoot, 'skills'), { recursive: true });
  await mkdir(path.join(codexRoot, 'hooks'), { recursive: true });
  await cp(path.join(repositoryRoot, 'AGENTS.md'), path.join(codexRoot, 'AGENTS.md'), { force: true });
  await cp(sourceSkills, path.join(codexRoot, 'skills'), { recursive: true, force: true });
  await cp(sourceHooks, path.join(codexRoot, 'hooks'), { recursive: true, force: true });
  await writeFile(
    path.join(codexRoot, 'hooks.json'),
    await renderGlobalHooks(sourceHooksConfig, codexRoot),
    'utf8'
  );

  return {
    repositoryRoot,
    codexRoot,
    skills: ['game-data-analysis', 'knowledge-maintenance'],
    hooks: ['session-start.mjs', 'pre-tool-use.mjs']
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = await installGlobalCodex();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
