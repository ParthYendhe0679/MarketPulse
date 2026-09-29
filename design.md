# MarketPulse AI — Design System

## Design Philosophy: Premium Neo-Brutalism

MarketPulse AI uses a **Premium Neo-Brutalism** design language — a modern take on classic brutalism that combines:

- **Thick solid borders** (`border-[#111111]`) on every element
- **Flat offset box-shadows** (solid, not blurred) that give a "lifted" 3D feel
- **High-contrast flat color fills** for cards, badges, and buttons
- **Bold uppercase typography** for headings and labels
- **Micro-animations** on hover (translate + shadow grow) and spring-based page entrances
- A **light, almost-white background** (`#FAFAFA`) with pure white cards, keeping the palette clean

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary-blue` | `#4F7DF9` | Primary buttons, active nav, logo, accent text |
| `--color-yellow` | `#FFD54A` | CTA buttons, active nav pill, highlight badges, icon fills |
| `--color-green` | `#6EE7B7` | Success states, badges, icon fills, chart bars |
| `--color-pink` | `#FF9ECF` | Feature section, floating cards, user avatar, badges |
| `--color-orange` | `#FFB347` | Chart bars, warning-level badges |
| `--color-red` | `#FF6B6B` | Danger state, notification dot, chart elements |
| `--color-bg-base` | `#FAFAFA` | Page background, scrollbar track |
| `--color-dark-base` | `#111111` | All borders, shadows, primary text, footer background |
| `white` | `#FFFFFF` | Card backgrounds, navbar background |

### Colored Offset Shadows (`.shadow-*` variants)
Used to make specific cards pop with a brand color instead of the default black shadow:

```
.shadow-pink   → box-shadow: 4px 4px 0px 0px #FF9ECF
.shadow-yellow → box-shadow: 4px 4px 0px 0px #FFD54A
.shadow-blue   → box-shadow: 4px 4px 0px 0px #4F7DF9
.shadow-green  → box-shadow: 4px 4px 0px 0px #6EE7B7
.shadow-orange → box-shadow: 4px 4px 0px 0px #FFB347
```

---

## Typography

| Role | Font | Weight | Style |
|---|---|---|---|
| Display / Headings | **Space Grotesk** (`font-display`) | 700–900 | Uppercase, tight tracking |
| Body / UI labels | **Poppins** (`font-sans`) | 500–700 | Sentence case, relaxed |

```css
--font-display: 'Space Grotesk', sans-serif;
--font-sans: 'Poppins', sans-serif;
```

### Text Scale Conventions
- Hero headings: `text-4xl` → `text-6xl`, `font-black`, `uppercase`, `tracking-tight`
- Section headings: `text-3xl` → `text-4xl`, `font-black`, `uppercase`
- Card headings: `text-base` → `text-lg`, `font-bold`, `uppercase`
- Labels/overlines: `text-[8px]`–`text-xs`, `font-bold`, `uppercase`, `tracking-widest`
- Body copy: `text-sm`, `font-medium`, `text-gray-600`, `leading-relaxed`

---

## Core Utility Classes

### `.neo-box`
The base "brutalist card" style applied to all surface elements:
```css
border: 3px solid #111111;
box-shadow: 4px 4px 0px 0px #111111;
border-radius: 16px;
background-color: #FFFFFF;
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### `.neo-box-hover`
Applied alongside `.neo-box` to add lift-on-hover:
```css
:hover {
  transform: translate(-3px, -3px);
  box-shadow: 7px 7px 0px 0px #111111;
}
```

### `.neo-btn`
Base for all button elements:
```css
border: 3px solid #111111;
box-shadow: 4px 4px 0px 0px #111111;
border-radius: 12px;
font-weight: 700;
font-family: Space Grotesk;
/* Hover: translate(-2px, -2px), bigger shadow */
/* Active: translate(2px, 2px), smaller shadow — "press" effect */
```

---

## Component API

### `<Button>`

```tsx
<Button variant="primary" size="sm" | "md" | "lg">Label</Button>
```

| Variant | BG Color | Text Color |
|---|---|---|
| `primary` | `#4F7DF9` | white |
| `yellow` | `#FFD54A` | `#111111` |
| `green` | `#6EE7B7` | `#111111` |
| `pink` | `#FF9ECF` | `#111111` |
| `orange` | `#FFB347` | `#111111` |
| `red` | `#FF6B6B` | white |
| `dark` | `#111111` | white |
| `white` | `#FFFFFF` | `#111111` |

**Sizes**: `sm` (2px border, 2px shadow), `md` (3px border, 4px shadow), `lg` (4px border, 6px shadow).
All sizes use the "press" interaction: `hover → translate(-Npx, -Npx)`, `active → translate(+Npx, +Npx)`.

---

### `<Card>`

```tsx
<Card variant="white" shadowColor="blue" hoverable={true} borderWidth="3">
  ...
</Card>
```

| Prop | Options | Default |
|---|---|---|
| `variant` | `white`, `primary`, `yellow`, `green`, `pink`, `orange`, `red` | `white` |
| `shadowColor` | `black`, `pink`, `yellow`, `blue`, `green`, `orange` | `black` |
| `hoverable` | `true` / `false` | `true` |
| `borderWidth` | `'2'`, `'3'`, `'4'` | `'3'` |

When `hoverable={true}`: `hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#111111]`.
Border radius is always `rounded-2xl`.

---

### `<Badge>`

```tsx
<Badge variant="yellow">LABEL</Badge>
```

Variants: `yellow`, `green`, `pink`, `blue`, `orange`, `red`, `dark`, `white`.
Style: `border-2 border-[#111111]`, `rounded-full`, `shadow-[1.5px_1.5px_0px_0px_#111111]`, `text-xs uppercase tracking-wider font-bold`.

---

### `<Navbar>`
- Sticky top, `border-b-4 border-[#111111]`
- Active nav link: `bg-[#FFD54A]` pill with `border-[#111111]` and `shadow-[2.5px_2.5px_0px_0px_#111111]`
- Icon buttons (theme, bell, user): `border-2`, `shadow-[2px_2px_0px_0px_#111111]`, hover-lift interaction

---

## Charts (Recharts — "Neo" styled)

All chart components are wrapped to enforce the Neo-Brutalism visual style:

| Property | Value |
|---|---|
| Axes stroke | `#111111`, `strokeWidth: 3` |
| Tick marks | `fontSize: 10`, `fontWeight: 700` |
| Bar borders | `stroke: #111111`, `strokeWidth: 2.5` |
| Bar palette | `#4F7DF9`, `#FFD54A`, `#FF9ECF`, `#6EE7B7` (default order) |
| Bar radius | `[4, 4, 0, 0]` (non-stacked) |
| CartesianGrid | `stroke: #e5e7eb`, `strokeDasharray: "4 4"`, vertical lines off |
| Legend | `font-size: 11px`, `font-weight: 700`, `uppercase`, `iconType: rect` |
| Tooltip | Custom `<CustomTooltip>` component, cursor fill `#FAFAFA` |
| Font | `font-display` (Space Grotesk) |

**Chart Components**: `<NeoBarChart>`, `<NeoPieChart>` — custom wrappers around Recharts.

---

## Animations

Powered by **Framer Motion**.

### Page / Section Entrance
```ts
// Container — staggers children
containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

// Each child item
itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
}
```

### Hero Section
- Left column: `x: -50 → 0`, `opacity: 0 → 1`, `duration: 0.6`, `type: spring`
- Right column: `x: 50 → 0`, `opacity: 0 → 1`, `duration: 0.6`, `type: spring`

### Floating Cards (Hero graphic)
- Animate `y` ±8–12px in a loop, `rotate` ±1.5–2.5°
- `ease: easeInOut`, `repeat: Infinity`, staggered `delay` per card
- `whileHover: { scale: 1.05, rotate: 0, zIndex: 30 }`

### Animated SVG Lines (Hero underlay)
```ts
animate={{ strokeDashoffset: [0, -24] }}
transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
```
Used for dashed connecting lines between floating cards and the central card.

### Floating Particles (Hero)
- `+` symbol: `y: [0, 10, 0]`, `rotate: [0, 360]`, `duration: 7`
- `▲` triangle: `y: [0, -12, 0]`, `rotate: [0, -360]`, `duration: 9`
- Dot: `y: [0, 8, 0]`, `duration: 6`

---

## Layout Conventions

| Concept | Implementation |
|---|---|
| Max content width | `max-w-7xl mx-auto` |
| Page padding | `px-6 md:px-12` |
| Section vertical spacing | `py-16 md:py-24` or `py-20` |
| Hero grid | `grid-cols-1 lg:grid-cols-12` — content `col-span-7`, graphic `col-span-5` |
| Feature grid | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6` |
| Alternate section BG | White sections use `bg-white border-y-4 border-[#111111]` |
| Sticky Navbar | `sticky top-0 z-40`, `border-b-4 border-[#111111]` |
| Footer | `bg-[#111111]` dark, `grid-cols-1 md:grid-cols-4` |

---

## Scrollbar Styling (Custom)
```css
::-webkit-scrollbar        { width: 10px; height: 10px; }
::-webkit-scrollbar-track  { background: #FAFAFA; border-left: 3px solid #111111; }
::-webkit-scrollbar-thumb  { background: #111111; border: 3px solid #FAFAFA; border-radius: 10px; }
```

---

## Leaflet Map Overrides
All Leaflet containers and popups are forced into the Neo-Brutalism style:
```css
.leaflet-container             { border: 3px solid #111111 !important; box-shadow: 4px 4px 0px 0px #111111 !important; border-radius: 12px; }
.leaflet-popup-content-wrapper { border: 3px solid #111111 !important; border-radius: 8px !important; box-shadow: 3px 3px 0px 0px #111111 !important; }
```

---

## Tech Stack (Design-Relevant)

| Library | Role |
|---|---|
| **TailwindCSS v4** (`@import "tailwindcss"`) | Utility styling, theme tokens via `@theme {}` |
| **Framer Motion** | Page/section animations, floating card loops, SVG path animation |
| **Recharts** | Bar charts, Pie charts — wrapped in Neo-styled components |
| **Leaflet** | Interactive India map — styled to match Neo-Brutalism |
| **Lucide React** | Icon set — used at `stroke-[2.5]` or `stroke-[3]` for bold appearance |
| **Space Grotesk** | Display/heading font (Google Fonts) |
| **Poppins** | Body/UI text font (Google Fonts) |
