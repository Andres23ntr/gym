import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spinner, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import HistorialCasilleros from './HistorialCasilleros';
import throttle from 'lodash/throttle';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GestionCasilleros = () => {
  const [casilleros, setCasilleros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCasillero, setSelectedCasillero] = useState(null);
  const [idCliente, setIdCliente] = useState('');
  const [fechaAlquiler, setFechaAlquiler] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [loadingAsignacion, setLoadingAsignacion] = useState(false);
  const [updateHistorial, setUpdateHistorial] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchCasilleros = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/casilleros', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCasilleros(response.data);
      } catch (error) {
        console.error('Error al cargar los casilleros:', error);
        toast.error('Hubo un problema al cargar los casilleros.');
      } finally {
        setLoading(false);
      }
    };

    fetchCasilleros();
  }, [navigate, token]);

  const openModal = (casillero) => {
    setSelectedCasillero(casillero);
    const today = new Date().toISOString().split('T')[0];
    setFechaAlquiler(today);
    setFechaDevolucion('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCasillero(null);
    setIdCliente('');
    setFechaAlquiler('');
    setFechaDevolucion('');
  };

  const agregarMeses = (meses) => {
    const fechaActual = new Date();
    const nuevaFecha = new Date(fechaActual.setMonth(fechaActual.getMonth() + meses));
    setFechaDevolucion(nuevaFecha.toISOString().split('T')[0]);
  };

  const asignarCasillero = async () => {
    if (!idCliente || isNaN(idCliente)) {
      toast.error('El ID del cliente es obligatorio y debe ser un número válido.');
      return;
    }

    if (!fechaDevolucion) {
      toast.error('Debe seleccionar una fecha de devolución.');
      return;
    }

    setLoadingAsignacion(true);
    try {
      await axios.post(
        'http://localhost:8000/api/historial-casilleros',
        {
          id_casillero: selectedCasillero.id_casillero,
          id_cliente: idCliente,
          fecha_alquiler: fechaAlquiler,
          fecha_devolucion: fechaDevolucion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.put(
        `http://localhost:8000/api/casilleros/${selectedCasillero.id_casillero}`,
        {
          estado: 'Ocupado',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Casillero ${selectedCasillero.id_casillero} asignado correctamente.`);
      setUpdateHistorial((prev) => !prev);
      closeModal();
    } catch (error) {
      console.error('Error al asignar el casillero:', error);
      toast.error('Hubo un problema al asignar el casillero.');
    } finally {
      setLoadingAsignacion(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando casilleros...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Gestión de Casilleros</h2>
      <Row>
        {casilleros.map((casillero) => (
          <Col key={casillero.id_casillero} xs={4} className="mb-3">
            <Button
              variant={casillero.estado === 'Disponible' ? 'success' : 'danger'}
              className="w-100 mb-2"
              disabled={casillero.estado === 'Ocupado'}
              onClick={() => openModal(casillero)}
            >
              {casillero.estado === 'Disponible'
                ? `Casillero ${casillero.id_casillero}`
                : `Casillero ${casillero.id_casillero} - Ocupado`}
            </Button>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Casillero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID del Cliente</Form.Label>
              <Form.Control
                type="text"
                value={idCliente}
                onChange={(e) => {
                  if (/^\d{0,9}$/.test(e.target.value)) {
                    setIdCliente(e.target.value);
                  }
                }}
                placeholder="Ingrese el ID del cliente"
                maxLength={9}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Alquiler</Form.Label>
              <Form.Control type="date" value={fechaAlquiler} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Devolución</Form.Label>
              <Form.Control type="date" value={fechaDevolucion} readOnly />
            </Form.Group>
            <div className="d-flex justify-content-between">
              {[1, 2, 3, 4, 5, 6].map((mes) => (
                <Button
                  key={mes}
                  variant="outline-primary"
                  onClick={() => agregarMeses(mes)}
                >
                  {mes} Mes{mes > 1 ? 'es' : ''}
                </Button>
              ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={asignarCasillero} disabled={loadingAsignacion}>
            {loadingAsignacion ? <Spinner as="span" animation="border" size="sm" /> : 'Asignar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <HistorialCasilleros updateHistorial={updateHistorial} />
      <ToastContainer />
    </Container>
  );
};

export default GestionCasilleros;
