import * as vscode from 'vscode';
import { getCompletionDoc } from './completion';

export class ParserFunctionsHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) return;
    const text = document.getText(wordRange);
    const fullRange = wordRange.with(
      wordRange.start.translate(0, -1),
      wordRange.end.translate(0, 1)
    );
    if (document.getText(fullRange) !== '#' + text + ':') return;
    const parserFunctionsDoc = getCompletionDoc('parserFunctions');
    const item = parserFunctionsDoc.items.find((item) => item.name === text);
    if (!item) return;
    const hover = new vscode.Hover(
      [
        new vscode.MarkdownString(item.detail),
        new vscode.MarkdownString(item.documentation),
      ],
      fullRange
    );
    return hover;
  }
}
