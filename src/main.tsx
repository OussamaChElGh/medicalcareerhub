import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { V2App } from './v2/V2App.tsx';
import './index.css';

const isV2 = new URLSearchParams(window.location.search).get('v2') === '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isV2 ? <V2App /> : <App />}
  </StrictMode>,
);
