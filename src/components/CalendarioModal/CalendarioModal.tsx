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
import { Footer } from "react-day-picker";

type CalendarioModalProps = {
  open: boolean;
  onClose: () => void;
  evento?: {
    nomeContratante?: string;
    endereco?: string;
    horarioInicio?: string;
    horarioTermino?: string;
    pacote?: string;
    observacao?: string;
    nomeAniversariante?: string;
    temaAniversario?: string;
  };
}

const CalendarioModal: React.FC<CalendarioModalProps> = ({ open, onClose, evento }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
      <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 600, lg: 800 },
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
    >
            <h4 style={{ fontWeight: "bolder" }}>
              Endereço da Festa
              <p style={{ fontWeight: "normal" }}>{evento?.endereco}</p>
            </h4>
            <h4 style={{ fontWeight: "bolder" }}>
              Pacote
              <p style={{ fontWeight: "normal" }}>{evento?.pacote}</p>
            </h4>        
            <h4 style={{ fontWeight: "bolder" }}>
              Contratante
              <p style={{ fontWeight: "normal" }}>{evento?.nomeContratante}</p>
            </h4>    
            <h4 style={{ fontWeight: "bolder" }}>
              Nome do Aniversariante
              <p style={{ fontWeight: "normal" }}>{evento?.nomeAniversariante}</p>
            </h4>          
            <h4 style={{ fontWeight: "bolder" }}>
              Tema do Aniversario
              <p style={{ fontWeight: "normal" }}>{evento?.temaAniversario}</p>
            </h4>           
            <h4 style={{ fontWeight: "bolder" }}>
              Inicio da Festa
              <p style={{ fontWeight: "normal" }}>{evento?.horarioInicio}</p>
            </h4>
            <h4 style={{ fontWeight: "bolder" }}>
              Término da Festa
              <p style={{ fontWeight: "normal" }}>{evento?.horarioTermino}</p>
            </h4>     
            <h4 style={{ fontWeight: "bolder" }}>
              Observação
              <p style={{ fontWeight: "normal" }}>{evento?.observacao}</p>
            </h4>    
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
                Fechar
              </Button>
            </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CalendarioModal;
