import {
  CancellationToken,
  FoldingContext,
  FoldingRange,
  FoldingRangeKind,
  FoldingRangeProvider,
  ProviderResult,
  TextDocument,
} from 'vscode';
import WikitextParser, { Token } from 'mediawiki-parser';

export const HeadingRegex = /^(={1,6})\s*(.+?)\s*(=+)$/gm;

export class FoldingProvider implements FoldingRangeProvider {
  provideFoldingRanges(
    document: TextDocument,
    context: FoldingContext,
    token: CancellationToken
  ): ProviderResult<FoldingRange[]> {
    const wikitextParser = new WikitextParser();
    const parsed = wikitextParser.parseWiki(document.getText());
    const headings: Token[] = [];
    const comments: Token[] = [];
    const transcludes: Token[] = [];

    function getTokens(root: Token) {
      root.children.forEach((child) => {
        getTokens(child);
        switch (child.type) {
          case 'heading':
            headings.push(child);
            break;
          case 'comment':
            comments.push(child);
            break;
          case 'transclude':
            transcludes.push(child);
            break;
        }
      });
    }

    getTokens(parsed);
    return [
      ...this.getHeadingFoldingRanges(document, headings),
      ...this.getCommentFoldingRanges(document, comments),
      ...this.getTranscludeFoldingRanges(document, transcludes),
    ];
  }

  private getHeadingFoldingRanges(document: TextDocument, headings: Token[]) {
    const ranges: FoldingRange[] = [];
    const stack: Token[] = [];
    for (const heading of headings) {
      let end = -1;
      while (
        stack.length &&
        stack.at(-1).children[0].position.length >=
          heading.children[0].position.length
      ) {
        const popedHeading = stack.pop();
        const start = document.positionAt(
          popedHeading.children.at(-1).position.begin
        ).line;
        if (end === -1) {
          end =
            document.positionAt(heading.children[0].position.begin).line - 1;
          while (document.lineAt(end).isEmptyOrWhitespace) end--;
        }
        ranges.push(new FoldingRange(start, end, FoldingRangeKind.Region));
      }
      stack.push(heading);
    }
    let end = document.lineCount - 1;
    while (document.lineAt(end).isEmptyOrWhitespace) end--;
    while (stack.length) {
      const rest = stack.pop();
      const start = document.positionAt(
        rest.children.at(-1).position.begin
      ).line;
      ranges.push(new FoldingRange(start, end, FoldingRangeKind.Region));
    }
    return ranges;
  }

  private getCommentFoldingRanges(document: TextDocument, comments: Token[]) {
    const ranges: FoldingRange[] = [];
    for (const comment of comments) {
      const start = document.positionAt(comment.position.begin).line;
      let end =
        document.positionAt(comment.position.end).line -
        (comment.children.length === 3 ? 1 : 0);
      while (document.lineAt(end).isEmptyOrWhitespace) end--;
      ranges.push(new FoldingRange(start, end, FoldingRangeKind.Comment));
    }
    return ranges;
  }

  private getTranscludeFoldingRanges(
    document: TextDocument,
    transcludes: Token[]
  ) {
    const ranges: FoldingRange[] = [];
    for (const transclude of transcludes) {
      const start = document.positionAt(transclude.position.begin).line;
      const end = document.positionAt(transclude.position.end).line - 1;
      ranges.push(new FoldingRange(start, end, FoldingRangeKind.Region));
    }
    return ranges;
  }
}
