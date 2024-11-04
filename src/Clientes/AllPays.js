import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const AllPayForClient = () => {
  const { id } = useParams(); // Captura el id_cliente desde la URL
  const [pagos, setPagos] = useState([]); // Aseguramos que sea un array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/pagos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Verifica si response.data es un array
        if (response.data && Array.isArray(response.data.pagos)) {
            setPagos(response.data.pagos); // Usa el array correcto de la respuesta
          } else {
            throw new Error('Los datos de pagos no son un array válido.');
          }
      } catch (error) {
        console.error('Error al cargar los pagos del cliente:', error);
        setError('Hubo un problema al cargar los pagos.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPagos();
    } else {
      setError('No se ha encontrado el token de autenticación.');
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando historial de pagos del cliente...</p>
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
      <Row>
        {pagos.length === 0 ? (
          <p className="text-center">No hay pagos registrados para este cliente.</p>
        ) : (
          pagos.map((pago) => (
            <Col key={pago.id_pago} md={6} lg={4} className="mb-3">
              <ListGroup>
                <ListGroup.Item>
                  <strong>Cliente:</strong> {pago.cliente.nombre_completo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Monto:</strong> ${pago.monto}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Fecha de Pago:</strong> {new Date(pago.fecha_pago).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Método de Pago:</strong> {pago.metodo_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Estado de Pago:</strong> {pago.estado_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Estado de Membresía:</strong> {pago.cliente.estado_membresia}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AllPayForClient;
