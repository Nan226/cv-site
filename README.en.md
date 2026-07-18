# YE NAN Portfolio

A personal portfolio built with native HTML, CSS, JavaScript and Three.js.

## Local Development

```bash
npm run build
python3 -m http.server 4173 -d dist
```

Open <http://127.0.0.1:4173/>.

## Deployment

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 18 or newer

Only `assets/`, `css/`, `js/` and `index.html` are published. Original photos, videos, models and design references stay in the local-only `source-assets/` directory.

## Asset Optimization

Run `npm run optimize:assets` on macOS to regenerate lightweight images and the 480p showcase video without overwriting source files.
