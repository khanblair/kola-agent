export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeForTelegram(input: string): string {
  const markdownChars = /([_*\[\]()~`>#+\-=|{}.!])/g;
  return input.replace(markdownChars, '\\$1');
}
