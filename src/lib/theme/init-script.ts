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
    var path = location.pathname;
    document.documentElement.lang = (path === '/uk' || path.indexOf('/uk/') === 0) ? 'uk' : 'en';
  } catch (e) {}
})();
`.trim();
