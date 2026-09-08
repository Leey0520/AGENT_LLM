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

function globalClaudeRoot() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

// settings.json 是入库的可移植源文件；安装时只展开已安装 hook 的路径。
async function renderManagedSettings(sourcePath, claudeRoot) {
  const settings = JSON.parse(await readFile(sourcePath, 'utf8'));

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
  return settings;
}

async function readExistingSettings(settingsPath) {
  try {
    return JSON.parse(await readFile(settingsPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw new Error(`现有 Claude settings.json 无法解析，已停止安装且未覆盖：${error?.message ?? error}`);
  }
}

function isManagedHookGroup(group) {
  return (group?.hooks || []).some((handler) => {
    const command = String(handler?.command || '');
    return /[\\/]hooks[\\/](?:session-start|pre-tool-use)\.mjs(?:\"|\s|$)/i.test(command);
  });
}

function mergeHooks(existingHooks = {}, managedHooks = {}) {
  const merged = { ...existingHooks };
  for (const [eventName, managedGroups] of Object.entries(managedHooks)) {
    const existingGroups = Array.isArray(existingHooks[eventName])
      ? existingHooks[eventName].filter((group) => !isManagedHookGroup(group))
      : [];
    merged[eventName] = [...existingGroups, ...(managedGroups || [])];
  }
  return merged;
}

function mergeSettings(existing, managed) {
  const existingDeny = Array.isArray(existing?.permissions?.deny)
    ? existing.permissions.deny
    : [];
  const managedDeny = Array.isArray(managed?.permissions?.deny)
    ? managed.permissions.deny
    : [];

  return {
    ...existing,
    ...managed,
    env: {
      ...(existing['env'] || {}),
      ...(managed['env'] || {})
    },
    permissions: {
      ...(existing.permissions || {}),
      ...(managed.permissions || {}),
      deny: [...new Set([...existingDeny, ...managedDeny])]
    },
    hooks: mergeHooks(existing.hooks, managed.hooks)
  };
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
  const destinationSettings = path.join(claudeRoot, 'settings.json');

  await mkdir(path.join(claudeRoot, 'skills'), { recursive: true });
  await mkdir(path.join(claudeRoot, 'hooks'), { recursive: true });

  await cp(
    path.join(repositoryRoot, 'CLAUDE.md'),
    path.join(claudeRoot, 'CLAUDE.md'),
    { force: true }
  );
  await installRenderedSkills(sourceSkills, path.join(claudeRoot, 'skills'), repositoryRoot);
  await cp(sourceHooks, path.join(claudeRoot, 'hooks'), { recursive: true, force: true });
  await installRenderedHook(
    path.join(sourceHooks, 'session-start.mjs'),
    path.join(claudeRoot, 'hooks', 'session-start.mjs'),
    repositoryRoot
  );
  const existingSettings = await readExistingSettings(destinationSettings);
  const managedSettings = await renderManagedSettings(sourceSettings, claudeRoot);
  await writeFile(
    destinationSettings,
    `${JSON.stringify(mergeSettings(existingSettings, managedSettings), null, 2)}\n`,
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
