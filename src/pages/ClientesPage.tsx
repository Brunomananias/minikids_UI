import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import FormularioCadastro from '../components/formularioCadastro'; // Certifique-se de que o caminho está correto

const Clientes = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static"  style={{ backgroundColor: '#ffcc80', color: 'black' }}>
        <Toolbar>
          <Typography variant="h6">Clientes</Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <FormularioCadastro />
      </Container>
    </Box>
  );
}
export default Clientes;