import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Alert, Spinner, Container, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const HistorialPagos = () => {
  const { id } = useParams(); // Obtiene el ID del cliente desde los parámetros de la URL
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialPagos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/HistorialPagos/${id}`);
        setPagos(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de pagos:', error);
        setError('Hubo un problema al cargar el historial de pagos.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorialPagos();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando historial de pagos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center">Historial de Pagos del Cliente</h2>
      {pagos.length === 0 ? (
        <p className="text-center">No hay pagos registrados para este cliente.</p>
      ) : (
        <ListGroup>
          {pagos.map((pago) => (
            <ListGroup.Item key={pago.id_pago}>
              <p><strong>Fecha de Pago:</strong> {pago.fecha_pago}</p>
              <p><strong>Monto:</strong> ${parseFloat(pago.monto).toFixed(2)}</p>
              <p><strong>Método de Pago:</strong> {pago.metodo_pago}</p>
              <p><strong>Detalle:</strong> {pago.detalle}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <div className="text-center mt-4">
        <Link to="/ShowPagos" className="btn btn-secondary">
          Volver a Pagos
        </Link>
      </div>
    </Container>
  );
};

export default HistorialPagos;
