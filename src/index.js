import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './styles/index.css';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
