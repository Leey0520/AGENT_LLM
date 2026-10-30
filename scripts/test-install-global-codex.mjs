import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { installGlobalCodex } from './install-global-codex.mjs';

async function fixture(t) {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'wiki-codex-install-test-'));
  t.after(async () => {
    // Only remove the exact temporary directory created by this test.
    assert.equal(path.dirname(temporaryRoot), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temporaryRoot).startsWith('wiki-codex-install-test-'));
    await rm(temporaryRoot, { recursive: true });
  });
  const repositoryRoot = path.join(temporaryRoot, '知识库');
  const codexRoot = path.join(temporaryRoot, 'custom-codex-home');
  const skillsRoot = path.join(temporaryRoot, 'user-home', '.agents', 'skills');
  for (const skill of ['game-data-analysis', 'knowledge-maintenance']) {
    const folder = path.join(repositoryRoot, '.agents', 'skills', skill);
    await mkdir(path.join(folder, 'references'), { recursive: true });
    await writeFile(path.join(folder, 'SKILL.md'), `# ${skill}\n__INSTALLED_KNOWLEDGE_ROOT__\n`);
    await writeFile(path.join(folder, 'references', 'example.md'), 'reference material');
  }
  const hooksRoot = path.join(repositoryRoot, '.codex');
  await mkdir(path.join(hooksRoot, 'hooks'), { recursive: true });
  await writeFile(path.join(repositoryRoot, 'AGENTS.md'), '# Shared rules');
  await writeFile(path.join(hooksRoot, 'hooks', 'session-start.mjs'), 'export const root = "__INSTALLED_KNOWLEDGE_ROOT__";\n');
  await writeFile(path.join(hooksRoot, 'hooks', 'pre-tool-use.mjs'), 'export const safe = true;\n');
  await writeFile(path.join(hooksRoot, 'hooks.json'), JSON.stringify({ hooks: {
    SessionStart: [{ hooks: [{ type: 'command', command: 'source-hook' }] }],
    PreToolUse: [{ hooks: [{ type: 'command', command: 'source-hook' }] }]
  } }));
  return { repositoryRoot, codexRoot, skillsRoot };
}

test('installs skills independently of CODEX_HOME and binds the knowledge root', async (t) => {
  const options = await fixture(t);
  const result = await installGlobalCodex(options);
  assert.equal(result.skillsRoot, options.skillsRoot);
  assert.equal(result.codexRoot, options.codexRoot);
  await assert.rejects(access(path.join(options.codexRoot, 'skills')), { code: 'ENOENT' });
  for (const name of result.skills) {
    const installed = await readFile(path.join(options.skillsRoot, name, 'SKILL.md'), 'utf8');
    assert.ok(installed.includes(options.repositoryRoot));
    assert.ok(!installed.includes('__INSTALLED_KNOWLEDGE_ROOT__'));
    assert.equal(await readFile(path.join(options.skillsRoot, name, 'references', 'example.md'), 'utf8'), 'reference material');
  }
  const source = await readFile(path.join(options.repositoryRoot, '.agents', 'skills', 'game-data-analysis', 'SKILL.md'), 'utf8');
  assert.ok(source.includes('__INSTALLED_KNOWLEDGE_ROOT__'));
  assert.equal(await readFile(path.join(options.codexRoot, 'AGENTS.md'), 'utf8'), '# Shared rules');
  const hook = await import(pathToFileURL(path.join(options.codexRoot, 'hooks', 'session-start.mjs')).href);
  assert.equal(hook.root, options.repositoryRoot);
  const hooks = JSON.parse(await readFile(path.join(options.codexRoot, 'hooks.json'), 'utf8'));
  assert.equal(hooks.hooks.SessionStart[0].hooks[0].commandWindows, `node "${path.join(options.codexRoot, 'hooks', 'session-start.mjs')}"`);
  assert.equal(hooks.hooks.PreToolUse[0].hooks[0].commandWindows, `node "${path.join(options.codexRoot, 'hooks', 'pre-tool-use.mjs')}"`);
});

test('reinstall updates owned skills without touching unrelated or legacy skills', async (t) => {
  const options = await fixture(t);
  const unrelated = path.join(options.skillsRoot, 'ae-existing');
  const legacy = path.join(options.codexRoot, 'skills', 'legacy-skill');
  await mkdir(unrelated, { recursive: true });
  await mkdir(legacy, { recursive: true });
  await writeFile(path.join(unrelated, 'SKILL.md'), 'keep unrelated skill');
  await writeFile(path.join(legacy, 'SKILL.md'), 'keep legacy skill');
  await installGlobalCodex(options);
  const source = path.join(options.repositoryRoot, '.agents', 'skills', 'game-data-analysis', 'SKILL.md');
  await writeFile(source, '# Updated\n__INSTALLED_KNOWLEDGE_ROOT__\n');
  await installGlobalCodex(options);
  assert.equal(await readFile(path.join(unrelated, 'SKILL.md'), 'utf8'), 'keep unrelated skill');
  assert.equal(await readFile(path.join(legacy, 'SKILL.md'), 'utf8'), 'keep legacy skill');
  assert.equal(await readFile(path.join(options.skillsRoot, 'game-data-analysis', 'SKILL.md'), 'utf8'), `# Updated\n${options.repositoryRoot}\n`);
});
