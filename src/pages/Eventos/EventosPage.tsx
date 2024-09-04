import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Calendar from 'react-calendar'; // Importe a biblioteca de calendário
import 'react-calendar/dist/Calendar.css'; // Importe os estilos padrão
import { AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

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
  clienteId: string;
  observacoes: string;
}

interface Evento {
  data: string;
  pacote: string;
  tempoDeFesta: string;
  endereco: string;
  clienteId: string;
  observacoes: string;
}

const EventFormWithTable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    data: '',
    pacote: '',
    tempoDeFesta: '',
    endereco: '',
    clienteId: '',
    observacoes: ''
  });

  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Função para lidar com mudanças no formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Função para lidar com mudanças na data do evento
  const handleDateChange = (newValue: Date | Date[] | null): void => {
    setFormData(prevState => ({
      ...prevState,
      eventDate: Array.isArray(newValue) ? (newValue[0] ?? null) : (newValue ?? null)
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Adiciona o evento ao estado de eventos
    setEvents(prevEvents => [...prevEvents, formData]);
    // Limpa o formulário
    setFormData({
      data: '',
      pacote: '',
      tempoDeFesta: '',
      endereco: '',
      clienteId: '',
      observacoes: ''
    });
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await apiClient.get<Evento[]>('/api/Eventos');

        // Formatar as datas
        const formattedEvents = response.data.map((event) => {
          // Converter a string ISO para um objeto Date
          const date = new Date(event.data);
          // Verificar se a data é válida
          const formattedDate = isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');

          return {
            ...event,
            formattedDate
          };
        });
        setEvents(formattedEvents);
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

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
                Data do Evento:
                <Calendar
                //   onChange={handleDateChange}
                //   value={formData.eventDate}
                //   style={{ maxWidth: '300px', margin: '10px 0' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Pacote Escolhido:
                <select name="package" value={formData.pacote} onChange={handleChange}>
                  <option value="">Selecione um pacote</option>
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxo</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Tempo de Festa (em horas):
                <input
                  type="text"
                  name="partyDuration"
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
                  name="partyAddress"
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
                  name="observacao"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observações"
                />
              </label>
            </div>

            <h3>Dados do Cliente</h3>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Código:
                <input
                  type="text"
                  name="code"
                  value={formData.clienteId}
                  onChange={handleChange}
                  placeholder="Código"
                />
              </label>
            </div>

            {/* <div style={{ marginBottom: '15px' }}>
              <label>
                Nome:
                <input
                  type="text"
                  name="firstName"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                Sobrenome:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Sobrenome"
                />
              </label>
            </div> */}

            <button type="submit">Enviar</button>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.data ? event.data : ''}</TableCell>
                      <TableCell>{event.pacote}</TableCell>
                      <TableCell>{event.tempoDeFesta}</TableCell>
                      <TableCell>{event.endereco}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center' }}>Nenhum evento cadastrado</TableCell>
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