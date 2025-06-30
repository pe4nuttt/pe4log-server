import { htmlToText } from 'html-to-text';

export function parseHtmlContent(html: string): string {
  return htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
    ],
  });
}
