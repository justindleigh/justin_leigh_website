# Tailwind snippets (use whichever matches the site)

## Tailwind v4 (`@theme` in your CSS)

```css
@theme {
  --color-eg-navy: #0C2C56;
  --color-eg-teal: #005C5C;
  --color-eg-teal-mid: #00818A;
  --color-eg-teal-light: #5CC6C0;
  --color-eg-slate: #5A6670;
  --color-eg-mist: #EEF2F3;
  --color-eg-silver: #C4CED4;
  --font-eg-display: "Cormorant Garamond", Georgia, serif;
  --font-eg-body: "Manrope", Helvetica, Arial, sans-serif;
}
```

## Tailwind v3 (`tailwind.config.js` → `theme.extend`)

```js
colors: {
  eg: {
    navy: '#0C2C56', teal: '#005C5C', 'teal-mid': '#00818A', 'teal-light': '#5CC6C0',
    slate: '#5A6670', mist: '#EEF2F3', silver: '#C4CED4',
  },
},
fontFamily: {
  'eg-display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
  'eg-body': ['Manrope', 'Helvetica', 'Arial', 'sans-serif'],
},
```

The `eg-` prefix keeps Evergreen styles from colliding with the law-firm site's own theme.
