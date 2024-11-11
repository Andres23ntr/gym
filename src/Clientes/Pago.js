import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Pago.css';

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { idCliente } = location.state;

  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [detalle, setDetalle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaPago(today);
  }, []);

  const handleMontoChange = (e) => {
    const value = e.target.value;

    // Verifica que sea un número válido, hasta 6 dígitos, y mayor o igual a 50
    if (/^\d*$/.test(value) && value.length <= 6) {
      setMonto(value);
      setErrors((prevErrors) => ({ ...prevErrors, monto: '' })); // Limpia errores
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        monto: 'El monto debe ser un número válido de hasta 6 dígitos.',
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!monto || parseInt(monto, 10) < 50) {
      newErrors.monto = 'El monto debe ser mayor o igual a 50.';
    }
    if (!detalle) {
      newErrors.detalle = 'Debe seleccionar un detalle.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePago = async () => {
    if (!validateFields()) {
      toast.error('Por favor, complete correctamente todos los campos antes de enviar.');
      return;
    }

    setLoading(true);
    try {
      const pagoData = {
        id_cliente: idCliente,
        fecha_pago: fechaPago,
        monto: parseFloat(monto),
        metodo_pago: metodoPago,
        detalle,
      };

      await axios.post('http://localhost:8000/api/pagos', pagoData);
      toast.success('Pago creado con éxito', {
        onClose: () => navigate('/Clientes', { state: { newClient: true } }),
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Hubo un problema al crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pago-container">
      <h2>Crear Pago</h2>

      <div className="mb-3">
        <label>Ci Cliente: {idCliente}</label>
      </div>

      <div className="mb-3">
        <label>Fecha de Pago:</label>
        <input type="date" className="form-control" value={fechaPago} disabled />
      </div>

      <div className="mb-3">
        <label>Monto:</label>
        <Form.Control
          type="text"
          value={monto}
          onChange={handleMontoChange}
          className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
          placeholder="Monto"
          required
        />
        {errors.monto && <div className="invalid-feedback">{errors.monto}</div>}
      </div>

      <div className="mb-3">
        <label>Método de Pago:</label>
        <Form.Select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          required
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="QR">QR</option>
        </Form.Select>
      </div>

      <div className="mb-3">
        <label>Detalle</label>
        <Form.Select
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          className={`form-control ${errors.detalle ? 'is-invalid' : ''}`}
          required
        >
          <option value="" disabled>
            Seleccione un detalle
          </option>
          <option value="Alquiler Casillero">Alquiler Casillero</option>
          <option value="Membresia">Membresía</option>
          <option value="Renovacion Membresia">Renovación Membresía</option>
          <option value="Renovacion Casillero">Renovación Casillero</option>
        </Form.Select>
        {errors.detalle && <div className="invalid-feedback">{errors.detalle}</div>}
      </div>

      <Button onClick={handlePago} disabled={loading}>
        {loading ? 'Creando...' : 'Crear Pago'}
      </Button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Pago;
