import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Container, TablePagination, IconButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../services/apiClient';
interface Cliente {
  id?: number;
  nome: string;
  sobrenome: string;
  celular: string;
  email: string;
  endereco: string;
  eventos: []
}

const FormularioCadastro: React.FC = () => {
  const [formValues, setFormValues] = React.useState<Cliente>({
    nome: '',
    sobrenome: '',
    celular: '',
    email: '',
    endereco: '',
    eventos: []
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    if (selectedCliente) {
      atualizarCliente();
    } else {
      cadastrarCliente();
    }
  };

  const cadastrarCliente = async () => {
    try {
      const response = await apiClient.post('/api/clientes', formValues);
      const clienteCriado = response.data;

      setClientes([...clientes, clienteCriado]);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500
      });
      handleAddNew(); // Limpar formulário após cadastro
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
    }
  };

  const atualizarCliente = async () => {
    try {
      if (!selectedCliente?.id) return;
      await apiClient.put(`/api/clientes/${selectedCliente.id}`, formValues);
      setClientes(clientes.map(cliente => cliente.id === selectedCliente.id ? formValues : cliente));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1500
      });
      handleAddNew(); // Limpar formulário após atualização
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting client with ID:', id);
      const response = await apiClient.delete(`/api/clientes/${id}`);
      console.log('Response from server:', response);
      setClientes(clientes.filter(cliente => cliente.id !== id));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente excluído com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao excluir cliente',
        text: 'Houve um problema ao tentar excluir o cliente. Tente novamente mais tarde.',
        showConfirmButton: true,
      });
    }
  };
  

  const handleRowClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormValues(cliente);
  };

  const handleAddNew = () => {
    setSelectedCliente(null);
    setFormValues({
      nome: '',
      sobrenome: '',
      celular: '',
      email: '',
      endereco: '',
      eventos: []
    });
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
        <Typography variant="h4" fontSize={{ xs: 24, sm: 40}} gutterBottom>
          {selectedCliente ? 'Editar Cliente' : 'Cadastro de Clientes'}
        </Typography>
        <Grid container spacing={2} item xs={5} sm={10} direction={{ xs: "column", sm: "row"}}>
          <Grid item xs={5} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              variant="outlined"
              value={formValues.nome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={5} sm={6}>
            <TextField
              fullWidth
              label="Sobrenome"
              name="sobrenome"
              variant="outlined"
              value={formValues.sobrenome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={5} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={5} sm={6}>
            <TextField
              fullWidth
              label="Celular"
              name="celular"
              variant="outlined"
              type="tel"
              value={formValues.celular}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Endereço"
              name="endereco"
              variant="outlined"
              multiline
              rows={4}
              value={formValues.endereco}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {selectedCliente ? 'Atualizar' : 'Cadastrar'}
            </Button>

            {selectedCliente && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddNew}
                style={{ marginTop: '10px' }}
              >
                Cadastrar Novo
              </Button>
            )}
          </Grid>
      </Box>
      <Box sx={{ marginTop: 4 }}>
  <Typography variant="h5" gutterBottom>
    Clientes Cadastrados
  </Typography>
  <TableContainer component={Paper} sx={{ overflowX: 'auto', maxWidth: { xs: '100%', sm: 'auto' } }}>
    <Table sx={{ minWidth: { xs: 350, sm: 650 } }}>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>Sobrenome</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Celular</TableCell>
          <TableCell>Endereço</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedClientes.map((cliente) => (
          <TableRow key={cliente.id} onClick={() => handleRowClick(cliente)} style={{ cursor: 'pointer' }}>
            <TableCell>{cliente.nome}</TableCell>
            <TableCell>{cliente.sobrenome}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>{cliente.celular}</TableCell>
            <TableCell>{cliente.endereco}</TableCell>
            <TableCell>
              <IconButton color="secondary" onClick={() => handleDelete(cliente.id!)}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </TableCell>
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
