# MarketPulse AI — Architecture Ledger & Technical Context

## 1. System Overview & Technology Stack
- **Framework:** React 19 (`react: ^19.2.8`, `react-dom: ^19.2.8`)
- **Language:** TypeScript 6.0 (`typescript: ~6.0.2`)
- **Bundler & Build Tool:** Vite 8.2 (`vite: ^8.2.0`, `@vitejs/plugin-react: ^6.0.4`)
- **Styling:** TailwindCSS v4 (`@tailwindcss/vite: ^4.3.3`, `tailwindcss: ^4.3.3`, `@import "tailwindcss"` in `index.css`)
- **Design Philosophy:** Premium Neo-Brutalism (thick `#111111` borders, hard offset drop-shadows, high contrast, vibrant accents)
- **Visualizations:**
  - `recharts: ^3.10.1` (Neo-Brutalist wrapped Area, Bar, Pie, and Line charts)
  - `leaflet: ^1.9.4` & `react-leaflet: ^5.0.0` (Interactive OpenStreetMap city markers)
  - Custom SVG Vector Map (`src/maps/IndiaSvgMap.tsx`) for 11 Indian commercial states
- **Motion & Interactions:** `framer-motion: ^12.43.0` (Staggered entrances, floating cards, modal transitions)
- **Icons:** `lucide-react: ^1.28.0` (Thick `stroke-[2.5]` brutalist styling)
- **Routing:** `react-router-dom: ^7.18.2` (Nested layout with `<MainLayout />`)
- **Linter:** `oxlint: ^1.75.0`

## 2. Architectural Choices & Rationale
1. **Client-Side Analytical In-Memory Cache (`src/services/dataService.ts`)**:
   - Rather than requiring a live database for development and demos, a deterministic pseudo-random generator (`mockDataGenerator.ts`) creates ~2,500+ records across 11 states, 44 cities, 16 brands, and 64 SKUs.
   - All filter reductions, KPI calculations, and comparisons execute in sub-millisecond speeds directly in client memory.
2. **Neo-Brutalist Component Wrappers**:
   - Custom atomic components (`Button`, `Card`, `Badge`, `Input`, `Dropdown`, `Modal`, `EmptyState`, `Table`) in `src/components/` encapsulate the Neo-Brutalism styling rules and offset box shadows.
3. **Data Export Engine (`src/components/Table.tsx`)**:
   - Direct client-side blob generation for CSV and tab-delimited Excel (.xls) formats without requiring backend endpoints.
4. **Geographic Drilldown**:
   - Two-tier spatial exploration: SVG state selection at macro level and Leaflet coordinate mapping at city level.

## 3. Directory Layout
- `src/charts/`: Recharts wrapper components styled with Neo-Brutalism rules
- `src/components/`: Reusable Neo-Brutalist UI primitives
- `src/constants/`: Seed entities (states, cities, categories, brands, products)
- `src/layouts/`: Application chrome (`MainLayout.tsx` with sticky `Navbar` and `Sidebar`)
- `src/maps/`: SVG India Map and Leaflet interactive map
- `src/pages/`: 8 route pages (Landing, HomeMap, Dashboard, Compare, Products, Reports, About, Settings)
- `src/routes/`: Route declarations using React Router v7
- `src/services/`: Analytical filtering and aggregation functions
- `src/types/`: TypeScript domain interfaces
- `src/utils/`: Seeded dataset generator
