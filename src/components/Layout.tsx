// src/components/Layout.tsx
import React from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faCalendar, faDollarSign, faFileContract } from '@fortawesome/free-solid-svg-icons';

const drawerWidth = 200;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
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
                        <ListItemText primary="Home" style={{ marginLeft: 10 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/clientes" style={{ marginLeft: 8 }}>
                        <FontAwesomeIcon icon={faUsers} />
                        <ListItemText primary="Clientes" style={{ marginLeft: 8 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/eventos" style={{ marginLeft: 10 }}>
                        <FontAwesomeIcon icon={faCalendar} />
                        <ListItemText primary="Eventos" style={{ marginLeft: 10 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/financeiro" style={{ marginLeft: 11 }}>
                        <FontAwesomeIcon icon={faDollarSign} />
                        <ListItemText primary="Financeiro" style={{ marginLeft: 11 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/caixa" style={{ marginLeft: 11 }}>
                        <FontAwesomeIcon icon={faDollarSign} />
                        <ListItemText primary="Caixa" style={{ marginLeft: 11 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/calendario" style={{ marginLeft: 10 }}>
                        <FontAwesomeIcon icon={faCalendar} />
                        <ListItemText primary="Calendário" style={{ marginLeft: 10 }} />
                    </ListItem>
                    <ListItem button component={Link} to="/contratos" style={{ marginLeft: 10 }}>
                        <FontAwesomeIcon icon={faFileContract} />
                        <ListItemText primary="Contratos" style={{ marginLeft: 10 }} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Sair" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
