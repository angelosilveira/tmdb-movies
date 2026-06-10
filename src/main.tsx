import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/routes/router';
import { initSentry } from './infrastructure/monitoring/sentry';
import { initAnalytics } from './infrastructure/analytics/ga';
import './index.css';

// Bootstrap observability before rendering
initSentry();
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
