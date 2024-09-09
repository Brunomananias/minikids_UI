import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Calendar from 'react-calendar'; // Importe a biblioteca de calendário
import 'react-calendar/dist/Calendar.css'; // Importe os estilos padrão
import { AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, InputLabel, FormControl, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants, Box } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ClientModal from '../../components/clienteModal';
import { JSX } from 'react/jsx-runtime';

const apiClient = axios.create({
  baseURL: 'http://localhost:5250', // URL do backend
  headers: {
    'Content-Type': 'application/json',
  },
});
// Define o tipo para o estado do formulário
interface FormData {
  data: string;
  pacote: string;
  tempoDeFesta: string;
  endereco: string;
  clienteId: number;
  observacoes: string;
}

interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
}

interface Evento {
  id: number;
  data: string; // ou Date, dependendo de como você trata isso
  pacote: string;
  tempoDeFesta: string;
  endereco: string;
  clienteId: number; // Deve ser um número
  observacoes?: string;
  formattedDate?: string; // Adicionado para a data formatada
  cliente?: Cliente; // Adicionado para associar o cliente
}

interface EventoComCliente extends Evento {
  cliente?: Cliente; // Aqui 'cliente' é opcional, pois pode não existir para todos os eventos
}

const EventFormWithTable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    data: '',
    pacote: '',
    tempoDeFesta: '',
    endereco: '',
    clienteId: 0,
    observacoes: '',
  });
  const [selectedClient, setSelectedClient] = useState<{ id: number; nome: string } | null>(null);
  const [abrirModalClientes, setAbrirModalClientes] = useState<boolean>(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [events, setEvents] = useState<EventoComCliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [dataEvento, setDataEvento] = useState('');
  // Função para lidar com mudanças no formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Atualiza o estado para o campo específico
    setFormData(prevState => ({
      ...prevState,
      [name]: value

    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Verifique se `formData` possui todos os campos necessários
    const newEvent: Evento = {
      ...formData,
      id: 0,
      clienteId: 0,
    };
    // Adiciona o evento ao estado de eventos
    setEvents(prevEvents => [...prevEvents, newEvent]);
    // Limpa o formulário
    setFormData({
      data: '',
      pacote: '',
      tempoDeFesta: '',
      endereco: '',
      clienteId: 0, // Garantir que seja um número, ou ajustar conforme necessário
      observacoes: ''
    });
  };

  const handleClientSelect = (id: number, nome: string) => {
    const clienteSelecionado = clientes.find(cliente => cliente.id === id);
    
    if (clienteSelecionado) {
      setSelectedClient(clienteSelecionado);
      
      // Atualizar o estado do formulário com o cliente selecionado
      setFormData(prevFormData => ({
        ...prevFormData,
        clienteId: clienteSelecionado.id // Atualiza o ID do cliente como número
      }));
    }
    
    setAbrirModalClientes(false); // Fechar o modal após a seleção
  };

  const formatDateForApi = (date: Date | null): string => {
    if (!date) return '';

    // Criar uma nova data ajustando o fuso horário para UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    // Formatar a data como ISO 8601 e ajustar o formato para a API
    return utcDate.toISOString().replace('Z', '');  // Remove o 'Z' (indicador de UTC) se necessário
  };

  const cadastrarEvento = async () => {
    try {
      const formattedDate = formatDateForApi(selectedDate);
      
      const response = await apiClient.post('api/Eventos', {
        data: formattedDate,
        pacote: formData.pacote,
        tempoDeFesta: formData.tempoDeFesta,
        endereco: formData.endereco,
        observacoes: formData.observacoes,
        clienteId: formData.clienteId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      setEvents([...events, response.data]);
      fetchEventos();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Evento cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erro ao cadastrar evento!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  const carregarClientes = async () => {
    try {
      const response = await apiClient.get('api/Clientes');
      setClientes(response.data);
      setAbrirModalClientes(true)
    } catch {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erro ao buscar clientes cadastrados!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  const fetchEventos = async () => {
    try {
      const [eventResponse, clientResponse] = await Promise.all([
        apiClient.get<Evento[]>('/api/Eventos'),
        apiClient.get<Cliente[]>('/api/Clientes')
      ]);

      // Formatar eventos
      const formattedEvents = eventResponse.data.map((event) => {
        const date = new Date(event.data);
        const formattedDate = isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');

        return {
          ...event,
          formattedDate
        };
      });

      // Mapear clientes por ID para acesso rápido
      const clientMap = new Map<number, Cliente>(clientResponse.data.map(client => [client.id, client]));

      // Associar clientes aos eventos
      const eventsWithClients: EventoComCliente[] = formattedEvents.map(event => ({
        ...event,
        cliente: clientMap.get(event.clienteId) || undefined // Usar undefined para garantir que seja compatível com Cliente | undefined
      }));

      setEvents(eventsWithClients);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchEventos = async () => {
  //     try {
  //       const response = await apiClient.get<Evento[]>('/api/Eventos');
  //       // Formatar as datas
  //       const formattedEvents = response.data.map((event) => {
  //         // Converter a string ISO para um objeto Date
  //         const date = new Date(event.data);
  //         // Verificar se a data é válida
  //         const formattedDate = isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');

  //         return {
  //           ...event,
  //           formattedDate
  //         };
  //       });
  //       setEvents(formattedEvents);
  //     } catch (err) {
  //       setError('Erro ao carregar dados');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEventos();
  // }, []);

  useEffect(() => {
    fetchEventos();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Eventos</Typography>
        </Toolbar>
      </AppBar>

      <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Cadastro de Evento</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 300, margin: 'auto' }}>
                    <DatePicker
                      label="Selecionar data do evento"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                    />
                    {selectedDate && (
                      <p>Data selecionada: {selectedDate.toISOString().split('T')[0]}</p>
                    )}
                  </Box>
                </LocalizationProvider>
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Pacote Escolhido:
                <select name="pacote" value={formData.pacote} onChange={handleChange}>
                  <option value="">Selecione um pacote</option>
                  <option value="nuvem">Nuvem</option>
                  <option value="sol">Sol</option>
                  <option value="lua">Lua</option>
                  <option value="Cometa">Cometa</option>
                  <option value="Estrela">Estrela</option>
                  <option value="Arco-Iris">Arco-Iris</option>
                  <option value="Planetario">Planetario</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Tempo de Festa (em horas):
                <input
                  type="text"
                  name="tempoDeFesta"
                  value={formData.tempoDeFesta}
                  onChange={handleChange}
                  placeholder="Duração da festa"
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Endereço da Festa:
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Endereço da festa"
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Observações:
                <input
                  type="text"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observações"
                />
              </label>
            </div>

            <h3>Dados do Cliente</h3>
            <div className="container mt-5">
              <Button variant="text" onClick={carregarClientes}>
                Buscar Clientes
              </Button>

              <ClientModal
                show={abrirModalClientes}
                onHide={() => setAbrirModalClientes(false)}
                clientes={clientes}
                onSelectClient={handleClientSelect}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Código:
                <input
                  type="text"
                  name="clienteId"
                  value={selectedClient ? selectedClient.id : ''}
                  onChange={handleChange}
                  placeholder="Código"
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Nome:
                <input
                  type="text"
                  name="firstName"
                  value={selectedClient ? selectedClient.nome : ''}
                  disabled
                  onChange={handleChange}
                  placeholder="Nome"
                />
              </label>
            </div>

            <button type="submit" onClick={cadastrarEvento}>Enviar</button>
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Eventos Cadastrados</h2>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Pacote</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell>Cliente Nome</TableCell>
                  <TableCell>Cliente Sobrenome</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{new Date(event.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{event.pacote}</TableCell>
                      <TableCell>{event.tempoDeFesta}</TableCell>
                      <TableCell>{event.endereco}</TableCell>
                      <TableCell>{event.observacoes || 'N/A'}</TableCell>
                      <TableCell>{event.cliente ? event.cliente.nome : 'N/A'}</TableCell>
                      <TableCell>{event.cliente ? event.cliente.sobrenome : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                      Nenhum evento cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default EventFormWithTable;