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
    throw new Error('无法定位知识库根目录；请在知识库仓库中运行安装脚本。');
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

function renderInstalledJavaScript(content, repositoryRoot) {
  return content.replaceAll(
    '__INSTALLED_KNOWLEDGE_ROOT__',
    JSON.stringify(repositoryRoot).slice(1, -1)
  );
}

function renderInstalledText(content, repositoryRoot) {
  return content.replaceAll('__INSTALLED_KNOWLEDGE_ROOT__', repositoryRoot);
}

async function installRenderedHook(sourcePath, destinationPath, repositoryRoot) {
  const source = await readFile(sourcePath, 'utf8');
  await writeFile(destinationPath, renderInstalledJavaScript(source, repositoryRoot), 'utf8');
}

async function installRenderedSkills(sourceSkills, destinationSkills, repositoryRoot) {
  await cp(sourceSkills, destinationSkills, { recursive: true, force: true });
  const entries = await readdir(sourceSkills, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sourceSkill = path.join(sourceSkills, entry.name, 'SKILL.md');
    const destinationSkill = path.join(destinationSkills, entry.name, 'SKILL.md');
    try {
      const source = await readFile(sourceSkill, 'utf8');
      await writeFile(destinationSkill, renderInstalledText(source, repositoryRoot), 'utf8');
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

export async function installGlobalCodex({
  repositoryRoot = detectRepositoryRoot(),
  codexRoot = globalCodexRoot(),
  skillsRoot = path.join(os.homedir(), '.agents', 'skills')
} = {}) {
  const sourceSkills = path.join(repositoryRoot, '.agents', 'skills');
  const sourceHooks = path.join(repositoryRoot, '.codex', 'hooks');
  const sourceHooksConfig = path.join(repositoryRoot, '.codex', 'hooks.json');

  await mkdir(skillsRoot, { recursive: true });
  await mkdir(path.join(codexRoot, 'hooks'), { recursive: true });
  await cp(path.join(repositoryRoot, 'AGENTS.md'), path.join(codexRoot, 'AGENTS.md'), { force: true });
  await installRenderedSkills(sourceSkills, skillsRoot, repositoryRoot);
  await cp(sourceHooks, path.join(codexRoot, 'hooks'), { recursive: true, force: true });
  await installRenderedHook(
    sourceHookPath(repositoryRoot, 'session-start.mjs'),
    globalHookPath(codexRoot, 'session-start.mjs'),
    repositoryRoot
  );
  await writeFile(
    path.join(codexRoot, 'hooks.json'),
    await renderGlobalHooks(sourceHooksConfig, codexRoot),
    'utf8'
  );

  return {
    repositoryRoot,
    codexRoot,
    skillsRoot,
    skills: ['game-data-analysis', 'knowledge-maintenance'],
    hooks: ['session-start.mjs', 'pre-tool-use.mjs']
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = await installGlobalCodex();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
