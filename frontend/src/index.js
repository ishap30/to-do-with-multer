import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // ✅ StrictMode removed — it causes double-invocation of effects in dev
  // which can make fetch errors harder to debug. Re-add before production if desired.
  <App />
);

reportWebVitals();
