import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const configuredKnowledgeRoot = "__INSTALLED_KNOWLEDGE_ROOT__";
const unresolvedKnowledgeRoot = '__' + 'INSTALLED_KNOWLEDGE_ROOT__';

let knowledgeRoot = configuredKnowledgeRoot === unresolvedKnowledgeRoot
  ? ''
  : configuredKnowledgeRoot;
if (!knowledgeRoot) {
  try {
    knowledgeRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: process.cwd(),
      encoding: 'utf8'
    }).trim();
  } catch {
    knowledgeRoot = '';
  }
}

if (!knowledgeRoot) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: '当前 Hook 尚未绑定本机知识库。请在知识库仓库中运行 node scripts/install-global-codex.mjs。'
    }
  }));
  process.exit(0);
}

let result;
try {
  const { syncKnowledge } = await import(
    pathToFileURL(join(knowledgeRoot, 'scripts', 'sync-knowledge.mjs')).href
  );
  result = syncKnowledge(knowledgeRoot);
} catch (error) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: [
        `知识库同步未执行：${error?.message ?? error}`,
        `知识库位置：${knowledgeRoot}`,
        '引用知识前先手动确认仓库同步状态。'
      ].join('\n')
    }
  }));
  process.exit(0);
}
const context = [
  `知识库同步状态：${result.message}`,
  `知识库位置：${knowledgeRoot}`,
  '分析前先查看 index.md，并只读取当前游戏及任务相关知识。',
  '项目口径缺失或冲突时停止，不得套用其他游戏的事件、属性或指标定义。'
].join('\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context
  }
}));
