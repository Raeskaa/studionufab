# Contributing to studionufab

Welcome! This guide walks you through getting set up, making changes, and contributing safely.

## 1) Prerequisites
- Git: https://git-scm.com/
- Node.js 18+ and npm: https://nodejs.org/
- GitHub account with access to this repo

## 2) Get the project locally
```bash
# Clone (HTTPS)
git clone https://github.com/Raeskaa/studionufab.git
cd studionufab

# Or clone (SSH) if you have a key set up
# git clone git@github.com:Raeskaa/studionufab.git
```

## 3) Install and run
```bash
npm ci          # install dependencies from package-lock
npm run dev     # start the Vite dev server at http://localhost:5173
```

## 4) Project overview
- React + TypeScript (Vite)
- Styling: Tailwind + some inline styles
- Entry: src/main.tsx
- App (most UI/content): src/App.tsx
- Config: vite.config.ts, tailwind.config.js

### Blog content
- Posts live in the blogPosts array near the top of src/App.tsx.
- Each post has: title, subtitle, date, content.
- Ordering rules in the app:
  - Post 1 and Post 3: title → subtitle → date → content
  - Post 2: title → date → content → subtitle
- Post 2 subtitle can be an array of strings (renders as multiple paragraphs).
- A small asterisk icon is automatically inserted at the start of subtitles.
- Content should be an array of strings, one paragraph per entry.

#### Add a new blog post (step-by-step)
1. Open `src/App.tsx` and locate the `blogPosts` array.
2. Copy an existing post object as a template and paste it after the last one.
3. Fill in:
   - `title`: string (the asterisk icon is added automatically in UI)
   - `subtitle`: string or array of strings (array = multiple spaced paragraphs)
   - `date`: short blurb or date string
   - `content`: array of strings (each entry is one paragraph)
4. Follow ordering rules above (Post 2 layout is different by design).
5. Run locally and verify: `npm run dev` → http://localhost:5173

Tips:
- Keep lines reasonably short; let the renderer handle wrapping.
- For deliberate line breaks inside a paragraph, use `\n`.

## 5) Typical workflow
1) Update main and create a branch
```bash
git checkout main
git pull origin main
git checkout -b feat/your-change
```
2) Edit files, run locally (npm run dev), and lint if needed (npm run lint).
3) Commit with a clear message
```bash
git add -A
git commit -m 'Feat: describe the change'
```
4) Push and open a Pull Request (PR)
```bash
git push -u origin feat/your-change
```
5) Request review; after approval, merge. Avoid pushing directly to main.

## 6) Deployment (GitHub Pages)
- Deployed from the gh-pages branch.
- Publish the current main build:
```bash
npm run deploy
```
- Live (without custom domain): https://raeskaa.github.io/studionufab/
- If using a custom domain, ensure a CNAME file is present during deploy.

### Keeping GoDaddy in sync
If GoDaddy hosts a separate copy of the site, you have two options:

1) Manual upload
- Build locally: `npm run build` (outputs to `dist/`)
- Upload `dist/` contents to GoDaddy `public_html` (overwrite existing)
- Ensure `.htaccess` is present for client routing

2) Use GitHub Pages as the live source and point your domain to it
- Configure your domain’s DNS to point to GitHub Pages (CNAME or A/AAAA records)
- Then `npm run deploy` is all you need; no GoDaddy upload required

Note: DNS changes can take 5–30 minutes (sometimes longer) to propagate.

## 7) Common git tasks
- Sync your branch:
```bash
git fetch origin
git rebase origin/main   # or: git merge origin/main
```
- Discard local changes in a file:
```bash
git checkout -- path/to/file
```
- Undo the last commit locally:
```bash
git reset --soft HEAD~1   # keep changes staged
git reset --hard HEAD~1   # discard changes
```

## 8) Code style
- Prefer clear names and small, focused edits.
- Match existing formatting; keep unrelated refactors out of a PR.
- Handle edge cases and avoid deep nesting.

## 9) Help
- Open a draft PR and describe what you’re trying to do.
- Add screenshots or a short screen recording for UI changes.
 - If stuck on Git/GitHub basics, ask in the PR or check: https://docs.github.com/en/get-started
 - If the dev server won’t start, run `npm ci` again and re-open the terminal.

Thanks for contributing! 🙌
