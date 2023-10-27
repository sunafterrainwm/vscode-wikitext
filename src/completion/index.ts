import * as fs from 'fs';
import * as jsYaml from 'js-yaml';
import * as path from 'path';
import { CompletionItem, CompletionItemKind, MarkdownString } from 'vscode';

interface CompletionDoc {
  items: {
    name: string;
    detail?: string;
    documentation: string;
  }[];
  label: {
    prefix: string;
    suffix: string;
  };
  description: string;
  itemKind: CompletionItemKind;
}

export function getCompletionDoc(docName: string): CompletionDoc {
  const docStr = fs.readFileSync(
    path.join(__dirname, '..', '..', 'docs', docName + '.yaml'),
    'utf8'
  );
  return jsYaml.load(docStr) as CompletionDoc;
}

export function getCompletionItems(docName: string): CompletionItem[] {
  const doc = getCompletionDoc(docName);
  return doc.items.map((item) => {
    const completionItem = new CompletionItem(
      {
        label: doc.label.prefix + item.name + doc.label.suffix,
        description: doc.description,
      },
      doc.itemKind
    );
    if (item.detail) completionItem.detail = item.detail;
    completionItem.documentation = new MarkdownString(item.documentation);
    return completionItem;
  });
}

export * from './BehaviorSwitches';
export * from './ParserFunctions';
export * from './Signature';
