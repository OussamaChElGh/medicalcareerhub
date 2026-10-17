import {StrictMode, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import { V2App } from './v2/V2App.tsx';
import './index.css';

const ClassicApp = lazy(() => import('./App.tsx'));

const path = window.location.pathname.replace(/\/+$/, '');
const params = new URLSearchParams(window.location.search);
const isClassic = path === '/classic' || params.get('classic') === '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isClassic ? (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-bg-deep px-6 text-center">
            <p className="font-magic text-sm uppercase tracking-[0.3em] text-gold">
              Abriendo el archivo clásico...
            </p>
          </div>
        }
      >
        <ClassicApp />
      </Suspense>
    ) : (
      <V2App />
    )}
  </StrictMode>,
);
