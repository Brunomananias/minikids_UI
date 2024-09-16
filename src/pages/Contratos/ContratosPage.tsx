import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { AppBar, Toolbar, Typography } from '@mui/material';

interface FormData {
  nomeCliente: string;
  endereco: string;
  cpf: string;
  enderecoFesta: string;
  horarioInicio: string;
  horarioFim: string;
  // Adicione outros campos conforme necessário
}

const ContratosPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCliente: '',
    endereco: '',
    cpf: '',
    enderecoFesta: '',
    horarioInicio: '',
    horarioFim: '',
    // Inicialize outros campos conforme necessário
  });

  const handleGeneratePDF = async () => {
    const pdfUrl = '/contrato.pdf'; // Substitua pelo caminho do seu PDF modelo
    
    // Busque o PDF modelo
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

    // Crie uma instância do PDFDocument
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Obtenha a primeira página do PDF
    const page = pdfDoc.getPages()[0];

    // Adicione texto no PDF em locais específicos
    page.drawText(formData.nomeCliente, {
      x: 83,
      y: 624,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(formData.cpf, {
      x: 365,
      y: 624,
      size: 12,
      color: rgb(0, 0, 0),
    });


    page.drawText(formData.endereco, {
      x: 170,
      y: 608,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Serializa o PDF para um ArrayBuffer
    const pdfBytes = await pdfDoc.save();

    // Cria um blob e faz o download do PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'contrato.pdf');
  };

  return (
    <>
    <AppBar position="static" style={{ backgroundColor: '#ffcc80', color: 'black' }}>
                <Toolbar>
                    <Typography variant="h6">Contratos</Typography>
                </Toolbar>
            </AppBar>
    <div>
      <h2>Preencha os dados do contrato</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleGeneratePDF(); }}>
        <div>
          <label>Nome do Cliente:</label>
          <input
            type="text"
            value={formData.nomeCliente}
            onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
          />
        </div>
        <div>
          <label>CPF:</label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />
        </div>
        <div>
          <label>Endereço:</label>
          <input
            type="text"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          />
        </div>
        {/* Adicione outros campos conforme necessário */}
        <button type="submit">Gerar PDF</button>
      </form>
    </div>
    </>
  );
};



export default ContratosPage;
