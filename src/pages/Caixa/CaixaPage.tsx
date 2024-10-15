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
  Container,
  TablePagination,
  IconButton,
  Grid,
  AppBar,
  Toolbar
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiClient from "../../services/apiClient";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Swal from "sweetalert2";

interface Caixa {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  origem: string;
  destino: string;
  entrada: boolean;
  saida: boolean;
  saldoTotal: number;
}

const CaixaPage: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [caixa, setCaixa] = useState<Caixa[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginasCaixa = caixa.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const [formValues, setFormValues] = React.useState<Caixa>({
    id: 0,
    data: "",
    descricao: "",
    valor: 0,
    origem: "",
    destino: "",
    entrada: false,
    saida: false,
    saldoTotal: 0,
  });
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const formatDateForApi = (date: Date | null): string => {
    if (!date) return '';

    // Criar uma nova data ajustando o fuso horário para UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    // Formatar a data como ISO 8601 e ajustar o formato para a API
    return utcDate.toISOString().replace('Z', '');  // Remove o 'Z' (indicador de UTC) se necessário
  };

  const handleTimeChange = (newTime: string | null) => {
    setSelectedTime(newTime);
  };

  const inserirCaixa = async() => {
    const formattedDate = formatDateForApi(selectedDate);
    console.log(formattedDate);
    await apiClient.post("/api/caixa/", {
      data: formattedDate,
      descricao: formValues.descricao,
      valor: formValues.valor,
      origem: formValues.origem,
      destino: formValues.destino,
      entrada: formValues.entrada,
      saida: formValues.saida,
      saldoTotal: formValues.saldoTotal
    })
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await apiClient.delete(`/api/caixa/${id}`);
      setCaixa(caixa.filter(caixa => caixa.id !== id));
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Evento excluído com sucesso!',
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

  useEffect(() => {
    const listarCaixa = async () => {
      try {
        const response = await apiClient.get("/api/caixa/");
        setCaixa(response.data);
      } catch (err) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    listarCaixa();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Box>
        <AppBar
          position="static"
          style={{
            backgroundColor: "#ffcc80",
            color: "black",
            marginBottom: 20,
          }}
        >
          <Toolbar>
            <Typography variant="h6">Caixa</Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Selecionar data do evento"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              variant="outlined"
              value={formValues.descricao}
              onChange={handleChange}
              style={{ marginTop: "10px" }}
              required
            />
            <TextField
              label="Valor"
              name="valor"
              variant="outlined"
              value={formValues.valor}
              onChange={handleChange}
              required
              sx={{ maxWidth: 100, marginTop: "10px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Origem"
              name="origem"
              variant="outlined"
              value={formValues.origem}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Destino"
              name="destino"
              variant="outlined"
              value={formValues.destino}
              onChange={handleChange}
              style={{ marginTop: "10px" }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "auto", display: "block" }} // Ajuste aqui
              onClick={inserirCaixa}
            >
              Cadastrar
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginasCaixa.map((caixa) => (
                <TableRow key={caixa.id}>
                  <TableCell>
                    {new Date(caixa.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{caixa.descricao}</TableCell>
                  <TableCell>{caixa.valor}</TableCell>
                  <TableCell>{caixa.origem}</TableCell>
                  <TableCell>{caixa.destino}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(caixa.id!)}
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
          count={caixa.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default CaixaPage;
