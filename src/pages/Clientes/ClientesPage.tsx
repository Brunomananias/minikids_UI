import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  TablePagination,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../services/apiClient";
import { AppBar, Toolbar } from "@mui/material";
import Carregamento from "../../components/Carregamento/Carregamento";
import { getIdUsuario } from '../../services/apiClient';
import "./ClientesPage.css";

interface Cliente {
  id?: number;
  nome: string;
  sobrenome: string;
  celular: string;
  email: string;
  endereco: string;
  eventos: [];
}

const FormularioCadastro: React.FC = () => {
  const [formValues, setFormValues] = React.useState<Cliente>({
    nome: "",
    sobrenome: "",
    celular: "",
    email: "",
    endereco: "",
    eventos: [],
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [idUsuario, setIdUsuario] = useState(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedClientes = clientes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      const payload = {
        ...formValues,
        idUsuario,
      };

      if (!formValues.nome || !formValues.sobrenome || !formValues.endereco) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "É necessário preencher os campos obrigatórios!",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      } else {
        const response = await apiClient.post("/api/clientes", payload);
        const clienteCriado = response.data;

        setClientes([...clientes, clienteCriado]);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 1500,
        });
        handleAddNew();
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

  const atualizarCliente = async () => {
    try {
      if (!selectedCliente?.id) return;
      await apiClient.put(`/api/clientes/${selectedCliente.id}`, formValues);
      setClientes(
        clientes.map((cliente) =>
          cliente.id === selectedCliente.id ? formValues : cliente
        )
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleAddNew();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Você tem certeza?",
        text: "Você não terá como reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar !",
      });
        if (result.isConfirmed) {
          await apiClient.delete(`/api/clientes/${id}`);
          setClientes(clientes.filter((cliente) => cliente.id !== id));
          Swal.fire({
            title: "Deletado com sucesso!",
            text: "Os dados foram deletados.",
            icon: "success",
          });
        }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erro ao excluir cliente",
        text: "Houve um problema ao tentar excluir o cliente. Tente novamente mais tarde.",
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
      nome: "",
      sobrenome: "",
      celular: "",
      email: "",
      endereco: "",
      eventos: [],
    });
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await apiClient.get("/api/clientes");
        setClientes(response.data);
      } catch (err) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const idUsuario = getIdUsuario();
    setIdUsuario(idUsuario);
  }, []); 

  if (loading) return <Carregamento loading={true} />;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
      >
        <AppBar
          position="static"
          style={{
            backgroundColor: "#ffcc80",
            color: "black",
            marginBottom: 20,
          }}
        >
          <Toolbar>
            <Typography variant="h6">Cadastrar Clientes</Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={4}
          item
          xs={6}
          sm={11}
          direction={{ xs: "column", sm: "row" }}
          style={{ backgroundColor: "#FFFFFF", 
            marginTop: 20, 
            paddingRight: 30, 
            paddingBottom: 30,
            marginLeft: 5,
             }}
        >
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
          <Grid item xs={2}
          style={{ 
            marginTop: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            justifyContent: 'flex-end' 
          }}
          >
          <Button type="submit" variant="contained" color="primary" style={{ marginBottom: '10px' }} >
            {selectedCliente ? "Atualizar" : "Cadastrar"}
          </Button>

          {selectedCliente && (
            <Button
              variant="contained"
              color="success"
              onClick={handleAddNew}
            >
              Cadastrar Novo
            </Button>
          )}
        </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Clientes Cadastrados
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", maxWidth: { xs: "97%", sm: "auto" } }}
        >
          <Table sx={{ minWidth: { xs: 350, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Sobrenome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClientes.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.sobrenome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.celular}</TableCell>
                  <TableCell>{cliente.endereco}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleRowClick(cliente)}
                    >
                     <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(cliente.id!)}
                    >
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
};

export default FormularioCadastro;
