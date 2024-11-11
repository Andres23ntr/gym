import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap';

const HistorialCasilleros = () => {
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/historial-casilleros');
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de casilleros:', error);
        alert('Hubo un problema al cargar el historial.');
      } finally {
        setLoadingHistorial(false);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div>
      <h2 className="mt-5">Historial de Casilleros</h2>
      {loadingHistorial ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
          <p>Cargando historial...</p>
        </div>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID Historial</th>
              <th>ID Casillero</th>
              <th>ID Cliente</th>
              <th>Fecha Alquiler</th>
              <th>Fecha Devolución</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id_historial}>
                <td>{item.id_historial}</td>
                <td>{item.id_casillero}</td>
                <td>{item.id_cliente}</td>
                <td>{item.fecha_alquiler}</td>
                <td>{item.fecha_devolucion}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default HistorialCasilleros;
