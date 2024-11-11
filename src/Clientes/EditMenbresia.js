import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClienteMembresia = ({ token }) => {
  const { id } = useParams(); // ID del cliente
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCliente: id,
    idMembresia: '',
    idPromocion: '',
    fechaInscripcion: '',
    fechaVencimiento: '',
  });
  const [membresias, setMembresias] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clienteMembresiaRes, allMembresias, allPromociones] = await Promise.all([
          axios.get(`http://localhost:8000/api/clientes-membresias/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/api/membresias', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/api/promociones', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clienteMembresia = clienteMembresiaRes.data;

        setFormData((prev) => ({
          ...prev,
          idMembresia: clienteMembresia.id_membresia,
          idPromocion: clienteMembresia.id_promocion || '',
          fechaInscripcion: clienteMembresia.fecha_inscripcion,
          fechaVencimiento: clienteMembresia.fecha_vencimiento,
        }));

        setMembresias(allMembresias.data);
        setPromociones(allPromociones.data);
      } catch (error) {
        setError('Error al cargar los datos de membresía.');
        console.error(error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e, field) => {
    const isValid = (dateString) => {
      const today = new Date();
      const selectedDate = new Date(dateString);
      return selectedDate >= today; // Validar que la fecha seleccionada no sea anterior a hoy
    };

    if (isValid(e.target.value)) {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    // Validaciones
    if (!formData.idMembresia) {
      toast.error('La Membresía es obligatoria.');
      return;
    }
    if (!formData.fechaInscripcion) {
      toast.error('La Fecha de Inscripción es obligatoria.');
      return;
    }
    if (!formData.fechaVencimiento) {
      toast.error('La Fecha de Vencimiento es obligatoria.');
      return;
    }
    if (new Date(formData.fechaVencimiento) <= new Date(formData.fechaInscripcion)) {
      toast.error('La Fecha de Vencimiento debe ser posterior a la Fecha de Inscripción.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/Renovar`, {
        id_cliente: formData.idCliente,
        id_membresia: formData.idMembresia,
        fecha_inscripcion: formData.fechaInscripcion,
        fecha_vencimiento: formData.fechaVencimiento,
        id_promocion: formData.idPromocion || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Datos de membresía actualizados con éxito.');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al actualizar los datos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Obtén la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Función para agregar meses a la fecha de vencimiento
  const addMonthsToDate = (months) => {
    const vencimientoDate = new Date(formData.fechaVencimiento);
    vencimientoDate.setMonth(vencimientoDate.getMonth() + months);
    setFormData((prev) => ({
      ...prev,
      fechaVencimiento: vencimientoDate.toISOString().split('T')[0],
    }));
  };

  if (isLoadingData) {
    return (
      <Container className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando datos...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Renovar Membresía</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="idMembresia">
          <Form.Label>Membresía</Form.Label>
          <Form.Control
            as="select"
            name="idMembresia"
            value={formData.idMembresia}
            onChange={handleInputChange}
          >
            <option value="">Seleccione una Membresía</option>
            {membresias.map((m) => (
              <option key={m.id_membresia} value={m.id_membresia}>
                {m.tipo_membresia} - {m.descripcion}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="idPromocion">
          <Form.Label>Promoción</Form.Label>
          <Form.Control
            as="select"
            name="idPromocion"
            value={formData.idPromocion}
            onChange={handleInputChange}
          >
            <option value="">Sin promoción</option>
            {promociones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.descripcion} - {p.descuento}%
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {[ 
          { label: 'Fecha Inscripción', name: 'fechaInscripcion' }, 
          { label: 'Fecha Vencimiento', name: 'fechaVencimiento' }
        ].map((input) => (
          <div className="mb-3" key={input.name}>
            <label className="form-label">{input.label}</label>
            <input 
              type="date" 
              className="form-control" 
              name={input.name} 
              value={formData[input.name]} 
              onChange={(e) => handleDateChange(e, input.name)} 
              min={today} // Establecer la fecha mínima
              required 
            />
          </div>
        ))}

        {/* Botones para agregar meses a la fecha de vencimiento */}
        <div className="mb-3">
          <label className="form-label">Agregar meses a la fecha de vencimiento:</label>
          <div>
            {[1, 2, 3, 4, 5, 6].map((months) => (
              <Button
                key={months}
                variant="secondary"
                onClick={() => addMonthsToDate(months)}
                className="me-2"
              >
                {months} Mes{months > 1 ? 'es' : ''}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => addMonthsToDate(12)} // 12 meses para un año
            >
              1 Año
            </Button>
          </div>
        </div>

        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Actualizar'}
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default ClienteMembresia;
