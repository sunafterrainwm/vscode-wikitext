import * as vscode from 'vscode';

export class HeadingCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    if (!context.diagnostics.length) {
      return [];
    }
    const fixes: vscode.CodeAction[] = [];
    for (const diagnostic of context.diagnostics) {
      if (!diagnostic.code || diagnostic.code !== 'uneven-heading') {
        continue;
      }
      const heading = document.getText(diagnostic.range);
      const headingIndex = document.offsetAt(diagnostic.range.start);
      const headingBegin = heading.match(/^={1,6}/);
      const headingEnd = heading.match(/=+$/);
      const headingEndRange = new vscode.Range(
        document.positionAt(headingIndex + headingEnd.index!),
        document.positionAt(
          headingIndex + headingEnd.index + headingEnd[0].length
        )
      );
      const fix = new vscode.CodeAction(
        'Fix uneven heading equal signs',
        vscode.CodeActionKind.QuickFix
      );
      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.replace(document.uri, headingEndRange, headingBegin[0]);
      fix.isPreferred = true;
      fixes.push(fix);
    }
    return fixes;
  }
}
