import React from 'react';
import { Box, CssBaseline, AppBar, List, Toolbar, Typography,  ListItem, ListItemText, Drawer, Divider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/ClientesPage';
import EventosPage from './pages/Eventos/EventosPage';
import FinanceiroPage from './pages/Financeiro/FinanceiroPage';
import ContratosPage from './pages/Contratos/ContratosPage';

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          anchor="left"
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/clientes">
              <ListItemText primary="Clientes" />
            </ListItem>
            <ListItem button component={Link} to="/eventos">
              <ListItemText primary="Eventos" />
            </ListItem>
            <ListItem button component={Link} to="/financeiro">
              <ListItemText primary="Financeiro" />
            </ListItem> 
            <ListItem button component={Link} to="/contratos">
              <ListItemText primary="Contratos" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, padding: 3 }}
        >
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/contratos" element={<ContratosPage/>}/>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
