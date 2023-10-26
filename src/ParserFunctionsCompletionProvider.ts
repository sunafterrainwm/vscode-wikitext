import * as vscode from 'vscode';
export class ParserFunctionsCompletionProvider
  implements vscode.CompletionItemProvider
{
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    const linePrefix = document
      .lineAt(position)
      .text.substring(0, position.character);
    if (!/(^|(?<!\{))\{\{#$/.test(linePrefix)) return [];
    const parserFunctionOptions = [
      {
        label: 'expr',
        detail: '',
      },
      {
        label: 'if',
        detail: '',
      },
      {
        label: 'ifeq',
        detail: '',
      },
      {
        label: 'iferror',
        detail: '',
      },
      {
        label: 'ifexpr',
        detail: '',
      },
      {
        label: 'ifexist',
        detail: '',
      },
      {
        label: 'rel2abs',
        detail: '',
      },
      {
        label: 'switch',
        detail: '',
      },
      {
        label: 'time',
        detail: '',
      },
      {
        label: 'timel',
        detail: '',
      },
      {
        label: 'titleparts',
        detail: '',
      },
    ];
    const completionItems = parserFunctionOptions.map((option) => {
      const completionItem = new vscode.CompletionItem(
        {
          label: `#${option.label}`,
          detail: option.detail,
        },
        vscode.CompletionItemKind.Function
      );
      completionItem.insertText = option.label + ': ';
      return completionItem;
    });
    return completionItems;
  }
}
