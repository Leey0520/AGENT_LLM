import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const knowledgeRoot = path.join(repositoryRoot, 'knowledge');
const indexPath = path.join(repositoryRoot, 'index.md');
const requiredFields = ['id', 'title', 'scope', 'status', 'owner', 'reviewed_at', 'tags'];
const allowedScopes = new Set(['platform', 'method', 'project']);
const allowedStatuses = new Set(['draft', 'approved', 'retired']);
const scopeLabels = new Map([
  ['platform', '平台知识'],
  ['method', '通用方法'],
  ['project', '项目知识']
]);

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function listMarkdownFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listMarkdownFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
  }
  return files.sort((left, right) => normalizePath(left).localeCompare(normalizePath(right), 'en'));
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseValue(rawValue) {
  const value = rawValue.trim();
  if (value.startsWith('[') && value.endsWith(']')) {
    const body = value.slice(1, -1).trim();
    if (!body) return [];
    return body.split(',').map((item) => unquote(item.trim()));
  }
  return unquote(value);
}

function parseFrontMatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { data: null, error: '缺少文件开头的 YAML Front Matter' };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const fieldMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!fieldMatch) return { data: null, error: `无法解析 Front Matter 行：${line}` };
    data[fieldMatch[1]] = parseValue(fieldMatch[2]);
  }
  return { data, error: null };
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function collectPages() {
  return listMarkdownFiles(knowledgeRoot).map((filePath) => {
    const relativePath = normalizePath(path.relative(repositoryRoot, filePath));
    const parsed = parseFrontMatter(filePath);
    return { filePath, relativePath, data: parsed.data, parseError: parsed.error };
  });
}

function validatePages(pages) {
  const errors = [];
  const ids = new Map();

  for (const page of pages) {
    if (page.parseError) {
      errors.push(`${page.relativePath}: ${page.parseError}`);
      continue;
    }

    const data = page.data;
    for (const field of requiredFields) {
      if (!(field in data) || data[field] === '') errors.push(`${page.relativePath}: 缺少必填字段 ${field}`);
    }

    if (data.id && !/^[a-z0-9][a-z0-9._-]*$/.test(data.id)) {
      errors.push(`${page.relativePath}: id 只能使用小写字母、数字、点、下划线和连字符`);
    }
    if (data.id) {
      const existing = ids.get(data.id);
      if (existing) errors.push(`${page.relativePath}: id ${data.id} 与 ${existing} 重复`);
      else ids.set(data.id, page.relativePath);
    }
    if (data.scope && !allowedScopes.has(data.scope)) {
      errors.push(`${page.relativePath}: scope 必须是 platform、method 或 project`);
    }
    if (data.status && !allowedStatuses.has(data.status)) {
      errors.push(`${page.relativePath}: status 必须是 draft、approved 或 retired`);
    }
    if (data.reviewed_at && !isValidDate(data.reviewed_at)) {
      errors.push(`${page.relativePath}: reviewed_at 必须是有效的 YYYY-MM-DD 日期`);
    }
    if ('tags' in data && (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => !tag))) {
      errors.push(`${page.relativePath}: tags 必须是非空行内数组`);
    }

    const parts = page.relativePath.split('/');
    const projectDirectory = parts[0] === 'knowledge' && parts[1] === 'projects' && parts.length > 3
      ? parts[2]
      : null;

    if (data.scope === 'project') {
      if (!data.project) errors.push(`${page.relativePath}: project scope 页面必须填写 project`);
      if (!projectDirectory) errors.push(`${page.relativePath}: project scope 页面必须位于 knowledge/projects/<project>/`);
      if (projectDirectory && data.project !== projectDirectory) {
        errors.push(`${page.relativePath}: project 字段 ${data.project} 与目录 ${projectDirectory} 不一致`);
      }
    }
    if (projectDirectory && data.scope !== 'project') {
      errors.push(`${page.relativePath}: 游戏项目目录内页面的 scope 必须是 project`);
    }
  }

  return errors;
}

function escapeCell(value) {
  return String(value ?? '-').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function buildIndexContent(pages) {
  const usablePages = pages
    .filter((page) => page.data)
    .sort((left, right) => {
      const scopeOrder = ['platform', 'method', 'project'];
      const scopeDifference = scopeOrder.indexOf(left.data.scope) - scopeOrder.indexOf(right.data.scope);
      if (scopeDifference) return scopeDifference;
      const projectDifference = String(left.data.project ?? '').localeCompare(String(right.data.project ?? ''), 'en');
      if (projectDifference) return projectDifference;
      return left.data.title.localeCompare(right.data.title, 'zh-CN');
    });

  const lines = [
    '# 知识索引',
    '',
    '> 本文件由 `node scripts/knowledge-tool.mjs build-index` 自动生成，请勿手工编辑。',
    ''
  ];

  for (const scope of ['platform', 'method', 'project']) {
    const scopedPages = usablePages.filter((page) => page.data.scope === scope);
    lines.push(`## ${scopeLabels.get(scope)}`, '');
    lines.push('| ID | 标题 | 项目 | 状态 | 复核日期 | 路径 |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const page of scopedPages) {
      const link = `./${page.relativePath}`;
      lines.push(`| ${escapeCell(page.data.id)} | ${escapeCell(page.data.title)} | ${escapeCell(page.data.project)} | ${escapeCell(page.data.status)} | ${escapeCell(page.data.reviewed_at)} | [打开](${link}) |`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function printErrors(errors) {
  for (const error of errors) process.stderr.write(`ERROR ${error}\n`);
  process.stderr.write(`校验失败：${errors.length} 个问题。\n`);
}

function main() {
  const command = process.argv[2];
  const pages = collectPages();
  const errors = validatePages(pages);

  if (!['build-index', 'validate'].includes(command)) {
    process.stderr.write('用法：node scripts/knowledge-tool.mjs <build-index|validate> [--check-index]\n');
    process.exitCode = 2;
    return;
  }

  if (errors.length > 0) {
    printErrors(errors);
    process.exitCode = 1;
    return;
  }

  const expectedIndex = buildIndexContent(pages);

  if (command === 'build-index') {
    fs.writeFileSync(indexPath, expectedIndex, 'utf8');
    process.stdout.write(`已生成 index.md，共 ${pages.length} 个知识页面。\n`);
    return;
  }

  if (process.argv.includes('--check-index')) {
    const currentIndex = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
    if (currentIndex !== expectedIndex) {
      process.stderr.write('ERROR index.md 已过期，请运行 node scripts/knowledge-tool.mjs build-index\n');
      process.exitCode = 1;
      return;
    }
  }

  process.stdout.write(`知识校验通过，共 ${pages.length} 个页面。\n`);
}

main();
