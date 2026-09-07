import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

let knowledgeRoot = process.env.LLM_WIKI_ROOT;
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

function emit(additionalContext) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext
    }
  }));
}

if (!knowledgeRoot) {
  emit('未设置 LLM_WIKI_ROOT，无法定位共享知识库；请先配置知识库根目录。');
  process.exit(0);
}

let result;
try {
  const { syncKnowledge } = await import(
    pathToFileURL(join(knowledgeRoot, 'scripts', 'sync-knowledge.mjs')).href
  );
  result = syncKnowledge(knowledgeRoot);
} catch (error) {
  emit([
    `知识库同步未执行：${error?.message ?? error}`,
    `知识库位置：${knowledgeRoot}`,
    '引用知识前先手动确认仓库同步状态。'
  ].join('\n'));
  process.exit(0);
}

emit([
  `知识库同步状态：${result.message}`,
  `知识库位置：${knowledgeRoot}`,
  '分析前先查看 index.md，并只读取当前游戏及任务相关知识。',
  '项目口径缺失或冲突时停止，不得套用其他游戏的事件、属性或指标定义。',
  '改动 .claude/、.agents/ 或 CLAUDE.md 后需运行 node scripts/install-global-claude.mjs 才会生效。'
].join('\n'));
