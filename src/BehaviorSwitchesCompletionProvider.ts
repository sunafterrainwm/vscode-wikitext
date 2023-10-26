import * as vscode from 'vscode';

export class BehaviorSwitchesCompletionProvider
  implements vscode.CompletionItemProvider
{
  private readonly completionItems: vscode.CompletionItem[];

  constructor() {
    const magicWordOptions = [
      { label: 'NOTOC', detail: 'Hides the table of contents (TOC).' },
      {
        label: 'FORCETOC',
        detail:
          'Forces the table of contents to appear at its normal position (before the first header, overriding __NOTOC__). This will not work in skins that present table of contents outside the article content e.g. Vector 2022 skin.',
      },
      {
        label: 'TOC',
        detail:
          "Places a table of contents at the word's current position (overriding __NOTOC__). If this is used multiple times, the table of contents will appear at the first word's position. This will not work in skins that present table of contents outside the article content e.g. Vector 2022 skin.",
      },
      {
        label: 'NOEDITSECTION',
        detail:
          "Hides the section edit links beside headings. This is especially useful where a heading is created from within a template: the normal wiki section-edit would in this case edit the template code, which is usually not what the user intends. Use of this in a template will extend the effect to that template, the pages it's included on, and any other templates included on the same page. A workaround is possible.",
      },
      {
        label: 'NEWSECTIONLINK',
        detail:
          'Adds a link beside the "Edit" tab for adding a new section on a non-talk page (see Adding a section to the end).',
      },
      {
        label: 'NONEWSECTIONLINK',
        detail:
          'Removes the link beside the "Edit" tab on pages in talk namespaces.',
      },
      {
        label: 'NOGALLERY',
        detail:
          'Used on a category page, replaces thumbnails in the category view with normal links.',
      },
      {
        label: 'HIDDENCAT',
        detail:
          'Used on a category page, hides the category from the lists of categories in its members and parent categories (there is an option in the user preferences to show them).',
      },
      {
        label: 'EXPECTUNUSEDCATEGORY',
        detail:
          'Used on a category page, removes the category from Special:UnusedCategories.',
      },
      {
        label: 'NOCONTENTCONVERT',
        detail:
          "On wikis with language variants, don't perform any content language conversion (character and phase) in article display; for example, only show Chinese (zh) instead of variants like zh_cn, zh_tw, zh_sg, or zh_hk.",
      },
      { label: 'NOCC', detail: 'A short type of NOCONTENTCONVERT.' },
      {
        label: 'NOTITLECONVERT',
        detail:
          "On wikis with language variants, don't perform language conversion on the title (all other content is converted).",
      },
      { label: 'NOTC', detail: 'A short type of NOTITLECONVERT.' },
      {
        label: 'INDEX',
        detail:
          'Tell search engines to index the page (overrides $wgArticleRobotPolicies but not robots.txt). It obeys $wgExemptFromUserRobotsControl variable.',
      },
      {
        label: 'NOINDEX',
        detail:
          "Tell search engines not to index the page (i.e. do not list in search engines' results). It obeys $wgExemptFromUserRobotsControl variable.",
      },
      {
        label: 'STATICREDIRECT',
        detail: `On redirect pages, don't allow MediaWiki to automatically update the link when someone moves a page and checks "Update any redirects that point to the original title" (which requires $wgFixDoubleRedirects).`,
      },
      {
        label: 'NOGLOBAL',
        detail:
          'GlobalUserPage extension required. Disables the global user page. If present on the central user page, will prevent it from being displayed on remote wikis, and it also determines whether a link to a user page on remote wiki should be red or blue.',
      },
      {
        label: 'DISAMBIG',
        detail:
          'Disambiguator extension required. Identifies a disambiguation page.',
      },
      {
        label: 'EXPECTED_UNCONNECTED_PAGE',
        detail:
          "Wikibase extension required. Some wiki pages do not merit a Wikidata item, such as discussion archives, template subpages, etc. To prevent a wiki page from being listed in Special:UnconnectedPages, use this magic word anywhere on the page. Pages that don't meet Wikidata's notability criteria should not receive a Wikidata item.",
      },
      {
        label: 'ARCHIVEDTALK',
        detail:
          'DiscussionTools extension required. Hides "reply" links from discussions on archived pages.',
      },
      {
        label: 'NOTALK',
        detail:
          'DiscussionTools extension required. Makes a page in a talk namespace not be treated like a talk page.',
      },
    ];
    this.completionItems = magicWordOptions.map((option) => {
      const completionItem = new vscode.CompletionItem(
        { label: `__${option.label}__` },
        vscode.CompletionItemKind.Constant
      );
      completionItem.insertText = `${option.label}__`;
      completionItem.documentation = option.detail;
      return completionItem;
    });
  }

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
    if (/(^|(?<!_))_$/.test(linePrefix))
      return new vscode.CompletionList([], false);
    if (!/(^|(?<!_))__(?=([A-Z]|$))[A-Z_]*$/.test(linePrefix))
      return new vscode.CompletionList([], true);
    return new vscode.CompletionList(this.completionItems, true);
  }
}
