import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Vencimientos = () => {
  const [vencimientos, setVencimientos] = useState([]);
  const [vencimientosFuturos, setVencimientosFuturos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchVencimientos = async () => {
    try {
      setLoading(true); // Establece el estado de carga antes de la solicitud

      const [vencidosRes, futurosRes] = await Promise.all([
        axios.get('http://localhost:8000/api/MembresiasVencidas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:8000/api/VencimientosProximos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const vencidosData = Array.isArray(vencidosRes.data) ? vencidosRes.data : [];
      const futurosData = Array.isArray(futurosRes.data) ? futurosRes.data : [];

      setVencimientos(vencidosData);
      setVencimientosFuturos(futurosData);

      // Mostrar notificaciones basadas en los datos obtenidos
      displayNotifications(vencidosData.length, futurosData.length);
    } catch (error) {
      console.error('Error al cargar los vencimientos:', error);

      if (error.response && error.response.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/');
      } else {
        setError('Hubo un problema al cargar los vencimientos.');
        toast.error('Error al cargar los vencimientos.', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const displayNotifications = (vencidosCount, futurosCount) => {
    if (vencidosCount > 0) {
      toast.error(`Hay ${vencidosCount} membresías que ya vencieron.`, {
        position: 'top-right',
        autoClose: 5000,
      });
    }

    if (futurosCount > 0) {
      toast.warn(`Hay ${futurosCount} membresías próximas a vencer.`, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizaciones en componentes desmontados

    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      if (isMounted) await fetchVencimientos();
    };

    fetchData();

    return () => {
      isMounted = false; // Limpieza del efecto
    };
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando vencimientos...</p>
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
      <h2 className="text-center">Membresías Vencidas y Próximas a Vencer</h2>
      <Row className="mt-4">
        {/* Sección de Membresías Vencidas */}
        <Col md={6}>
          <h3>Membresías Vencidas</h3>
          {vencimientos.length === 0 ? (
            <p className="text-center">No hay membresías vencidas.</p>
          ) : (
            vencimientos.map((vencimiento) => (
              <Card key={vencimiento.id_cliente} className="mb-3">
                <Card.Body>
                  <Card.Title>ID Cliente: {vencimiento.id_cliente}</Card.Title>
                  <Card.Text>Fecha de Inscripción: {vencimiento.fecha_inscripcion}</Card.Text>
                  <Card.Text>Fecha de Vencimiento: {vencimiento.fecha_vencimiento}</Card.Text>
                  <Card.Text>Membresía: {vencimiento.id_membresia}</Card.Text>
                  <Card.Text>Promoción: {vencimiento.id_promocion || 'N/A'}</Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* Sección de Membresías Próximas a Vencer */}
        <Col md={6}>
          <h3>Membresías Próximas a Vencer</h3>
          {vencimientosFuturos.length === 0 ? (
            <p className="text-center">No hay membresías próximas a vencer.</p>
          ) : (
            vencimientosFuturos.map((vencimiento) => (
              <Card key={vencimiento.id_cliente} className="mb-3">
                <Card.Body>
                  <Card.Title>ID Cliente: {vencimiento.id_cliente}</Card.Title>
                  <Card.Text>Fecha de Inscripción: {vencimiento.fecha_inscripcion}</Card.Text>
                  <Card.Text>Fecha de Vencimiento: {vencimiento.fecha_vencimiento}</Card.Text>
                  <Card.Text>Membresía: {vencimiento.id_membresia}</Card.Text>
                  <Card.Text>Promoción: {vencimiento.id_promocion || 'N/A'}</Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Vencimientos;
