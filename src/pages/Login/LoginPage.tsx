// src/components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Swal from 'sweetalert2';
import CadastroUsuarioModal from "../../components/CadastroUsuarioModal/CadastroUsuarioModal";
import Button from "../../components/Button/Button"

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: string[]; password?: string[] }>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Button
              texto="Cadastrar"
              color="success"  
              onClick={() => setIsModalOpen(true)}           
            />
            <Button 
            texto="Login" 
            color="primary" 
            type="submit" 
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: -37
            }}
            />
          {generalError && <p className="error-message">{generalError}</p>}
          <CadastroUsuarioModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
