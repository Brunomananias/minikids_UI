// src/components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Importa o CSS para a estilização
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Swal from 'sweetalert2';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: string[]; password?: string[] }>({});
  const [generalError, setGeneralError] = useState<string>('');

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await apiClient.post('api/auth', {
        username,
        password
      });

      if (response.status === 200) {
        const token: string = response.data.token;
        localStorage.setItem('jwtToken', token);
        navigate('/clientes');
        window.location.reload();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocorreu um erro ao efetuar login!",
        timer: 2000,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && errors.username.map((msg, index) => (
              <p key={index} className="error-message">{msg}</p>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && errors.password.map((msg, index) => (
              <p key={index} className="error-message">{msg}</p>
            ))}
          </div>
          <button type="submit" className="botao-login">Login</button>
          {generalError && <p className="error-message">{generalError}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
