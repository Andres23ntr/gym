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
  const imagenDisponible = 'ruta/a/tu/imagen/disponible.png'; // Cambia por la ruta de tu imagen de disponible

  useEffect(() => {
    const fetchCasilleros = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/casilleros');
        setCasilleros(response.data);
      } catch (error) {
        console.error('Error al cargar los casilleros:', error);
        toast.error('Hubo un problema al cargar los casilleros.'); // Muestra un toast de error
      } finally {
        setLoading(false);
      }
    };

    fetchCasilleros();
  }, []);

  const openModal = (casillero) => {
    setSelectedCasillero(casillero);
    setFechaAlquiler(new Date().toISOString().split('T')[0]); // Fecha actual por defecto
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

  const fetchCasilleros = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/casilleros');
      setCasilleros(response.data);
    } catch (error) {
      console.error('Error al cargar los casilleros:', error);
      toast.error('Hubo un problema al cargar los casilleros.'); // Muestra un toast de error
    }
  };

  const asignarCasillero = async () => {
    if (!idCliente || isNaN(idCliente)) {
      toast.error('El ID del cliente es obligatorio y debe ser un número válido.'); // Muestra un toast de error
      return;
    }

    setLoadingAsignacion(true);
    try {
      // Asignar casillero en la base de datos
      await axios.post('http://localhost:8000/api/historial-casilleros', {
        id_casillero: selectedCasillero.id_casillero,
        id_cliente: idCliente,
        fecha_alquiler: fechaAlquiler || new Date().toISOString().split('T')[0],
        fecha_devolucion: fechaDevolucion || null,
      });

      // Actualizar el estado del casillero a "Ocupado"
      await axios.put(`http://localhost:8000/api/casilleros/${selectedCasillero.id_casillero}`, {
        estado: 'Ocupado',
      });

      toast.success(`Casillero ${selectedCasillero.id_casillero} asignado al cliente ${idCliente}.`); // Muestra un toast de éxito

      // Actualizar el historial de casilleros después de la asignación
      setUpdateHistorial((prev) => !prev);

      // Recargar los casilleros
      await fetchCasilleros();

      // Redirigir a la ruta de locker y recargar la página
      navigate('/locker');
      window.location.reload();

      closeModal();
    } catch (error) {
      console.error('Error al asignar el casillero:', error);
      toast.error('Hubo un problema al asignar el casillero.'); // Muestra un toast de error
    } finally {
      setLoadingAsignacion(false);
    }
  };

  const verificarEstadoCasilleros = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/historial-casilleros');
      const historial = response.data;

      const casillerosSinAsignar = casilleros.filter((casillero) => {
        const asignado = historial.some(
          (registro) => registro.id_casillero === casillero.id_casillero
        );
        return !asignado && casillero.estado === 'Ocupado';
      });

      if (casillerosSinAsignar.length > 0) {
        await Promise.all(
          casillerosSinAsignar.map((casillero) =>
            axios.put(`http://localhost:8000/api/casilleros/${casillero.id_casillero}`, {
              estado: 'Disponible',
            })
          )
        );

        setCasilleros((prevCasilleros) =>
          prevCasilleros.map((casillero) =>
            casillerosSinAsignar.some((c) => c.id_casillero === casillero.id_casillero)
              ? { ...casillero, estado: 'Disponible' }
              : casillero
          )
        );
      } else {
        console.log('Todos los casilleros asignados están correctos.');
      }
    } catch (error) {
      console.error('Error al verificar el estado de los casilleros:', error.response || error);
      toast.error('Hubo un problema al verificar el estado de los casilleros.'); // Muestra un toast de error
    }
  };

  const throttledVerificarEstadoCasilleros = throttle(verificarEstadoCasilleros, 60000);

  useEffect(() => {
    throttledVerificarEstadoCasilleros();
  }, [casilleros]);

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
        onClick={() => openModal(casillero)} // Abre el modal al hacer clic
      >
        {casillero.estado === 'Disponible' ? `Casillero ${casillero.id_casillero}` : `Casillero ${casillero.id_casillero} - Ocupado`}
      </Button>
    </Col>
  ))}
</Row>


      {/* Modal de Asignación */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Casillero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID del Cliente</Form.Label>
              <Form.Control
               type="text" // Usamos 'text' para controlar los caracteres manualmente
               value={idCliente}
               onChange={(e) => {
                 // Solo permite que el valor sea numérico y no exceda los 9 caracteres
                 if (/^\d{0,9}$/.test(e.target.value)) {
                   setIdCliente(e.target.value);
                 }
               }}
               placeholder="Ingrese el ID del cliente"
               maxLength={9} // Restringe el campo a 9 caracteres
               onKeyPress={(e) => {
                 // Permitir solo números y la tecla 'backspace' para borrar
                 if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                   e.preventDefault(); // Evita la inserción de caracteres no numéricos
                 }
               }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Alquiler </Form.Label>
              <Form.Control
                type="date"
                value={fechaAlquiler}
                onChange={(e) => setFechaAlquiler(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Fecha de Devolución </Form.Label>
  <Form.Control
    type="date"
    value={fechaDevolucion}
    onChange={(e) => setFechaDevolucion(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // Fecha mínima: hoy
    max={`${new Date().getFullYear()}-12-31`} // Fecha máxima: 31 de diciembre del año actual
  />
</Form.Group>

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

      {/* Historial de Casilleros */}
      <HistorialCasilleros updateHistorial={updateHistorial} />
      <ToastContainer />
    </Container>
  );
};

export default GestionCasilleros;
