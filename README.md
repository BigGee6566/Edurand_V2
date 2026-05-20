# EduRand — Smart Financial & Lifestyle Assistant for SA Students

An interactive prototype of EduRand AI: a financial wellness platform designed specifically for South African students living on NSFAS allowances, bursaries, or self-funding.

## What's inside

**Two devices side-by-side** — Android (Material) and iOS (Liquid Glass) — both running the same fully interactive prototype with real Claude AI integration for the financial coach.

### Screens & features (all working)

- **Auth** — Splash, Login, two-step Signup with persona pick
- **Home** — Budget hero, status pill, "Today's 3 wins" carousel, crisis nudge, recent activity, streak stats
- **Budget Tracker** — Donut breakdown, 4-month trend chart, category filter, Add Spend / Income sheet
- **AI Coach** — Real model calls, multi-lang (EN / isiZulu / Afrikaans), in-chat rich cards (budget plan, meal swap, crisis check, transport)
- **Learn** — Progress hero, continue card, 6 lessons with progress
- **Profile** — Identity, stats, achievements, settings (incl. dark mode toggle, language, link bank, WhatsApp coaching)
- **Meals** — Cheap student meals ranked by cost, ingredients per Sixty60 / Shoprite / Pick n Pay, shopping list builder
- **Transport** — 5 SA routes (MyCiTi, Jammie, Bolt, Uber, walk) with savings comparison
- **Challenges** — R52-a-week, No-Uber June, active progress + new challenge picker
- **News** — NSFAS / banking / saving / side-hustle articles
- **Crisis Simulator** — "Will I make it?" slider with projected end-date and 30-day green/red calendar
- **Scam Shield** — Paste any suspicious SMS, real AI scam analysis with risk + flags; live feed of SA scams
- **Link Bank** — Pick from 8 SA banks, animated Open-Banking auth, success screen
- **WhatsApp Coach Preview** — Full WhatsApp UI overlay demonstrating the coach over WhatsApp

### Tweaks (toggle from the toolbar)

- Visual direction (cozy / bold)
- Dark mode
- Palette (4 curated options)
- Persona (NSFAS Lerato @ UCT / Bursary Sipho @ Wits / Self-funded Aaliyah @ Stellies)
- Budget state (healthy / watch out / crisis)
- Budget amount (R500–R5000)
- Language (EN / isiZulu / Afrikaans)

## Running it

It's pure HTML + JSX, no build step. Open `EduRand Prototype.html` directly in a browser (Chrome / Edge / Safari).

If you want a tiny local server (recommended so `file://` doesn't block fonts):

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000/EduRand%20Prototype.html`.

## Architecture

- `EduRand Prototype.html` — entry, loads React + Babel + all scripts
- `app.jsx` — top-level state, routing, theme, both device frames
- `data.jsx` — mock personas, spending states, transactions, meals, transport, lessons, achievements
- `i18n.jsx` — English / isiZulu / Afrikaans copy
- `ui.jsx` — shared primitives (Icon, Card, Button, ProgressBar/Ring, BottomNav, Sheet, etc.)
- `android-frame.jsx`, `ios-frame.jsx` — device chrome
- `tweaks-panel.jsx` — tweaks UI shell
- `screens/` — every screen as its own file (auth, home, budget, coach, learn, profile, features, extras)

## Tech

- React 18 (UMD) + Babel standalone — no build, no bundler
- Real Claude AI calls via `window.claude.complete` for the Coach and Scam Shield
- Plus Jakarta Sans + Bricolage Grotesque for type
- Pure CSS variables for theming (no Tailwind)

## Built for

A class / competition submission. Designed in the brand spirit of NSFAS-funded students, varsity life, and South African fintech vocabulary (Checkers Sixty60, Capitec, Tymebank, MyCiTi, Jammie Shuttle, Bolt, Uber, Mr D).

🇿🇦
