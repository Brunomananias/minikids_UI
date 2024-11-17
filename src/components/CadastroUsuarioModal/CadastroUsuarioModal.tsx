import React, { useState } from "react";
import apiClient from "../../services/apiClient";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Backdrop,
  Fade,
} from "@mui/material";
import Swal from "sweetalert2";

const CadastroUsuarioModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = { username, password };

    try {
        await apiClient.post('api/Auth/cadastrar', user);
        onClose();
        setUsername("");
        setPassword("");
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Cadastrado com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          });
    } catch (err) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Erro ao Cadastrar Usuario",
            text: "Houve um problema ao tentar cadastrar o usuario. Tente novamente mais tarde.",
            showConfirmButton: true,
          });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Cadastrar Usuário
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome de Usuário"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Cadastrar
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CadastroUsuarioModal;
