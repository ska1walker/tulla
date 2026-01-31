# TULLA - Liebevolle Kampagnensteuerung

Marketing-Kampagnenplanung mit Emotion und Klarheit.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth + Firestore)
- **Deployment:** Vercel-ready

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Get your Firebase credentials from:
Firebase Console > Project Settings > General > Your apps

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tulla-nextjs/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing page (Server Component)
│   ├── login/              # Login page
│   └── dashboard/          # Dashboard routes
│       ├── page.tsx        # Main timeline view
│       └── analytics/      # Analytics dashboard
│
├── components/
│   ├── ui/                 # Base UI (Modal)
│   ├── landing/            # Landing page components
│   ├── dashboard/          # Timeline, Header, etc.
│   ├── modals/             # Campaign, Channel, Phase, Branding
│   └── icons/              # TulipLogo
│
├── hooks/                  # Custom React hooks
│   ├── use-campaigns.ts    # Campaigns CRUD
│   ├── use-channels.ts     # Channels CRUD
│   └── use-settings.ts     # Phases + Branding
│
├── lib/
│   ├── firebase/config.ts  # Firebase initialization
│   ├── utils/              # Utility functions
│   └── constants.ts        # Design tokens, defaults
│
├── types/                  # TypeScript interfaces
│   ├── campaign.ts
│   ├── channel.ts
│   ├── phase.ts
│   └── branding.ts
│
└── contexts/
    └── auth-context.tsx    # Auth Provider
```

## Features

- **Campaign Management:** Create, edit, delete campaigns with timeline visualization
- **Channel Management:** Add and organize media channels
- **Strategic Phases:** Define 3 planning phases per year
- **Analytics Dashboard:** Budget tracking and campaign mix analysis
- **Offline Mode:** LocalStorage fallback when Firebase is unavailable
- **Multi-user Support:** Admin and Viewer roles

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Security Note

The Firebase configuration uses environment variables. Never commit `.env.local` to version control.

---

(c) 2026 Kai Böhm
