import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreatePago = () => {
  const [clienteId, setClienteId] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [estadoPago, setEstadoPago] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:8000/api/pagos', {
        cliente_id: clienteId,
        monto:monto,
        fecha_pago: fechaPago,
        metodo_pago: metodoPago,
        estado_pago: estadoPago,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/pagos'), 2000); // Redirigir a la lista de pagos después de 2 segundos
      }
    } catch (error) {
      console.error('Error al crear el pago:', error);
      setError('Hubo un problema al crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center">Crear Nuevo Pago</h2>
      <Form onSubmit={handleSubmit} className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Pago creado con éxito</Alert>}

        <Form.Group className="mb-3" controlId="clienteId">
          <Form.Label>ID Cliente</Form.Label>
          <Form.Control
            type="text"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            placeholder="Ingrese el ID del cliente"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="monto">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ingrese el monto del pago"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="fechaPago">
          <Form.Label>Fecha de Pago</Form.Label>
          <Form.Control
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="metodoPago">
          <Form.Label>Método de Pago</Form.Label>
          <Form.Control
            type="text"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            placeholder="Ingrese el método de pago"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="estadoPago">
          <Form.Label>Estado del Pago</Form.Label>
          <Form.Control
            type="text"
            value={estadoPago}
            onChange={(e) => setEstadoPago(e.target.value)}
            placeholder="Ingrese el estado del pago"
            required
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Crear Pago'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreatePago;
