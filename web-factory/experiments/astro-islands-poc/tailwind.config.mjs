import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        tremor: {
          brand: {
            faint: colors.indigo[50],
            muted: colors.indigo[200],
            subtle: colors.indigo[400],
            DEFAULT: colors.indigo[500],
            emphasis: colors.indigo[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: { DEFAULT: colors.gray[200] },
          ring: { DEFAULT: colors.gray[200] },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
      },
      boxShadow: {
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  // Tremor builds color classes dynamically, so they must be safelisted.
  safelist: [
    { pattern: /^(bg-(?:indigo|emerald|rose|amber|gray)-(?:50|100|200|300|400|500|600|700|800|900))$/ },
    { pattern: /^(text-(?:indigo|emerald|rose|amber|gray)-(?:50|100|200|300|400|500|600|700|800|900))$/ },
    { pattern: /^(border-(?:indigo|emerald|rose|amber|gray)-(?:50|100|200|300|400|500|600|700|800|900))$/ },
    { pattern: /^(fill-(?:indigo|emerald|rose|amber|gray)-(?:50|100|200|300|400|500|600|700|800|900))$/ },
    { pattern: /^(stroke-(?:indigo|emerald|rose|amber|gray)-(?:50|100|200|300|400|500|600|700|800|900))$/ },
  ],
};
