import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Button, Spinner, Alert, Container, Row, Col, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowPago = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagoIdToDelete, setPagoIdToDelete] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizaciones en componentes desmontados

    if (!token) {
      navigate('/');
      return;
    }

    const fetchPagos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pagos', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const uniquePagos = Object.values(
          response.data.reduce((acc, pago) => {
            // Solo guardar un pago por cada id_cliente
            if (!acc[pago.id_cliente]) {
              acc[pago.id_cliente] = pago;
            }
            return acc;
          }, {})
        );

        if (isMounted) setPagos(uniquePagos);
      } catch (error) {
        if (isMounted) {
          if (error.response && error.response.status === 401) {
            setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            navigate('/');
          } else {
            console.error('Error al cargar los pagos:', error);
            setError('Hubo un problema al cargar los pagos.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPagos();

    return () => {
      isMounted = false; // Limpieza del efecto
    };
  }, [navigate, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/pagos/${pagoIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPagos(pagos.filter((pago) => pago.id_pago !== pagoIdToDelete));
      toast.success('Pago eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el pago:', error);
      setError('Hubo un problema al eliminar el pago.');
      toast.error('Hubo un problema al eliminar el pago.');
    } finally {
      setShowModal(false);
    }
  };

  const handleShowModal = (id_pago) => {
    setPagoIdToDelete(id_pago);
    setShowModal(true);
  };

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
                  <strong>ID Cliente:</strong> {pago.id_cliente}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Cliente:</strong> {pago.cliente.nombre_completo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Monto:</strong> ${parseFloat(pago.monto).toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Fecha de Pago:</strong> {pago.fecha_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Método de Pago:</strong> {pago.metodo_pago}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Detalle:</strong> {pago.detalle}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Estado de Membresía:</strong> {pago.cliente.estado_membresia}
                </ListGroup.Item>
                <ListGroup.Item className="text-center">
                  <Link to={`/HistorialPag/${pago.id_cliente}`} className="btn btn-secondary m-1">
                    Ver
                  </Link>
                  <Button
                    variant="danger"
                    className="m-1"
                    onClick={() => handleShowModal(pago.id_pago)}
                  >
                    Eliminar
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este pago?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default ShowPago;
