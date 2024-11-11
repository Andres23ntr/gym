// src/components/ChartsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 800px; /* Limitar el tamaño máximo para mantener la buena apariencia */
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function ChartsSection() {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/clientes-membresias')
      .then(response => {
        setLineData(response.data.map(item => ({
          name: item.fecha_inscripcion,
          cantidad: item.cantidad,
        })));
      })
      .catch(error => console.error('Error al obtener datos de inscripciones:', error));

    axios.get('http://localhost:8000/api/casilleros')
      .then(response => {
        const totalStock = response.data.reduce((acc, casillero) => acc + casillero.disponible, 0);
        const outOfStock = response.data.filter(casillero => casillero.disponible === 0).length;
        setPieData([
          { name: 'Casilleros Disponibles', value: totalStock },
          { name: 'Casilleros Ocupados', value: outOfStock }
        ]);
      })
      .catch(error => console.error('Error al obtener datos de casilleros:', error));
  }, []);

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <ChartsContainer>
      <ChartWrapper>
        <h3>Inscripciones Mensuales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper>
        <h3>Disponibilidad de Casilleros</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartsContainer>
  );
}

export default ChartsSection;
