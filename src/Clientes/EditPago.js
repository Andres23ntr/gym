import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';

const EditPago = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fechaPago, setFechaPago] = useState(null);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [estadoPago, setEstadoPago] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // Para indicar que se está cargando el pago

  useEffect(() => {
    const fetchPago = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/pagos/${id}`);
        const pago = response.data;
        setFechaPago(new Date(pago.fecha_pago));
        setMonto(pago.monto);
        setMetodoPago(pago.metodo_pago);
        setEstadoPago(pago.estado_pago);
      } catch (error) {
        console.error('Error al cargar el pago:', error);
        setError('Hubo un problema al cargar el pago.');
      } finally {
        setLoadingData(false); // Termina de cargar
      }
    };

    fetchPago();
  }, [id]);

  const handleUpdate = async () => {
    if (!monto || !metodoPago || !estadoPago || !fechaPago) {
      setError('Todos los campos de pago son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const updatedPago = {
        fecha_pago: fechaPago.toISOString().split('T')[0],
        monto: parseFloat(monto),
        metodo_pago: metodoPago,
        estado_pago: estadoPago,
      };

      await axios.put(`http://localhost:8000/api/pagos/${id}`, updatedPago);
      alert('Pago actualizado con éxito.');
      navigate(-1); // Regresa a la pantalla anterior
    } catch (error) {
      console.error('Error al actualizar el pago:', error);
      setError('Hubo un problema al actualizar el pago.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando datos del pago...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Editar Pago</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-3">
        <label>Fecha de Pago:</label>
        <DatePicker
          selected={fechaPago}
          onChange={(date) => setFechaPago(date)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Monto:</label>
        <Form.Control
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
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

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar Pago'}
      </Button>
    </div>
  );
};

export default EditPago;
