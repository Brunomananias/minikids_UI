import axios from 'axios';

// Função para pegar o token do localStorage
const getToken = () => {
  return localStorage.getItem('jwtToken');
};

// Criação do cliente Axios
const apiClient = axios.create({
  baseURL: 'https://minikidsapi-gaayfkayexd0a4e2.brazilsouth-01.azurewebsites.net', // URL do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token ao cabeçalho Authorization em cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Recupera o token do localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token no cabeçalho
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
