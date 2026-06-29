// Runs synchronously in <head> before React hydrates so the dark-mode class lands
// on <html> before first paint. Plain ES5 — the string is injected verbatim into
// the HTML; no bundler touches it.
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : systemDark;
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
`.trim();
