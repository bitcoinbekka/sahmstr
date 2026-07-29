import { createRoot } from 'react-dom/client';

// Import polyfills first
import './lib/polyfills.ts';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { bootstrapTypeSetting } from '@/lib/typeSettings';
import App from './App.tsx';
import './index.css';

/*
 * Fonts.
 *
 * The site ships several complete typographic settings (see lib/typeSettings)
 * so the period voice can be chosen rather than guessed at. All faces load up
 * front — together they are a fraction of the poster imagery — and the active
 * setting is applied by swapping CSS variables, not by re-fetching webfonts.
 */

/* Body text */
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import '@fontsource-variable/crimson-pro';
import '@fontsource/josefin-sans/400.css';
import '@fontsource/josefin-sans/600.css';

/* Display faces */
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/bodoni-moda';
import '@fontsource/abril-fatface/400.css';
import '@fontsource/alfa-slab-one/400.css';
import '@fontsource/rye/400.css';

/* Slab / label faces */
import '@fontsource/bitter/500.css';
import '@fontsource/bitter/700.css';

/*
 * Apply the saved type setting before the first render. The page CSP forbids
 * inline script, so this cannot run in the document head — but doing it here,
 * ahead of createRoot, still beats React's first paint and avoids a visible
 * change of face on load.
 */
bootstrapTypeSetting();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
