import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendar,
  faDollarSign,
  faFileContract,
  faBars,
} from "@fortawesome/free-solid-svg-icons"; // Importando ícone de menu
import { ChevronLeft } from "@mui/icons-material";

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false); // Estado para controlar a visibilidade do Drawer
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const handleToggleDrawer = () => {
    setOpen(!open); // Alterna o estado do Drawer
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        onClick={handleToggleDrawer}
        sx={{ margin: 2, zIndex: 1, marginTop: -100 }}
      >
        <FontAwesomeIcon icon={faBars} style={{ color: "#2c3e50" }} />
      </IconButton>
      <Drawer
        variant="temporary" // Mudando para "temporário"
        open={open}
        onClose={handleToggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2c3e50", // Cor de fundo da sidebar
            color: "#ecf0f1", // Cor do texto
          },
        }}
        anchor="left"
      >
        <Box sx={{ padding: 2, textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#ecf0f1" }}
          >
            Sistema de Gestão
          </Typography>
          <IconButton
            onClick={handleToggleDrawer}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <ChevronLeft style={{ color: "#ecf0f1" }} />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: "#34495e" }} />
        <List>
          {[
            { text: "Clientes", icon: faUsers, path: "/clientes" },
            { text: "Eventos", icon: faCalendar, path: "/eventos" },
            { text: "Financeiro", icon: faDollarSign, path: "/financeiro" },
            { text: "Caixa", icon: faDollarSign, path: "/caixa" },
            { text: "Calendário", icon: faCalendar, path: "/calendario" },
            { text: "Contratos", icon: faFileContract, path: "/contratos" },
          ].map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{ "&:hover": { backgroundColor: "#34495e" } }}
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} />
              <ListItemText
                primary={item.text}
                sx={{ marginLeft: 2, color: "#ecf0f1" }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: "#34495e" }} />
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{ "&:hover": { backgroundColor: "#c0392b" } }}            
          >
            <ListItemText primary="Sair" sx={{ color: "#ecf0f1" }} />
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
