# EduRand — Smart Financial Assistant for SA Students

A React Native mobile app built with Expo, designed for South African students living on NSFAS allowances, bursaries, or self-funding. EduRand combines real authentication, persistent transaction tracking, and a Claude-powered AI coach tailored to South African student life.

## Features

- **Real authentication** — Email/password sign-up and sign-in via Supabase Auth; session persists across app restarts
- **Persistent budget tracking** — Transactions stored in Supabase Postgres (per-user, Row Level Security enforced)
- **AI Money Coach** — Powered by Claude claude-haiku-4-5-20251001; maintains full conversation history; gracefully falls back to local templates when no API key is set
- **User profile persistence** — Name, university, funding type, language preference, and dark mode saved to the database
- **Multi-language** — English, isiZulu, Afrikaans; preference auto-saved to user profile
- **Dark mode** — Toggleable; persists to profile
- **South Africa-specific** — NSFAS / bursary / self-funded flows, Rand formatting, local merchant names, SA student context in the AI coach

## Screens

| Screen | Description |
|--------|-------------|
| Splash | Landing page; auto-redirects returning users to Main |
| Sign Up | 2-step: name/email/password → university/funding type |
| Login | Email + password with inline error feedback |
| Home | Budget hero, status pill, recent transactions, streak stats |
| Budget | Category breakdown, transaction list, Add Spend/Income sheet |
| AI Coach | Real-time chat with Claude; quick-reply chips |
| Learn | Lesson cards with progress tracking |
| Profile | Identity card, achievements, settings (dark mode, language, sign out) |

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navigation | React Navigation v6 (native-stack + bottom-tabs) |
| Backend / Auth | Supabase (Postgres + Row Level Security) |
| Session storage | `@react-native-async-storage/async-storage` |
| AI Coach | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| Styling | React Native StyleSheet, `expo-linear-gradient` |

## Project structure

```
EDURAND/
├── App.js                  # Root navigator (Splash → Auth → Main tabs)
├── src/
│   ├── AppContext.js        # Global state: auth, profile, transactions, theme
│   ├── data.js             # Static data: PERSONAS, CATEGORIES, MEALS, LESSONS…
│   ├── i18n.js             # EN / isiZulu / Afrikaans copy
│   ├── theme.js            # makeTheme() + PALETTES
│   ├── lib/
│   │   ├── supabase.js     # Supabase client (AsyncStorage session)
│   │   └── api.js          # signIn, signUp, signOut, profile, transactions, askCoach
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── HomeScreen.js
│   │   ├── BudgetScreen.js
│   │   ├── CoachScreen.js
│   │   ├── LearnScreen.js
│   │   └── ProfileScreen.js
│   └── components/
│       ├── Icon.js         # SVG icon set
│       └── ui.js           # Card, Button, Toggle, TxnRow, PageHeader…
├── supabase/
│   └── schema.sql          # Paste into Supabase SQL Editor to set up DB
└── .env.example            # Copy to .env and fill in your keys
```

## Setup

### 1. Supabase project

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query**, paste the contents of `supabase/schema.sql`, and run it
3. Copy your **Project URL** and **anon public key** from **Settings → API**

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional — leave blank to use built-in fallback coach responses
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` for Android emulator / `i` for iOS simulator.

## Database schema

Two tables, both with Row Level Security — users can only read and write their own rows.

**`profiles`** — one row per user, created on sign-up

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | References `auth.users` |
| `name` | text | Full name |
| `short_name` | text | First name |
| `initials` | text | e.g. `LD` |
| `university` | text | e.g. `UCT` |
| `funding_type` | text | `nsfas` / `bursary` / `self` |
| `monthly_budget` | integer | Default 1500 |
| `language` | text | `en` / `zu` / `af` |
| `dark_mode` | boolean | Default false |

**`transactions`** — unlimited rows per user

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References `auth.users` |
| `cat` | text | Category id (food, transport…) |
| `merchant` | text | e.g. `Checkers Sixty60` |
| `amount` | numeric | Negative = expense, positive = income |
| `note` | text | Optional |
| `at_label` | text | Human-readable time label |
| `created_at` | timestamptz | Auto-set |

## AI Coach

When `EXPO_PUBLIC_ANTHROPIC_API_KEY` is set, the coach sends the full conversation to `claude-haiku-4-5-20251001` with a system prompt that includes the student's name, university, funding type, and current budget position. The model is instructed to respond in under 3 sentences with practical, South-Africa-specific advice.

Without an API key the coach replies with a curated set of local templates covering budget, cheap meals, and side-hustle topics — so the app remains fully functional for demos.

## Navigation flow

```
Splash ──(returning user)──▶ Main (tabs)
  │
  ├──▶ Signup ──▶ Main
  └──▶ Login  ──▶ Main

Main tabs: Home | Budget | Coach | Learn | Profile
Profile ──(sign out)──▶ Splash
```

## Built for

South African students on NSFAS / bursary / self-funding — designed around Rand budgets, local merchants (Checkers Sixty60, Shoprite, MyCiTi, Mr D), and the realities of varsity life in SA.

🇿🇦
