# MyAppFactory — Landing Page

Landing page bilingue (FR/EN) pour MyAppFactory, studio AI-native qui construit des applications sur-mesure pour PME.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — thème sombre/clair via CSS variables
- **next-intl** — bilingue FR/EN avec URLs `/fr` et `/en`
- **next-themes** — toggle dark/light
- **Framer Motion** — animations d'entrée
- **Lucide Icons** — iconographie

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev (http://localhost:3000)
npm run dev

# Build de production
npm run build
npm run start
```

L'URL `/` redirige automatiquement vers `/fr` (langue par défaut).

## Structure

```
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx       # HTML, fonts, providers
│   │   ├── page.tsx         # Assemble toutes les sections
│   │   └── not-found.tsx
│   └── globals.css          # Variables CSS dark/light + utilities
├── components/
│   ├── Header.tsx           # Nav + toggles + CTA
│   ├── Hero.tsx             # Section principale + stats
│   ├── Problem.tsx          # 3 pain points
│   ├── Approach.tsx         # La Factory + 3 piliers
│   ├── WhatWeBuild.tsx      # 6 catégories d'apps
│   ├── Apps.tsx             # Réalisations (Harold, Tell-e, LeO)
│   ├── Process.tsx          # 4 étapes verticales
│   ├── ForWho.tsx           # 3 personas cibles
│   ├── FinalCTA.tsx         # Réservation appel
│   ├── Footer.tsx
│   ├── Logo.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageToggle.tsx
│   ├── Providers.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── SectionLabel.tsx
│       └── AnimationSlot.tsx   # Placeholders pour tes animations
├── messages/
│   ├── fr.json              # Traductions françaises
│   └── en.json              # Traductions anglaises
├── public/
│   ├── animations/          # Tes animations isométriques (.mp4/.webm)
│   └── apps/                # Screenshots des apps en prod
├── i18n.ts
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## À personnaliser

### 1. Animations isométriques
Les `<AnimationSlot />` sont des placeholders. Quand tu as tes animations, ouvre les fichiers concernés et remplace le composant par :

```tsx
<video
  src="/animations/hero.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="h-full w-full rounded-2xl object-cover"
/>
```

Emplacements actuels :
- `components/Hero.tsx` → animation principale (ratio 5:6)
- `components/Approach.tsx` → schéma factory (ratio 16:10)

### 2. Screenshots des apps
Dépose dans `/public/apps/` :
- `harold.png`
- `telle.png`
- `leo.png`

Puis dans `components/Apps.tsx`, remplace le placeholder dans `<AppCard>` par :

```tsx
<Image src={`/apps/${app.key}.png`} alt="..." fill className="object-cover" />
```

### 3. Lien Cal.com / Calendly
Dans `components/FinalCTA.tsx` ligne ~33 et `components/Header.tsx`, remplace `href="#"` ou `href="#contact"` du bouton CTA par ton vrai lien (ex: `https://cal.com/myappfactory/discovery`).

### 4. Couleurs
Édite `app/globals.css` :
- `:root` → mode clair
- `.dark` → mode sombre

Variables : `--bg`, `--surface`, `--accent` (teal), `--accent-2` (rouge/coral), `--text`, `--text-muted`, `--border`.

### 5. Textes
Tout est dans `messages/fr.json` et `messages/en.json`. Modifier les deux pour rester bilingue.

## Déploiement

Recommandé : **Vercel** (gratuit pour ce type de projet).

```bash
npm i -g vercel
vercel
```

Ou push sur GitHub puis import dans dashboard Vercel.

## Notes

- Le toggle de thème est par défaut sur **dark** (cf. `Providers.tsx`).
- Le toggle de langue change l'URL (`/fr` ↔ `/en`) — bon pour le SEO.
- Les animations Framer Motion se déclenchent au scroll (`whileInView`).
