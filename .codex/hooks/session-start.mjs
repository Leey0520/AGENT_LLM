import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const knowledgeRoot = process.env.LLM_WIKI_ROOT || 'C:\\Users\\Administrator\\Documents\\通用项目';
const { syncKnowledge } = await import(
  pathToFileURL(join(knowledgeRoot, 'scripts', 'sync-knowledge.mjs')).href
);

const result = syncKnowledge(knowledgeRoot);
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
