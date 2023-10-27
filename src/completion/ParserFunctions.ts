import * as vscode from 'vscode';
import { getCompletionItems } from '.';

export class ParserFunctionsCompletionProvider
  implements vscode.CompletionItemProvider
{
  private readonly completionItems: vscode.CompletionItem[];

  constructor() {
    this.completionItems = getCompletionItems('parserFunctions');
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
      !/\W/.test(text.charAt(position.character))
    )
      return [];
      const match = linePrefix.match(/(^|(?<!\{))\{\{#[a-z]*$/);
    if (!match) return [];
    return this.completionItems.map((item) => {
      item.range = new vscode.Range(position.translate(0, 2 - match[0].length), position);
      return item;
    });
  }
}
