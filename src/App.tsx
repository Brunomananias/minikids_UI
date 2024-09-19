// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/ClientesPage';
import EventosPage from './pages/Eventos/EventosPage';
import FinanceiroPage from './pages/Financeiro/FinanceiroPage';
import ContratosPage from './pages/Contratos/ContratosPage';
import CalendarioPage from './pages/Calendario/CalendarioPage';
import LoginPage from './pages/Login/LoginPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/clientes" element={isAuthenticated ? <ClientesPage /> : <Navigate to="/login" />} />
          <Route path="/eventos" element={isAuthenticated ? <EventosPage /> : <Navigate to="/login" />} />
          <Route path="/financeiro" element={isAuthenticated ? <FinanceiroPage /> : <Navigate to="/login" />} />
          <Route path="/calendario" element={isAuthenticated ? <CalendarioPage /> : <Navigate to="/login" />} />
          <Route path="/contratos" element={isAuthenticated ? <ContratosPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
