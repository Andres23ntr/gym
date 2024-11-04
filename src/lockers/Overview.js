import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Overview.css'; // Importa el archivo CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Overview({ casilleros }) {
  const [totalDisponibles, setTotalDisponibles] = useState(0);
  const [casillerosPorVencer, setCasillerosPorVencer] = useState(0);
  const [totalOcupados, setTotalOcupados] = useState(0);

  useEffect(() => {
    if (casilleros.length > 0) {
      // Total de casilleros disponibles
      const disponibles = casilleros.filter(casillero => casillero.estado === 'Disponible').length;
      setTotalDisponibles(disponibles);

      // Casilleros por vencer
      const hoy = new Date();
      const proximoVencimiento = hoy.setDate(hoy.getDate() + 5);
      const vencidos = casilleros.filter(casillero => {
        const fechaVencimiento = new Date(casillero.fecha_devolucion); // Asegúrate de que esta propiedad exista
        return (
          casillero.estado === 'Ocupado' &&
          fechaVencimiento <= proximoVencimiento
        );
      });
      setCasillerosPorVencer(vencidos.length);

      // Total de casilleros ocupados
      const ocupados = casilleros.filter(casillero => casillero.estado === 'Ocupado').length;
      setTotalOcupados(ocupados);
    }
  }, [casilleros]);

  return (
    <div className="inventory-overview">
      <div className="card">
        <h3>Casilleros Disponibles</h3>
        <p>{totalDisponibles}</p>
      </div>
      <div className="card low-stock">
        <h3>Casilleros por Vencer</h3>
        <p>{casillerosPorVencer}</p>
      </div>
      <div className="card out-of-stock">
        <h3>Casilleros Ocupados</h3>
        <p>{totalOcupados}</p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Overview;
