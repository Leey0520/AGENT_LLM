const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let input = {};
try {
  input = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
} catch {
  process.exit(0);
}

const toolName = input.tool_name || '';
const toolInput = input.tool_input || {};
const command = String(toolInput.command ?? toolInput.cmd ?? toolInput.patch ?? '');
const sensitivePath = /(?:^|[\\/\s"'])(?:\.ae-cli|secure-tokens)(?:[\\/\s"']|$)|(?:^|[\\/\s"'])(?:auth|credentials)\.json(?:$|[\\/\s"'])|\.env(?:\.|$|[\\/\s"'])/i;

let reason = '';

if (/^(apply_patch|Edit|Write)$/i.test(toolName)) {
  const targets = [...command.matchAll(/^\*\*\*\s+(?:Add|Update|Delete) File:\s*(.+)$/gmi)].map((match) => match[1].trim());
  if (targets.some((target) => sensitivePath.test(target))) {
    reason = '禁止通过文件编辑工具修改凭据、授权缓存或 .ae-cli 目录。';
  }
}

if (/^Bash$/i.test(toolName)) {
  if (/\bgit\s+reset\s+--hard\b/i.test(command)) {
    reason = '知识库禁止 git reset --hard；请使用可恢复的分支或提交处理。';
  } else if (/\bgit\s+push\b[\s\S]*(?:--force(?:-with-lease)?|(?:^|\s)-f(?:\s|$))/i.test(command)) {
    reason = '知识库禁止强制推送。';
  } else if (/\bgit\s+clean\b[\s\S]*(?:^|\s)-[^\s]*[dx][^\s]*/i.test(command)) {
    reason = '禁止使用 git clean 删除未跟踪或被忽略文件，以免清除本地授权状态。';
  } else if (sensitivePath.test(command) && /\b(?:Remove-Item|Set-Content|Add-Content|Out-File|Move-Item|Copy-Item|New-Item|rm|mv|cp|del|erase|rmdir|touch|tee)\b|(?:^|[^>])>{1,2}(?!=)/i.test(command)) {
    reason = '禁止修改凭据、授权缓存或 .ae-cli 目录。';
  }
}

if (reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason
    }
  }));
}
