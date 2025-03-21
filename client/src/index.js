import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'
import { IncidentsProvider } from './contexts/IncidentsContext';
import { App as AppAnt } from 'antd';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppAnt>
      <AuthProvider>
        <IncidentsProvider>
          <App />
        </IncidentsProvider>
      </AuthProvider>
    </AppAnt>
  </React.StrictMode>
);
