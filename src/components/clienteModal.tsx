import React, { useState } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Client {
    id: number;
    nome: string;
    sobrenome: string;
}

interface ClientModalProps {
    show: boolean;
    onHide: () => void;
    clientes: Client[];
    onSelectClient: (id: number, nome: string) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ show, onHide, clientes, onSelectClient }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleRowClick = (id: number, nome: string) => {
        setSelectedId(id);
        onSelectClient(id, nome);  // Passa o ID e nome para o componente pai
    };
    
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Clientes Cadastrados</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Sobrenome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr
                                key={cliente.id}
                                onClick={() => handleRowClick(cliente.id, cliente.nome)}
                                style={{ cursor: 'pointer', backgroundColor: cliente.id === selectedId ? '#e9ecef' : '' }}
                            >
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.sobrenome}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClientModal;
