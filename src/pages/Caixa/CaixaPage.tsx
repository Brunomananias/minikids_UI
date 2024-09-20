import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Container, TablePagination, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiClient from '../../services/apiClient';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface Caixa {
    id: number;
    data: string;
    descricao: string;
    valor: string;
    origem: string;
    destino: string;
    entrada: boolean;
    saida: boolean;
    saldoTotal: number;
  }

const CaixaPage: React.FC = () => {
    const[caixa, setCaixa] = useState<Caixa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const paginasCaixa = caixa.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const listarCaixa = async () => {
          try {
            const response = await apiClient.get('/api/caixa/');
            setCaixa(response.data);
          } catch (err) {
            setError('Erro ao carregar dados');
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
            <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Caixa
        </Typography>
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
                  <TableCell>{caixa.data}</TableCell>
                  <TableCell>{caixa.descricao}</TableCell>
                  <TableCell>{caixa.valor}</TableCell>
                  <TableCell>{caixa.origem}</TableCell>
                  <TableCell>{caixa.destino}</TableCell>
                  <TableCell>
                  <IconButton
                      color="secondary"
                    //   onClick={() => handleDelete(caixa.id!)}
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
        
    )
}

export default CaixaPage;
