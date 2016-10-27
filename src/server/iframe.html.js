import url from 'url';

export default function (headHtml, publicPath, cacheKey) {
  const previewUrl = cacheKey ? `static/preview.bundle.js?${cacheKey}` : 'static/preview.bundle.js';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          if (window.parent !== window) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
          }
        </script>
        <title>React Storybook</title>
        ${headHtml}
      </head>
      <body>
        <div id="root"></div>
        <div id="error-display"></div>
        <script src="${url.resolve(publicPath, previewUrl)}"></script>
      </body>
    </html>
  `;
}
