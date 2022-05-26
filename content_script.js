const text = 'cachedTerms';

const matches = [];

for (const span of document.querySelectorAll('span')) {
  if (span.textContent.includes(text)) {
    matches.push(span);
    // alert(span.textContent);
    span.className += ' hide-spoiler';
  }
}
