// src/components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Importa o CSS para a estilização
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

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

        // Armazenar o token no localStorage
        localStorage.setItem('jwtToken', token);

        // Redirecionar ou atualizar a interface
        navigate('/clientes');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Erros de validação específicos
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setGeneralError('An error occurred during login.');
        }
      } else {
        console.error('Error:', error);
        setGeneralError('An error occurred during login.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="image-section">
        {/* Substitua 'your-image-url.jpg' pela URL da sua imagem */}
        <img src="/images/minikids.png" alt="Login Background" />
      </div>
      <div className="form-section">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
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
          <button type="submit">Login</button>
          {generalError && <p className="error-message">{generalError}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
