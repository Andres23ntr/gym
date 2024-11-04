import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';

const ShowPago = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
  
    const fetchPagos = async () => {
      try {
        
        const response = await axios.get('http://localhost:8000/api/pagos');
        setPagos(response.data); // Asume que response.data es una lista de pagos
      } catch (error) {
        console.error('Error al cargar los pagos:', error);
        setError('Hubo un problema al cargar los pagos.');
      } finally {
        setLoading(false);
      }
    };
   
    fetchPagos();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando pagos...</p>
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
      <h2 className="text-center">Listado de Pagos</h2>

       {/* Botón para crear un nuevo pago */}
       <div className="text-left mb-4">
        <Link to="/createPago" className="btn btn-success">Crear Nuevo Pago</Link>
      </div>
      <Row>
        {pagos.length === 0 ? (
          <p className="text-center">No hay pagos registrados.</p>
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
                  <strong>Fecha de Pago:</strong> {pago.fecha_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Método de Pago:</strong> {pago.metodo_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Estado:</strong> {pago.estado_pago}
                </ListGroup.Item>
                <ListGroup.Item className="text-center">
                <Link to={`/allPay/${pago.id_pago}`} className="btn btn-secondaryS m-1">
                    Ver
                  </Link>
                  <Link to={`/EditPagos/${pago.id_pago}`} className="btn btn-primary m-1">
                    Editar
                  </Link>
                  <Button variant="danger" className="m-1">
                    Eliminar
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ShowPago;
