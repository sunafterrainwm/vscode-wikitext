import {
  Diagnostic,
  DocumentSelector,
  ExtensionContext,
  Range,
  TextDocument,
  TextDocumentChangeEvent,
  languages,
  workspace,
} from 'vscode';
import { HeadingCodeActionProvider } from './HeadingCodeActionProvider';
import {
  BehaviorSwitchesCompletionProvider,
  ParserFunctionsCompletionProvider,
  SignatureCompletionProvider,
} from './completion';
import { FoldingProvider as FoldingRangeProvider, HeadingRegex } from './foldingRange';
import { ParserFunctionsHoverProvider } from './parserFunctionsHoverProvider';

export const diagnosticCollection =
  languages.createDiagnosticCollection('wikitext');

const WIKITEXT_SELECTOR: DocumentSelector = {
  language: 'wikitext',
  scheme: 'file',
};

function diagnoseDocument(document: TextDocument): Diagnostic[] {
  const text = document.getText();
  const diags: Diagnostic[] = [];
  let match: RegExpExecArray | null;
  while ((match = HeadingRegex.exec(text)) !== null) {
    if (match[1].length !== match[3].length) {
      const diag = new Diagnostic(
        new Range(
          document.positionAt(match.index),
          document.positionAt(match.index + match[0].length)
        ),
        "Title's start and end equal signs don't match."
      );
      diag.code = 'uneven-heading';
      diag.source = 'wikitext';
      diags.push(diag);
    }
  }
  return diags;
}

function createDiagnostic(context: ExtensionContext) {
  context.subscriptions.push(diagnosticCollection);

  workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
    if (e.document.languageId !== 'wikitext') return;
    diagnosticCollection.set(e.document.uri, diagnoseDocument(e.document));
  });
  workspace.onDidOpenTextDocument((e: TextDocument) => {
    if (e.languageId !== 'wikitext') return;
    diagnosticCollection.set(e.uri, diagnoseDocument(e));
  });
  workspace.onDidCloseTextDocument((e: TextDocument) => {
    if (e.languageId !== 'wikitext') return;
    diagnosticCollection.delete(e.uri);
  });
}

export function activate(context: ExtensionContext) {
  const foldingRangeProvider = languages.registerFoldingRangeProvider(
    WIKITEXT_SELECTOR,
    new FoldingRangeProvider()
  );

  const codeActionsProvider = languages.registerCodeActionsProvider(
    WIKITEXT_SELECTOR,
    new HeadingCodeActionProvider()
  );

  const behaviorSwitchesCompletionProvider =
    languages.registerCompletionItemProvider(
      WIKITEXT_SELECTOR,
      new BehaviorSwitchesCompletionProvider(),
      '_'
    );

  const signatureCompletionProvider = languages.registerCompletionItemProvider(
    WIKITEXT_SELECTOR,
    new SignatureCompletionProvider(),
    '~'
  );

  const parserFunctionsCompletionProvider =
    languages.registerCompletionItemProvider(
      WIKITEXT_SELECTOR,
      new ParserFunctionsCompletionProvider(),
      '#'
    );

  const parserFunctionsHoverProvider = languages.registerHoverProvider(
    WIKITEXT_SELECTOR,
    new ParserFunctionsHoverProvider()
  );

  context.subscriptions.push(
    foldingRangeProvider,
    codeActionsProvider,
    behaviorSwitchesCompletionProvider,
    signatureCompletionProvider,
    parserFunctionsCompletionProvider,
    parserFunctionsHoverProvider
  );

  createDiagnostic(context);
}

export function deactivate() {}
