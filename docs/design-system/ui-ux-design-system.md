# NutriVedha — UI/UX Design System Specification

## 1. Design Philosophy
NutriVedha's visual language merges **Classical Ayurvedic Tranquility** with **Modern High-Tech Precision Health**. The aesthetic is clean, organic, and trustworthy, employing subtle glassmorphism, grounded earthen color accents, and crisp typography.

---

## 2. Color Palette & Design Tokens

### Primary Ayurvedic Colors
- **Ayur Forest (Primary Green)**: `#1E3A2F` — Core branding, primary buttons, headers.
- **Herbal Sage (Secondary Green)**: `#3E6B56` — Badges, secondary actions, active tabs.
- **Pitta Amber (Accent Warmth)**: `#D97706` — Energy highlights, ratings, cautionary alerts.
- **Vata Azure (Clinical Blue)**: `#0284C7` — Telemedicine, doctor icons, clinical data.
- **Kapha Earth (Muted Terracotta)**: `#92400E` — Root herbal references, earthy backgrounds.

### Neutrals & Surfaces
- **Sattvic Pearl (Light Surface)**: `#F9FAF8` — Primary background color for user portal.
- **Card Cream**: `#FFFFFF` with `rgba(0, 0, 0, 0.04)` subtle border.
- **Charcoal Text (Deep Contrast)**: `#111827` — Body copy, titles.
- **Muted Slate**: `#6B7280` — Secondary text, captions, inactive icons.

---

## 3. Typography & Hierarchy
- **Font Family**: Modern sans-serif (`Inter`, `system-ui`, `-apple-system`).
- **Heading 1**: `text-3xl font-bold tracking-tight text-forest`
- **Heading 2**: `text-2xl font-semibold tracking-tight`
- **Heading 3**: `text-xl font-medium`
- **Body Regular**: `text-base text-gray-700 leading-relaxed`
- **Caption / Tag**: `text-xs font-semibold uppercase tracking-wider`

---

## 4. UI Patterns & Feedback States
- **Glass Cards**: `bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200`
- **Status Pills**:
  - Success/Organic: `bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
  - In Transit: `bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
  - High Risk: `bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
- **Loading States**: Shimmer skeleton cards mirroring target layout, avoiding abrupt layout shifts.
