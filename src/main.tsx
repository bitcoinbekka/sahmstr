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
 * The site uses one clean, modern voice: Inter throughout, as a variable font
 * so a single file covers every weight the display and body styles ask for.
 */
import '@fontsource-variable/inter';

/*
 * Apply the locked type setting before the first render. The page CSP forbids
 * inline script, so this cannot run in the document head — but doing it here,
 * ahead of createRoot, still beats React's first paint.
 */
bootstrapTypeSetting();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
