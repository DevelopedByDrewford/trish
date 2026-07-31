# Veritas Bookkeeping Services

Single-page "link-in-bio" style site for Trish Maglanoc / Veritas Bookkeeping
Services. Built with Vite + React 19, plain CSS Modules, and a
Firestore-backed content model so Trish can edit her name, services, bio,
and photos later without touching code.

## Quick start

```bash
npm install
npm run dev
```

The app runs out of the box with placeholder content from
`src/data/defaultConfig.js` — you don't need Firebase or Formspree configured
to see the page working locally. Fill in `.env` (copy from `.env.example`)
to wire up the real contact form and live Firestore content.

## What you still need to do manually

### 1. Formspree (contact form)

The "Email Trish" button opens a modal that POSTs to Formspree. You need to:

1. Go to https://formspree.io and create an account (or log in).
2. Create a new form pointed at **trish.mag@hotmail.com**.
3. Copy the form's endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`).
4. Paste it into `.env` as `VITE_FORMSPREE_ENDPOINT`.

Until this is set, submitting the form will show the error state (the app
won't crash, but messages won't send).

### 2. Firebase / Firestore (editable site content)

1. Go to https://console.firebase.google.com and create a new project.
2. In the project, go to **Build → Firestore Database** and click **Create
   database** (start in production mode).
3. Add a **web app** to the project (gear icon → Project settings → Add app
   → Web) and copy the config values it gives you into `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. In Firestore, create a collection named `config` with a single document
   named `site` containing these fields:

   ```js
   {
     name: "Trish Maglanoc",
     businessName: "Veritas Bookkeeping Services",
     tagline: "Helping small businesses stay organized, accurate, and audit-ready.",
     bio: "<Trish's real bio text>",
     services: ["Accounts Payable (A/P)", "Accounts Receivable (A/R)", "Payroll", "Clean-up", "Reconciliations"],
     contactEmail: "trish.mag@hotmail.com",
     avatarUrl: "<headshot image URL>",
     photos: [
       { src: "<url>", alt: "Description" }
     ]
   }
   ```

5. Set the Firestore security rules so the document is publicly readable
   but not writable from the client (edits happen via the Firebase console,
   or a future authenticated admin tool):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /config/site {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```

Until this document exists (or env vars are unset), the site falls back to
`src/data/defaultConfig.js`.

### 3. Replace placeholder images

- **Headshot**: `avatarUrl` in `src/data/defaultConfig.js` (and later in the
  Firestore document) is a generic placeholder avatar. Replace it with a URL
  to Trish's actual headshot.
- **Slideshow photos**: `photos` in the same file are royalty-free stock
  photos (desk/paperwork/calculator themed) from Unsplash, standing in for
  Trish's own work photos. Replace each `src` with Trish's real photos, and
  update `alt` text to match.

## Deploying to Netlify

`netlify.toml` is already configured for a standard Vite SPA build
(`npm run build`, publish `dist`, SPA redirect to `index.html`). Connect the
repo in Netlify and add the same environment variables from `.env` in the
Netlify site's **Environment variables** settings.

## Project structure

```
src/
  components/
    IconRow.jsx / .module.css        — services pill row
    ExpandableBio.jsx / .module.css  — collapsible bio + "Read More" modal
    ActionBar.jsx / .module.css      — "Email Trish" button + contact modal
    PhotoWidget.jsx / .module.css    — auto-advancing photo slideshow
    AvatarModal.jsx / .module.css    — full-size headshot modal
    InlineLink.jsx / .module.css     — small muted footer link
  hooks/
    useSiteConfig.js                 — Firestore subscription + fallback
  lib/
    firebase.js                      — Firebase app/Firestore init
  data/
    defaultConfig.js                 — local fallback content
  styles/
    index.css                        — global resets, fonts, scrollbar hiding
    App.module.css                   — page/card layout
  App.jsx
  main.jsx
```
