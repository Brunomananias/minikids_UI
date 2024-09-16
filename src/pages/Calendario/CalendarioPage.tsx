// CalendarPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importando o locale em português
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import apiClient from '../../services/apiClient';
// Função para localizador usando date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR } // Define o locale para português
});

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Função para buscar eventos da API
  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/api/Clientes'); // Atualize o endpoint conforme necessário
      const data = response.data;

      console.log('Dados recebidos:', data);

      // Verifica se data é um array
      if (Array.isArray(data)) {
        // Mapeia todos os clientes para extrair e formatar seus eventos
        const formattedEvents = data.flatMap((cliente: any) => {
          if (Array.isArray(cliente.eventos)) {
            return cliente.eventos.map((event: any) => ({
              title: cliente.nome, // Nome do cliente como título do evento
              start: new Date(event.data), // Data do evento
              end: new Date(new Date(event.data).getTime() + parseDuration(event.tempoDeFesta)), // Data do evento + duração
              allDay: true, // Definido como true, ajuste se necessário
            }));
          }
          return []; // Retorna um array vazio se não houver eventos
        });

        console.log('Eventos formatados:', formattedEvents);

        setEvents(formattedEvents);
      } else {
        console.error('A resposta da API não é um array ou está vazia:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };
  // Função auxiliar para converter duração em milissegundos
  const parseDuration = (duration: string) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        culture="pt-BR" // Define o locale para português
      />
    </div>
  );
};

export default CalendarPage;

