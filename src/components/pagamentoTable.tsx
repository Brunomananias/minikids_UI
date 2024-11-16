import React from 'react';
import { Table } from 'react-bootstrap';

interface Pagamento {
    id: number;
    valorPago: number;
    dataPagamento: string;
}

interface PagamentoTableProps {
    pagamentos: Pagamento[];
}

const PagamentoTable: React.FC<PagamentoTableProps> = ({ pagamentos }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Valor Pago</th>
                    <th>Data do Pagamento</th>
                </tr>
            </thead>
            <tbody>
                {pagamentos.map(pagamento => (
                    <tr key={pagamento.id}>
                        <td>{pagamento.valorPago.toFixed(2)}</td>
                        <td>{new Date(pagamento.dataPagamento).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default PagamentoTable;
