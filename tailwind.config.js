/** @type {import('tailwindcss').Config} */

// Warm Neutral Palette: Rich Espresso, Warm Earth, Roasted Stone, Warm Linen & Cream
const warmStone = {
  50: '#faf6ee',   // Warm alabaster cream (light mode background)
  100: '#f3ede2',  // Warm light parchment (light mode cards)
  200: '#e8dec4',  // Warm sandstone borders
  300: '#cfc1b2',  // Warm light sand
  400: '#aa9785',  // Warm sandy muted text
  500: '#8a7565',  // Warm earthen taupe
  600: '#6b5a4d',  // Warm dark taupe
  700: '#42372e',  // Warm deep clay
  800: '#2d251f',  // Warm hearth border & dividers
  850: '#221c18',  // Warm dark stone surface
  900: '#1a1613',  // Warm dark roast card background
  950: '#120f0d',  // Rich warm deep espresso background
};

// Agricultural Fresh Emerald & Light Green Palette
const agriculturalEmerald = {
  50: '#f0fdf4',   // Ultra-light mint / fresh leaf wash
  100: '#dcfce7',  // Soft fresh light green
  200: '#bbf7d0',  // Crisp light green border
  300: '#86efac',  // Fresh sprout highlight
  400: '#4ade80',  // Vibrant fresh green
  500: '#22c55e',  // Lush agricultural green
  600: '#16a34a',  // Deep rich farmer green (primary buttons)
  700: '#15803d',  // Forest crop green
  800: '#166534',  // Deep foliage text
  900: '#14532d',  // Deep evergreen
  950: '#052e16',  // Deepest forest
};

// Warm Harvest Amber & Gold Palette (for prices, alerts, and market benchmarks)
const warmAmberHarvest = {
  50: '#fefce8',   // Warm morning sunlight
  100: '#fef9c3',  // Warm pale buttercup
  200: '#fef08a',  // Warm straw gold
  300: '#fde047',  // Warm sunny harvest
  400: '#f59e0b',  // Radiant warm amber gold
  500: '#d97706',  // Rich warm harvest honey
  600: '#b45309',  // Deep warm roasted amber / caramel
  700: '#92400e',  // Warm cinnamon bronze
  800: '#78350f',  // Warm rustic rust
  900: '#451a03',  // Warm dark roasted pecan
  950: '#271002',  // Deep warm molasses
};

// Warm Terracotta & Burnt Sienna Palette (replaces cold teal and blue)
const warmTerracotta = {
  50: '#fff7ed',   // Warm peach cream
  100: '#ffedd5',  // Soft warm apricot
  200: '#fed7aa',  // Warm peach
  300: '#fdba74',  // Warm melon
  400: '#fb923c',  // Warm sunny tangerine
  500: '#f97316',  // Warm rich terracotta
  600: '#ea580c',  // Warm burnt sienna
  700: '#c2410c',  // Deep warm rust
  800: '#9a3412',  // Warm dark copper
  900: '#7c2d12',  // Deep warm clay
  950: '#431407',  // Deep warm terracotta night
};

// Warm Honey Bronze & Saffron Palette (replaces cold cyan)
const warmBronze = {
  50: '#fffbeb',   // Warm morning gold
  100: '#fef3c7',  // Warm buttercup
  200: '#fde68a',  // Golden straw
  300: '#fcd34d',  // Warm bright gold
  400: '#f59e0b',  // Warm honey amber
  500: '#d97706',  // Warm harvest amber
  600: '#b45309',  // Rich warm bronze
  700: '#92400e',  // Warm deep cinnamon
  800: '#78350f',  // Warm rustic amber
  900: '#451a03',  // Warm dark pecan
  950: '#260e02',  // Warm deep molasses
};

// Warm Spiced Plum / Burgundy Palette (replaces cold purple/indigo)
const warmBurgundy = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337',
  950: '#4c0519',
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Map all neutral families to warm stone & espresso
        slate: warmStone,
        zinc: warmStone,
        gray: warmStone,
        neutral: warmStone,
        stone: warmStone,
        // Agricultural fresh light green and emerald for farmers
        emerald: agriculturalEmerald,
        green: agriculturalEmerald,
        // Map cool blue & teal to warm terracotta
        teal: warmTerracotta,
        blue: warmTerracotta,
        // Map cool cyan to warm copper bronze
        cyan: warmBronze,
        // Map purple & indigo to warm spiced burgundy
        purple: warmBurgundy,
        indigo: warmBurgundy,
        // Explicit warm aliases
        warm: warmStone,
        amber: warmAmberHarvest,
        terracotta: warmTerracotta,
        bronze: warmBronze,
      },
    },
  },
  plugins: [],
};
