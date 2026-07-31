# Veritas Bookkeeping Services

Single-page "link-in-bio" style site for Trish Maglanoc / Veritas Bookkeeping
Services. Built with Vite + React 19 and plain CSS Modules. All site content
(name, services, bio, contact email, photos) lives in
`src/data/siteConfig.js` — edit that file directly to update the page.

## Quick start

```bash
npm install
npm run dev
```

The app runs out of the box with the content in `src/data/siteConfig.js` —
you don't need anything configured to see the page working locally. Fill in
`.env` (copy from `.env.example`) to wire up the real contact form.

## What you still need to do manually

### 1. Formspree (contact form)

The "Email Trish" button opens a modal that POSTs to Formspree. You need to:

1. Go to https://formspree.io and create an account (or log in).
2. Create a new form pointed at **trish.mag@hotmail.com**.
3. Copy the form's endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`).
4. Paste it into `.env` as `VITE_FORMSPREE_ENDPOINT`.

Until this is set, submitting the form will show the error state (the app
won't crash, but messages won't send).

### 2. Replace placeholder images

- **Headshot**: `avatarUrl` in `src/data/siteConfig.js` currently points at
  the Veritas logo icon (`/veritas-icon.svg` in `public/`). Replace it with
  a URL (or local `public/` path) to Trish's actual headshot.
- **Slideshow photos**: `photos` in the same file are royalty-free stock
  photos (desk/paperwork/calculator themed) from Unsplash, standing in for
  Trish's own work photos. Replace each `src` with Trish's real photos, and
  update `alt` text to match.

## Deploying to Netlify

`netlify.toml` is already configured for a standard Vite SPA build
(`npm run build`, publish `dist`, SPA redirect to `index.html`). Connect the
repo in Netlify and add `VITE_FORMSPREE_ENDPOINT` in the Netlify site's
**Environment variables** settings.

## Project structure

```
src/
  components/
    IconRow.jsx / .module.css        — services bar list
    ExpandableBio.jsx / .module.css  — collapsible bio + "Read More" modal
    ActionBar.jsx / .module.css      — "Email Trish" button + contact modal
    PhotoWidget.jsx / .module.css    — auto-advancing photo slideshow
    AvatarModal.jsx / .module.css    — full-size headshot modal
    InlineLink.jsx / .module.css     — small muted footer link
  data/
    siteConfig.js                    — all site content, edit directly
  styles/
    index.css                        — global resets, fonts, scrollbar hiding
    App.module.css                   — page/card layout
  App.jsx
  main.jsx
```
