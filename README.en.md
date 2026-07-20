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

## Resume Updates

Double-click `tools/Resume Updater.app` to update the resume PDFs used by the site.

Workflow:

1. Choose Chinese, English, or both resumes.
2. Select the local PDF file.
3. If the PDF is larger than 5MB, the app will remind you that compression may help.
4. Choose `Update Only` or `Update + Build`.
5. Commit and push the changes to GitHub so Cloudflare Pages can redeploy.

The app copies resumes to stable public filenames and refreshes the download links in `index.html` with a cache version. Raw PDF backups are saved in `source-assets/raw/resume/`.

## Asset Optimization

Run `npm run optimize:assets` on macOS to regenerate WebP images and the lower-bitrate showcase video without overwriting source files. The image step requires Python 3 and Pillow.
