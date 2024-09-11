// FinanceiroPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientModal from '../../components/clienteModal'; // Certifique-se de que o caminho está correto
import PagamentoTable from '../../components/pagamentoTable';
import Swal from 'sweetalert2';
import moment from 'moment';
const apiClient = axios.create({
    baseURL: 'http://localhost:5250', // URL do backend
    headers: {
      'Content-Type': 'application/json',
    },
  });
interface Pagamento {
    id: number;
    valorPago: number;
    dataPagamento: string; // Usando string para data
}

interface Evento {
    id: number;
    data: string;
    pacote: string;
    tempoDeFesta: string;
    endereco: string;
    observacoes?: string;
    valorTotalPacote?: number;
    clienteId?: number;
    pagamentos: Pagamento[];
}

interface Client {
    id: number;
    nome: string;
    sobrenome: string;
}

const FinanceiroPage: React.FC = () => {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [idCliente, setIdCliente] = useState<number>(0)
    const [idEvento, setIdEvento] = useState<number>(0)
    const [valorPago, setValorPago] = useState<number>(0);
    const [valorRestante, setValorRestante] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [clientes, setClientes] = useState<Client[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<Client | null>(null);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [novoPagamento, setNovoPagamento] = useState<number>(0);
    const carregarPagamento = async (clienteId: number) => {
        try {
            const response = await apiClient.get(`/api/clientes/${clienteId}/pagamentos`);
            console.log('Resposta completa da API:', response.data);
    
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const pagamento = response.data[0];
                console.log('Pagamento:', pagamento);
    
                const valorPagoResponse = pagamento.valorPago !== undefined ? pagamento.valorPago : 0;
                const valorRestanteResponse = pagamento.valorRestante !== undefined ? pagamento.valorRestante : 0;
    
                setValorPago(valorPagoResponse);
                setValorRestante(valorRestanteResponse);
            } else {
                console.error('Resposta da API não contém dados ou está vazia.');
                setValorPago(0);
                setValorRestante(0);
            }
        } catch (error) {
            console.error('Erro ao buscar pagamentos:', error);
            setValorPago(0);
            setValorRestante(0);
        }
    };
    
    

    const carregarPagamentosRealizados = async(id: number) => {
        const response = await apiClient.get(`/api/pagamento/${id}`)
        setPagamentos(response.data)
    }

    const handleSelecionarCliente = async (id: number) => {
        try {
            const response = await apiClient.get(`/api/clientes/${id}/eventos`); // Ajuste a URL da API conforme necessário
            const eventosData = response.data;
    
            // Define o cliente selecionado
            setSelectedCliente(clientes.find(cliente => cliente.id === id) || null);
    
            // Formata as datas dos eventos
            const formattedEvents = eventosData.map((evento: any) => ({
                ...evento,
                start: moment(evento.data).toDate(), // Converte a data para objeto Date
                end: moment(evento.data).add(moment.duration(evento.tempoDeFesta)).toDate(), // Adiciona a duração ao evento
                formattedDate: moment(evento.data).format('DD/MM/YYYY HH:mm:ss') // Adiciona a data formatada se precisar exibir
            }));
    
            // Atualiza o estado com os eventos formatados
            setEventos(formattedEvents);
            setSelectedEvento(null); // Limpa o evento selecionado
            setIdCliente(eventosData[0].clienteId);
            setIdEvento(eventosData[0].id);
    
            // Carrega pagamentos realizados e o pagamento do cliente
            carregarPagamentosRealizados(eventosData[0].id);
            carregarPagamento(eventosData[0].clienteId);
    
        } catch (error) {
            console.error('Erro ao buscar eventos do cliente:', error);
        }
        setShowModal(false); // Fecha o modal após a seleção
    };

    const handleSelectEvento = async (id: number) => {
        try {
            const response = await apiClient.get(`/api/eventos/${id}`); // Ajuste a URL da API conforme necessário
            setSelectedEvento(response.data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do evento:', error);
        }
    };

    const handleAddPayment = async () => {
        if (selectedEvento) {
            try {
                await apiClient.post(`/api/pagamento`, {
                    EventoId: selectedEvento.id,
                    ValorPago: novoPagamento,
                    DataPagamento: new Date().toISOString()
                });
                // Atualizar a lista de pagamentos e o valor total pago
                const updatedEvento = { ...selectedEvento };
                updatedEvento.pagamentos.push({
                    id: selectedEvento.id, // Simulando um ID gerado pelo servidor
                    valorPago: novoPagamento,
                    dataPagamento: new Date().toISOString()
                });
                console.log(updatedEvento)
                setSelectedEvento(updatedEvento);
                carregarPagamento(idCliente);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Pagamento efetuado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                  });
                setNovoPagamento(0); // Limpa o valor do novo pagamento
            } catch (error) {
                console.error('Erro ao adicionar pagamento:', error);
            }
        }
    };

    // Valores de fallback para evitar problemas se selectedEvento não estiver definido
    const valorTotalPacote = selectedEvento?.valorTotalPacote ?? 0;
    // const valorPago = selectedEvento?.pagamentos.reduce((acc, pagamento) => acc + pagamento.valorPago, 0) ?? 0;
    // const valorRestante = valorTotalPacote - valorPago;
    useEffect(() => {
        // Buscar clientes quando o componente é montado
        const fetchClientes = async () => {
            try {
                const response = await apiClient.get('/api/clientes'); // Ajuste a URL da API conforme necessário
                setClientes(response.data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };
        fetchClientes();
    }, []);

    return (
        <div>
            <h1>Financeiro</h1>
            <Button onClick={() => setShowModal(true)}>Selecionar Cliente</Button>

            {selectedCliente && (
                <>
                    <h2>Cliente Selecionado</h2>
                    <p><strong>Nome:</strong> {selectedCliente.nome} {selectedCliente.sobrenome}</p>

                    <h3>Eventos</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pacote</th>
                                <th>Data</th>
                                <th>Selecionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map(evento => (
                                <tr key={evento.id}>
                                    <td>{evento.id}</td>
                                    <td>{evento.pacote}</td>
                                    <td>{moment(evento.data).format('DD/MM/YYYY')}</td> {/* Exibe a data formatada */}
                                    <td>
                                        <Button onClick={() => handleSelectEvento(evento.id)}>Ver Detalhes</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {selectedEvento && (
                <>
                    <h3>Detalhes do Evento</h3>
                    <Form>
                        <Form.Group controlId="formEventoData">
                            <Form.Label>Data</Form.Label>
                            <Form.Control type="text" value={moment(selectedEvento.data).format('DD/MM/YYYY')} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formEventoPacote">
                            <Form.Label>Pacote</Form.Label>
                            <Form.Control type="text" value={selectedEvento.pacote} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formEventoTempo">
                            <Form.Label>Tempo de Festa</Form.Label>
                            <Form.Control type="text" value={selectedEvento.tempoDeFesta} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formEventoEndereco">
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control type="text" value={selectedEvento.endereco} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formEventoObservacoes">
                            <Form.Label>Observações</Form.Label>
                            <Form.Control type="text" value={selectedEvento.observacoes ?? ''} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formValorTotalPacote">
                            <Form.Label>Valor Total do Pacote</Form.Label>
                            <Form.Control type="text" value={valorTotalPacote.toFixed(2)} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formValorPago">
                            <Form.Label>Valor Pago</Form.Label>
                            <Form.Control type="text" value={valorPago.toFixed(2)} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formValorRestante">
                            <Form.Label>Valor Restante</Form.Label>
                            <Form.Control type="text" value={valorRestante.toFixed(2)} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formNovoPagamento">
                            <Form.Label>Adicionar Pagamento</Form.Label>
                            <Form.Control
                                type="number"
                                value={novoPagamento}
                                onChange={(e) => setNovoPagamento(parseFloat(e.target.value))}
                                step="0.01"
                            />
                        </Form.Group>
                        <Button onClick={handleAddPayment}>Adicionar Pagamento</Button>
                    </Form>

                    <h3>Pagamentos Realizados</h3>
                    <PagamentoTable pagamentos={pagamentos} />
                </>
            )}

            <ClientModal
                show={showModal}
                onHide={() => setShowModal(false)}
                clientes={clientes}
                onSelectClient={handleSelecionarCliente}
            />
        </div>
    );
};

export default FinanceiroPage;
