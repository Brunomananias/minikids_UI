// CalendarPage.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import apiClient from '../../services/apiClient';
import CalendarioModal from '../../components/CalendarioModal/CalendarioModal'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR }
});

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  enderecoFesta: string;
  horarioInicio: string;
  horarioFinal: string;
  pacote: string;
  observacao: string;
  nomeAniversariante: string;
  temaAniversario: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Event | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/api/Clientes');
      const data = response.data;
  
      console.log('Dados recebidos:', data);
  
      if (Array.isArray(data)) {
        const formattedEvents = data.flatMap((cliente: any) => {
          if (Array.isArray(cliente.eventos)) {
            return cliente.eventos.map((event: any) => {
              const horarioFestaDate = new Date(event.horarioFesta);
              const [hours, minutes, seconds] = event.tempoDeFesta.split(':').map(Number);
              const tempoDeFestaMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
              const horarioFinalDate = new Date(horarioFestaDate.getTime() + tempoDeFestaMs);
              const horarioFinal = `${String(horarioFinalDate.getHours()).padStart(2, '0')}:${String(horarioFinalDate.getMinutes()).padStart(2, '0')}`;
  
              return {
                title: cliente.nome + " " + cliente.sobrenome,
                start: new Date(event.data),
                end: new Date(new Date(event.data).getTime() + parseDuration(event.tempoDeFesta)),
                allDay: false,
                enderecoFesta: event.endereco,
                horarioInicio: `${String(horarioFestaDate.getHours()).padStart(2, '0')}:${String(horarioFestaDate.getMinutes()).padStart(2, '0')}`,
                horarioFinal: horarioFinal,
                pacote: event.pacote,
                observacao: event.observacoes,
                nomeAniversariante: event.nomeAniversariante,
                temaAniversario: event.temaAniversario
              };
            });
          }
          return [];
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

  const handleEventClick = (event: any) => {
    setEventoSelecionado(event)
    setIsModalOpen(true);
    console.log(event);
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
        culture="pt-BR"
        onSelectEvent={handleEventClick}
      />
       <CalendarioModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evento={{
          nomeContratante: eventoSelecionado?.title,
          endereco: eventoSelecionado?.enderecoFesta,
          horarioInicio: eventoSelecionado?.horarioInicio,
          horarioTermino: eventoSelecionado?.horarioFinal,
          pacote: eventoSelecionado?.pacote,
          observacao: eventoSelecionado?.observacao,
          nomeAniversariante: eventoSelecionado?.nomeAniversariante,
          temaAniversario: eventoSelecionado?.temaAniversario
  }}
/>
    </div>
   
  );
};

export default CalendarPage;

