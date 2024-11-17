// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/Clientes/ClientesPage';
import EventosPage from './pages/Eventos/EventosPage';
import FinanceiroPage from './pages/Financeiro/FinanceiroPage';
import ContratosPage from './pages/Contratos/ContratosPage';
import CalendarioPage from './pages/Calendario/CalendarioPage';
import LoginPage from './pages/Login/LoginPage';
import CaixaPage from './pages/Caixa/CaixaPage';
function App() {
  const isAuthenticated = !!localStorage.getItem('jwtToken');
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/clientes" element={isAuthenticated ? <ClientesPage /> : <LoginPage />} />
          <Route path="/eventos" element={isAuthenticated ? <EventosPage /> : <LoginPage />} />
          <Route path="/financeiro" element={isAuthenticated ? <FinanceiroPage /> : <LoginPage />} />
          <Route path="/caixa" element={isAuthenticated ? <CaixaPage /> : <LoginPage />} />
          <Route path="/calendario" element={isAuthenticated ? <CalendarioPage /> : <LoginPage />} />
          <Route path="/contratos" element={isAuthenticated ? <ContratosPage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/" element={isAuthenticated ? <ClientesPage/> : <LoginPage/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
