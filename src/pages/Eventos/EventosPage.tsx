import React, { useState, ChangeEvent, FormEvent } from 'react';
import Calendar from 'react-calendar'; // Importe a biblioteca de calendário
import 'react-calendar/dist/Calendar.css'; // Importe os estilos padrão
import { AppBar, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

// Define o tipo para o estado do formulário
interface FormData {
  eventDate: Date | null;
  package: string;
  partyDuration: string;
  partyAddress: string;
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mobile: string;
  address: string;
}

// Define o tipo para os eventos na tabela
interface Event {
  eventDate: Date | null;
  package: string;
  partyDuration: string;
  partyAddress: string;
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mobile: string;
  address: string;
}

const EventFormWithTable: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    eventDate: null,
    package: '',
    partyDuration: '',
    partyAddress: '',
    code: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    mobile: '',
    address: ''
  });

  const [events, setEvents] = useState<Event[]>([]);

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
      eventDate: null,
      package: '',
      partyDuration: '',
      partyAddress: '',
      code: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      mobile: '',
      address: ''
    });
  };

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
                <select name="package" value={formData.package} onChange={handleChange}>
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
                  value={formData.partyDuration}
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
                  value={formData.partyAddress}
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
                  value={formData.partyDuration}
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
                  value={formData.code}
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
                  value={formData.firstName}
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
            </div>

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
                      <TableCell>{event.eventDate ? event.eventDate.toDateString() : ''}</TableCell>
                      <TableCell>{event.package}</TableCell>
                      <TableCell>{event.partyDuration}</TableCell>
                      <TableCell>{event.partyAddress}</TableCell>
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