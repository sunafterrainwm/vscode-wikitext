import {
  CancellationToken,
  FoldingContext,
  FoldingRange,
  FoldingRangeKind,
  FoldingRangeProvider,
  ProviderResult,
  TextDocument,
} from 'vscode';

export const HeadingRegex = /^(={1,6})\s*(.+?)\s*(=+)$/gm;

interface HeadingMarker {
  /** 1-6 */
  readonly level: number;
  /** >=0 */
  readonly start: number;
  /** end >= start */
  end: number;
  readonly content: string;
}

export class FoldingProvider implements FoldingRangeProvider {
  provideFoldingRanges(
    document: TextDocument,
    context: FoldingContext,
    token: CancellationToken
  ): ProviderResult<FoldingRange[]> {
    if (token.isCancellationRequested) return [];
    return this.getHeadingFoldingRanges(document);
  }

  private getHeadingFoldingRanges(document: TextDocument): FoldingRange[] {
    const headings: HeadingMarker[] = this.getHeadings(document);
    return headings.map((heading) => {
      if (heading.start !== heading.end) {
        return {
          start: heading.start,
          end: heading.end,
          kind: FoldingRangeKind.Region,
        } as FoldingRange;
      }
    });
  }

  private getHeadings(document: TextDocument): HeadingMarker[] {
    const headings: HeadingMarker[] = [];
    for (let line = 0; line < document.lineCount; line++) {
      const textLine = document.lineAt(line);
      if (textLine.isEmptyOrWhitespace) continue;
      const match = HeadingRegex.exec(textLine.text);
      if (match) {
        headings.push({
          level: match[1].length,
          start: line,
          end: line,
          content: match[2],
        });
      }
      if (!headings.length) continue;
      for (let level = headings.at(-1).level; level; level--) {
        const lastHeading = headings.findLast(
          (heading) => heading.level === level
        );
        if (!lastHeading) continue;
        lastHeading.end = line;
      }
    }
    return headings;
  }
}
