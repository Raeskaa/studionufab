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

Thanks for contributing! 🙌
