import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Carregamento.css";
type Props = {
    loading: boolean;
  };
  
  const Carregamento = ({ loading }: Props) => {
    if (loading)
      return (
        <div className="loading-container">
          <i className="fas fa-spinner loading-icon"></i>
        </div>
      );
  
    return <p>Conteúdo carregado</p>;
  };
  
  export default Carregamento;
  
