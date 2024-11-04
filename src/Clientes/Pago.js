import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { idCliente } = location.state; // Obtener el idCliente desde los parámetros de navegación
  const [fechaPago, setFechaPago] = useState(''); // Inicializado como string
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo'); // Valor por defecto
  const [estadoPago, setEstadoPago] = useState('Pagado'); // Valor por defecto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Establecer la fecha de pago como el día actual
    const today = new Date().toISOString().split('T')[0];
    setFechaPago(today);
  }, []);

  const handlePago = async () => {
    if (!monto || !metodoPago || !estadoPago || !fechaPago) {
      setError('Todos los campos de pago son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const pagoData = {
        id_cliente: idCliente,
        fecha_pago: fechaPago, // La fecha se envía como string
        monto: parseFloat(monto),
        metodo_pago: metodoPago,
        estado_pago: estadoPago,
      };

      await axios.post('http://localhost:8000/api/pagos', pagoData);
      alert('Pago creado con éxito');
      navigate(-1); // Redirige a la pantalla anterior
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Hubo un problema al crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Crear Pago</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar el idCliente en la pantalla */}
      <p>ID Cliente: {idCliente}</p>

      <div className="mb-3">
        <label>Fecha de Pago:</label>
        <input
          type="date"
          className="form-control"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
          required
          disabled // Desactivar el campo
        />
      </div>

      <div className="mb-3">
        <label>Monto:</label>
        <Form.Control
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
          required
        />
      </div>

      <div className="mb-3">
        <label>Método de Pago:</label>
        <Form.Control
          type="text"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          placeholder="Método de Pago"
        />
      </div>

      <div className="mb-3">
        <label>Estado del Pago:</label>
        <Form.Control
          type="text"
          value={estadoPago}
          onChange={(e) => setEstadoPago(e.target.value)}
          placeholder="Estado del Pago"
        />
      </div>

      <Button onClick={handlePago} disabled={loading}>
        {loading ? 'Creando...' : 'Crear Pago'}
      </Button>
    </div>
  );
};

export default Pago;
