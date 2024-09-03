import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Container, TablePagination } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const apiClient = axios.create({
  baseURL: 'http://localhost:5250', // URL do backend
  headers: {
    'Content-Type': 'application/json',
  },
});
  
  interface Cliente {
    id?: number;
    nome: string;
    sobrenome: string;
    celular: string;
    email: string;
    endereco: string;
    eventos: [] // Inclua eventos, mesmo que esteja vazio
  }

const FormularioCadastro: React.FC = () => {
  const [formValues, setFormValues] = React.useState<Cliente>({
    nome: '',
    sobrenome: '',
    celular: '',
    email: '',
    endereco: '',
    eventos: [] // Inclua eventos, mesmo que esteja vazio
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
// Função para manipular a mudança de página
const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Voltar para a primeira página ao mudar o número de linhas por página
  };
const paginatedClientes = clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted', formValues);
  };

  const cadastrarCliente = async () => {
    try {
      const response = await apiClient.post('/api/clientes', {
        nome: formValues.nome,
        sobrenome: formValues.sobrenome,
        celular: formValues.celular,
        email: formValues.email,
        endereco: formValues.endereco,
      });
      const clienteCriado = response.data; 
      
      setClientes([...clientes, clienteCriado]);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500
      });
      setFormValues({
        nome: '',
        sobrenome: '',
        celular: '',
        email: '',
        endereco: '',
        eventos: [] // Inclua eventos, mesmo que esteja vazio
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await apiClient.get('/api/clientes');
        setClientes(response.data);
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth="lg">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Cadastro de Clientes
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="nome"
              name="nome"
              variant="outlined"
              value={formValues.nome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="sobrenome"
              name="sobrenome"
              variant="outlined"
              value={formValues.sobrenome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="email"
              name="email"
              variant="outlined"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="celular"
              name="celular"
              variant="outlined"
              type="tel"
              value={formValues.celular}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço" // Atualize o rótulo se necessário
              name="endereco"  // Certifique-se de que isso corresponde ao nome no estado
              variant="outlined"
              multiline
              rows={4}
              value={formValues.endereco}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={cadastrarCliente}
            >
              Cadastrar
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Tabela */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Clientes Cadastrados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Sobrenome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Endereço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.nome}</TableCell>
                  <TableCell>{row.sobrenome}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.celular}</TableCell>
                  <TableCell>{row.endereco}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={clientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </Box>
    </Container>
  );
}

export default FormularioCadastro;
