import * as vscode from 'vscode';
import { getCompletionItems } from '.';

export class BehaviorSwitchesCompletionProvider
  implements vscode.CompletionItemProvider
{
  private readonly completionItems: vscode.CompletionItem[];

  constructor() {
    this.completionItems = getCompletionItems('behaviorSwitches');
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    const text = document.lineAt(position).text;
    const linePrefix = text.substring(0, position.character);
    if (
      text.length > position.character &&
      !/\s/.test(text.charAt(position.character))
    )
      return [];
    const match = linePrefix.match(/(^|(?<!_))__(?=([A-Z]|$))[A-Z_]*$/);
    if (!match) return [];
    return this.completionItems.map((item) => {
      item.range = new vscode.Range(position.translate(0, -match[0].length), position);
      return item;
    });
  }
}
