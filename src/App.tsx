import React from 'react';
import { Box, CssBaseline, AppBar, List, Toolbar, Typography,  ListItem, ListItemText, Drawer, Divider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/ClientesPage';
import EventosPage from './pages/Eventos/EventosPage';
import FinanceiroPage from './pages/Financeiro/FinanceiroPage';
import ContratosPage from './pages/Contratos/ContratosPage';
import CalendarioPage from './pages/Calendario/CalendarioPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faCalendar, faDollarSign, faFileContract, faCog } from '@fortawesome/free-solid-svg-icons';
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
          <h5 style={{ textAlign: 'center', marginTop: 30 }}>Sistema de Gestão</h5>
          <List>
            <ListItem button component={Link} to="/" style={{ marginLeft: 10 }}>
              <FontAwesomeIcon icon={faHome} />
              <ListItemText primary="Home" style={{ marginLeft: 10 }}/>
            </ListItem>
            <ListItem button component={Link} to="/clientes" style={{ marginLeft: 8 }}>
            <FontAwesomeIcon icon={faUsers} />
              <ListItemText primary="Clientes" style={{ marginLeft: 8 }}/>
            </ListItem>
            <ListItem button component={Link} to="/eventos" style={{ marginLeft: 10 }}>
            <FontAwesomeIcon icon={faCalendar} />
              <ListItemText primary="Eventos" style={{ marginLeft: 10 }}/>
            </ListItem>
            <ListItem button component={Link} to="/financeiro" style={{ marginLeft: 11 }}>
            <FontAwesomeIcon icon={faDollarSign} />
              <ListItemText primary="Financeiro" style={{ marginLeft: 11 }}/>
            </ListItem> 
            <ListItem button component={Link} to="/calendario" style={{ marginLeft: 10 }}>
            <FontAwesomeIcon icon={faCalendar} />
              <ListItemText primary="Calendario" style={{ marginLeft: 10 }}/>
            </ListItem> 
            <ListItem button component={Link} to="/contratos" style={{ marginLeft: 10 }}>
             <FontAwesomeIcon icon={faFileContract} />
              <ListItemText primary="Contratos" style={{ marginLeft: 10 }}/>
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
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/contratos" element={<ContratosPage/>}/>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
