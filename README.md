# VALIDATE consortium website

Static site for **VALIDATE — VALIdation of Decision support models for rAdioThErapy**, served from GitHub Pages and reached through **validate4rt.org**.

No build step, no framework: three HTML pages, one stylesheet, one small script, self-hosted fonts.

```
index.html          Home: mission, member map, members, how we work (summary), projects (summary), milestones, contact
approach.html       How we work: barriers, the seven commitments (with diagrams), open questions, references
projects.html       The four validation projects: question, models, approach, leads; references
assets/css/styles.css   All styling; colour and type tokens are in :root at the top (dark mode included)
assets/js/main.js       Mobile menu, inline member maps with tooltips, the dot-grid figure
assets/img/             Logo (original, navy transparent, white transparent), favicons, social image, the two map SVGs
assets/fonts/           IBM Plex Serif / Sans / Mono (OFL licence in LICENSE-IBM-Plex.txt)
tools/build-map.js      Regenerates the two map SVGs from the list of member cities
.nojekyll               Tells GitHub Pages to serve the files as they are
HANDOFF.md              Sources, decisions, items to verify, change log
```

## Publish on GitHub Pages

1. Create an empty repository on GitHub, e.g. `cerrver/validate4rt` (public).
2. In PowerShell, from this folder (one command per line):

   ```
   git init
   git add -A
   git commit -m "VALIDATE consortium site"
   git branch -M main
   git remote add origin https://github.com/cerrver/validate4rt.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save.**
   The site appears at `https://cerrver.github.io/validate4rt/` within a minute or two.

Later updates: edit the files, then `git add -A`, `git commit -m "…"`, `git push`. GitHub Pages caches for about ten minutes; a page that looks stale after a confirmed push is usually the browser cache (Ctrl+F5).

## validate4rt.org

Two ways to use the domain; the second is the better one for a consortium site because the address bar keeps showing validate4rt.org.

**A. Redirect at the registrar** (as deasylab.info does): forward `validate4rt.org` to `https://cerrver.github.io/validate4rt/`. Nothing to change in the repository.

**B. Serve the site at the domain itself** (GitHub Pages custom domain):

1. Add a file named `CNAME` (no extension) to the repository root containing one line: `validate4rt.org`, and push.
2. At the registrar's DNS panel, add four `A` records for the apex (`@`) pointing to GitHub Pages:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and a `CNAME` record for `www` pointing to `cerrver.github.io`.
   (Check these against GitHub's current documentation, "Managing a custom domain for your GitHub Pages site", before saving.)
3. On GitHub: **Settings → Pages → Custom domain: validate4rt.org → Save**, wait for the DNS check, then tick **Enforce HTTPS**.

The pages already carry `https://validate4rt.org/…` as their canonical and Open Graph URLs, which is right for option B and harmless for option A.

## Editing

- **Members.** The roster is plain HTML in `index.html` (section `#members`), ordered by country, then institution; copy a `<dd>` line to add a person. The two leader cards (Chair, co-Chair) appear twice: in `#members` and in `#contact`.
- **Map.** Cities and institutions are listed once in `tools/build-map.js`. To add a city: add a line to the `cities` array (longitude, latitude), then

  ```
  cd tools
  npm install
  npm run build-map
  ```

  which rewrites `assets/img/membermap-world.svg` and `membermap-europe.svg`. If the new city is in Europe, give it a label offset in the `off` table. Update the "Eighteen cities, ten countries" caption in `index.html` by hand.
- **Projects.** `projects.html`, one `<article class="project">` per project.
- **Colours and type.** Tokens at the top of `assets/css/styles.css`. The marigold accent is reserved for the map pins and figure marks; text uses the navy of the logo.

## Local preview

The maps load with `fetch()`, so open the site over HTTP rather than as a bare file: from this folder, `python -m http.server 8000`, then `http://localhost:8000/`. Opened directly from disk the pages still work; the maps then show as static images without tooltips.

## Credits

Map data: Natural Earth (public domain) via the `world-atlas` package; projection with d3-geo. Fonts: IBM Plex (SIL Open Font License). Logo: VALIDATE consortium.
