import React from "react";
import { Button } from "@mui/material";

type BotaoProps = {
  texto: string;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "success" | "info";
  disabled?: boolean;
  type?: "submit" | "button" | "reset"; 
  style?: React.CSSProperties;
};

const Botao: React.FC<BotaoProps> = ({
  texto,
  onClick,
  variant = "contained",
  color = "primary",  
  disabled = false,
  type = "button",
  style,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      type={type}
      style={style}
    >
        {texto}
    </Button>
  );
};

export default Botao;
