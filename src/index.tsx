import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { store } from "./app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App
        url={window.location.hash.substring(1)}
      />
    </Provider>
  </React.StrictMode>
);
