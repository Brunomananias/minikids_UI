/* eslint-disable react/jsx-no-undef */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
  Box,
  TablePagination,
  IconButton,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClientModal from "../../components/clienteModal";
import TimePicker from "../../components/TimePicker";
import moment from "moment";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiClient from "../../services/apiClient";
import { JSX } from "react/jsx-runtime";

interface FormData {
  id: number;
  data: string;
  pacote: string;
  horarioFesta: string;
  tempoDeFesta: string;
  endereco: string;
  clienteId: number;
  valorTotalPacote: number;
  observacoes: string;
}

interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
}

interface Evento {
  id: number;
  data: string;
  pacote: string;
  horarioFesta: string;
  tempoDeFesta: string;
  endereco: string;
  clienteId: number;
  observacoes?: string;
  valorTotalPacote: number;
  formattedDate?: string;
  cliente?: Cliente;
}

interface EventoComCliente extends Evento {
  cliente?: Cliente;
}

const EventFormWithTable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    data: "",
    pacote: "",
    horarioFesta: "",
    tempoDeFesta: "",
    endereco: "",
    clienteId: 0,
    valorTotalPacote: 0,
    observacoes: "",
  });
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<{
    id: number;
    nome: string;
  } | null>(null);
  const [abrirModalClientes, setAbrirModalClientes] = useState<boolean>(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [events, setEvents] = useState<EventoComCliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [dataEvento, setDataEvento] = useState("");
  // Função para lidar com mudanças no formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Atualiza o estado para o campo específico
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, pacote: event.target.value });
  };

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

  const paginatedEventos = events.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // Atualizar evento existente
      const updatedEvent: Evento = {
        ...formData,
        id: formData.id, // ID do evento que está sendo editado
        clienteId: formData.clienteId,
      };

      // Chamada API para atualizar o evento (exemplo)
      apiClient
        .put(`/api/eventos/${updatedEvent.id}`, updatedEvent)
        .then((response) => {
          // Atualiza o estado de eventos com o evento atualizado
          setEvents(
            events.map((event) =>
              event.id === updatedEvent.id ? response.data : event
            )
          );
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Evento atualizado com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchEventos();
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Erro ao atualizar evento!",
            showConfirmButton: false,
            timer: 1500,
          });
        });

      setIsEditing(false); // Desativar o modo de edição
    } else {
      cadastrarEvento();
    }

    setFormData({
      id: 0,
      data: "",
      pacote: "",
      horarioFesta: "",
      tempoDeFesta: "",
      endereco: "",
      clienteId: 0,
      valorTotalPacote: 0,
      observacoes: "",
    });
  };

  const handleClientSelect = (id: number, nome: string) => {
    const clienteSelecionado = clientes.find((cliente) => cliente.id === id);

    if (clienteSelecionado) {
      setSelectedClient(clienteSelecionado);

      // Atualizar o estado do formulário com o cliente selecionado
      setFormData((prevFormData) => ({
        ...prevFormData,
        clienteId: clienteSelecionado.id,
      }));
    }

    setAbrirModalClientes(false);
  };

  const formatDateForApi = (date: Date | null): string => {
    if (!date) return "";

    // Criar uma nova data ajustando o fuso horário para UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    // Formatar a data como ISO 8601 e ajustar o formato para a API
    return utcDate.toISOString().replace("Z", "");
  };

  const handleTimeChange = (newTime: string | null) => {
    setSelectedTime(newTime);
  };

  const cadastrarEvento = async () => {
    try {
      console.log("teste");
      const formattedDate = formatDateForApi(selectedDate);
      const formattedTime = selectedTime
        ? `1970-01-01T${selectedTime}:00`
        : null;
      const response = await apiClient.post(
        "api/Eventos",
        {
          data: formattedDate,
          pacote: formData.pacote,
          horarioFesta: formattedTime,
          tempoDeFesta: formData.tempoDeFesta,
          endereco: formData.endereco,
          observacoes: formData.observacoes,
          clienteId: formData.clienteId,
          valorTotalPacote: formData.valorTotalPacote,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setEvents([...events, response.data]);
      fetchEventos();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Evento cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erro ao cadastrar evento!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const carregarClientes = async () => {
    try {
      const response = await apiClient.get("api/Clientes");
      setClientes(response.data);
      setAbrirModalClientes(true);
    } catch {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erro ao buscar clientes cadastrados!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting client with ID:", id);
      const response = await apiClient.delete(`/api/eventos/${id}`);
      console.log("Response from server:", response);
      setEvents(events.filter((evento) => evento.id !== id));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Evento excluído com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
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

  const handleRowClick = (evento: EventoComCliente) => {
    setFormData({
      ...evento,
      observacoes: evento.observacoes || "",
    });
    setSelectedRowId(evento.id);
    setSelectedClient({
      id: evento.cliente?.id || 0,
      nome: evento.cliente?.nome || "",
    });
    setSelectedDate(new Date(evento.data));
    setSelectedTime(evento.horarioFesta);
    setIsEditing(true);
  };

  const fetchEventos = async () => {
    try {
      const [eventResponse, clientResponse] = await Promise.all([
        apiClient.get<Evento[]>("/api/Eventos"),
        apiClient.get<Cliente[]>("/api/Clientes"),
      ]);

      const formattedEvents = eventResponse.data.map((event) => {
        const date = new Date(event.data);
        const formattedDate = isNaN(date.getTime())
          ? "Data inválida"
          : date.toLocaleDateString("pt-BR");

        return {
          ...event,
          formattedDate,
        };
      });

      // Mapear clientes por ID para acesso rápido
      const clientMap = new Map<number, Cliente>(
        clientResponse.data.map((client) => [client.id, client])
      );

      // Associar clientes aos eventos
      const eventsWithClients: EventoComCliente[] = formattedEvents.map(
        (event) => ({
          ...event,
          cliente: clientMap.get(event.clienteId) || undefined, // Usar undefined para garantir que seja compatível com Cliente | undefined
        })
      );

      setEvents(eventsWithClients);
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const formattedEvents = events.map((event) => ({
    data: event.data,
    pacote: event.pacote,
    horarioFesta: event.horarioFesta,
    tempoDeFesta: event.tempoDeFesta,
    endereco: event.endereco,
    observacoes: event.observacoes,
    clienteNome: event.cliente ? event.cliente.nome : "N/A",
    clienteSobrenome: event.cliente ? event.cliente.sobrenome : "N/A",
  }));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AppBar
        position="static"
        style={{ backgroundColor: "#ffcc80", color: "black" }}
      >
        <Toolbar>
          <Typography variant="h6">Eventos</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Linha com Data, Horário, Pacote e Valor */}
            <Grid container item xs={12} spacing={2} alignItems="flex-end">
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data do Evento"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  onChange={handleTimeChange}
                />
              </Grid>
              <Grid item xs={3}>
                <Select
                  labelId="pacote-label"
                  name="pacote"
                  value={formData.pacote}
                  onChange={handleSelectChange}
                  label="Pacote Escolhido"
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Selecione um pacote</em>
                  </MenuItem>
                  <MenuItem value="nuvem">Nuvem</MenuItem>
                  <MenuItem value="sol">Sol</MenuItem>
                  <MenuItem value="lua">Lua</MenuItem>
                  <MenuItem value="cometa">Cometa</MenuItem>
                  <MenuItem value="estrela">Estrela</MenuItem>
                  <MenuItem value="arco-iris">Arco-Íris</MenuItem>
                  <MenuItem value="planetario">Planetário</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Valor do Pacote"
                  name="valorTotalPacote"
                  variant="outlined"
                  value={formData.valorTotalPacote}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {/* Linha com Tempo de Festa, Endereço e Observações */}
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Tempo de Festa (Horas)"
                  name="tempoDeFesta"
                  variant="outlined"
                  value={formData.tempoDeFesta}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  variant="outlined"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="observacoes"
                  variant="outlined"
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Botão de Buscar Clientes */}
            <Grid item xs={7} sm={10} style={{ marginTop: '-10px' }}>
              <Button variant="text" onClick={carregarClientes}>
                Buscar Clientes
              </Button>
              <ClientModal
                show={abrirModalClientes}
                onHide={() => setAbrirModalClientes(false)}
                clientes={clientes}
                onSelectClient={handleClientSelect}
              />
            </Grid>

            {/* Código e Nome do Cliente */}
            <Grid container item xs={12} spacing={2} style={{ marginTop: '-20px' }}>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  label="Código"
                  name="clienteId"
                  value={selectedClient ? selectedClient.id : ''}
                  onChange={handleChange}
                  placeholder="Código"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="firstName"
                  value={selectedClient ? selectedClient.nome : ''}
                  disabled
                  placeholder="Nome"
                />
              </Grid>
            </Grid>

            {/* Botão de Submit */}
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
              {isEditing && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={cadastrarEvento}
                  style={{ marginLeft: "10px" }}
                >
                  Cadastrar Evento
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
      <div style={{ flex: 1 }}>
        <h3>Eventos Cadastrados</h3>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Pacote</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Duração</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Observações</TableCell>
                <TableCell>Cliente Nome</TableCell>
                <TableCell>Cliente Sobrenome</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEventos.map((event) => (
                <TableRow
                  key={event.id}
                  onClick={() => handleRowClick(event)}
                  style={{
                    backgroundColor:
                      selectedRowId === event.id ? "#f0f0f0" : "transparent",
                  }}
                >
                  <TableCell>
                    {new Date(event.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{event.pacote}</TableCell>
                  <TableCell>
                    {moment(event.horarioFesta).format("LT")}
                  </TableCell>
                  <TableCell>{event.tempoDeFesta}</TableCell>
                  <TableCell>{event.endereco}</TableCell>
                  <TableCell>{event.observacoes || "N/A"}</TableCell>
                  <TableCell>
                    {event.cliente ? event.cliente.nome : "N/A"}
                  </TableCell>
                  <TableCell>
                    {event.cliente ? event.cliente.sobrenome : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(event.id!)}
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
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default EventFormWithTable;
