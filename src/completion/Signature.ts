import * as vscode from 'vscode';

export class SignatureCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    if (context.triggerKind === vscode.CompletionTriggerKind.TriggerCharacter) {
      const completionItems: vscode.CompletionItem[] = [
        {
          label: '~~~',
          detail: 'Signature alone. Resulting wiki code: [[User:Username|Username]]',
          kind: vscode.CompletionItemKind.Keyword,
        },
        {
          label: '~~~~',
          detail: 'Signature plus timestamp. Resulting wiki code: [[User:Username|Username]] 14:49, 31 August 2023 (UTC)',
          kind: vscode.CompletionItemKind.Keyword,
        },
        {
          label: '~~~~~',
          detail: 'Timestamp alone. Resulting wiki code: 14:49, 31 August 2023 (UTC)',
          kind: vscode.CompletionItemKind.Keyword,
        },
      ];
      return completionItems;
    }
  }
}
