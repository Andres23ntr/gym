// src/components/StatsCards.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;

  h3 {
    font-size: 18px;
    color: #333;
  }

  p {
    font-size: 32px;
    color: ${({ color }) => color || '#007bff'};
  }
`;

function StatsCards() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [membresiasVencidas, setMembresiasVencidas] = useState(0);
  const [pagosHoy, setPagosHoy] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/clientes')
      .then(response => setTotalClientes(response.data.length))
      .catch(error => console.error('Error al obtener los clientes:', error));

    axios.get('http://localhost:8000/api/MembresiasVencidas')
      .then(response => setMembresiasVencidas(response.data.length))
      .catch(error => console.error('Error al obtener las membresías vencidas:', error));

    axios.get('http://localhost:8000/api/pagos')
      .then(response => setPagosHoy(response.data.length))
      .catch(error => console.error('Error al obtener los pagos:', error));
  }, []);

  return (
    <StatsContainer>
      <Card color="#007bff">
        <h3>Total de Clientes</h3>
        <p>{totalClientes}</p>
      </Card>
      <Card color="#ffa500">
        <h3>Membresías Vencidas</h3>
        <p>{membresiasVencidas}</p>
      </Card>
      <Card color="#28a745">
        <h3>Pagos de Hoy</h3>
        <p>{pagosHoy}</p>
      </Card>
    </StatsContainer>
  );
}

export default StatsCards;
