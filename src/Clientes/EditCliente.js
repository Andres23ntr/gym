import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    estadoMembresia: '',
    fechaInscripcion: '',
    fechaVencimiento: '',
    idPromocion: '',
    idMembresia: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
  });
  const [membresias, setMembresias] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [clienteRes, membresiaRes, contactoRes, allMembresias, allPromociones] = await Promise.all([
          axios.get(`http://localhost:8000/api/clientes/${id}`, { headers }),
          axios.get(`http://localhost:8000/api/clientes-membresias/${id}`, { headers }),
          axios.get(`http://localhost:8000/api/contacto-clientes/${id}`, { headers }),
          axios.get('http://localhost:8000/api/membresias', { headers }),
          axios.get('http://localhost:8000/api/promociones', { headers }),
        ]);

        setFormData({
          nombreCompleto: clienteRes.data.nombre_completo,
          estadoMembresia: clienteRes.data.estado_membresia,
          fechaInscripcion: membresiaRes.data.fecha_inscripcion,
          fechaVencimiento: membresiaRes.data.fecha_vencimiento,
          idPromocion: membresiaRes.data.id_promocion || '',
          idMembresia: membresiaRes.data.id_membresia,
          direccion: contactoRes.data.direccion,
          telefono: contactoRes.data.telefono,
          correoElectronico: contactoRes.data.correo_electronico,
        });
        setMembresias(allMembresias.data);
        setPromociones(allPromociones.data);
      } catch (error) {
        toast.error('Error al cargar los datos.');
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

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : '', // Convierte a número o establece cadena vacía si no hay selección
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nombreCompleto', 'estadoMembresia', 'idMembresia'];
    const emptyField = requiredFields.find((field) => !formData[field]);
    if (emptyField) {
      toast.warning(`El campo ${emptyField} es obligatorio.`);
      return false;
    }
    return true;
  };

  const handleUpdateEntities = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await Promise.all([
        axios.put(`http://localhost:8000/api/clientes/${id}`, {
          nombre_completo: formData.nombreCompleto,
          estado_membresia: formData.estadoMembresia,
        }, { headers }),

        axios.put(`http://localhost:8000/api/clientes-membresias/${id}/${formData.idMembresia}`, {
          id_membresia: formData.idMembresia,
          fecha_inscripcion: formData.fechaInscripcion,
          fecha_vencimiento: formData.fechaVencimiento,
          id_promocion: formData.idPromocion || null,
        }, { headers }),

        axios.put(`http://localhost:8000/api/contacto-clientes/${id}`, {
          direccion: formData.direccion,
          telefono: formData.telefono,
          correo_electronico: formData.correoElectronico,
        }, { headers }),
      ]);

      toast.success('Datos actualizados con éxito.');
      navigate('/clientes');
    } catch (error) {
      toast.error('Error al actualizar los datos.');
    } finally {
      setLoading(false);
    }
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
      <ToastContainer />
      <h1>Editar Cliente</h1>
      <Form>
        {[
          { label: 'Nombre Completo', type: 'text', name: 'nombreCompleto' },
          { label: 'Dirección', type: 'text', name: 'direccion' },
          { label: 'Teléfono', type: 'text', name: 'telefono' },
          { label: 'Correo Electrónico', type: 'email', name: 'correoElectronico' },
          { label: 'Fecha Inscripción', type: 'date', name: 'fechaInscripcion' },
          { label: 'Fecha Vencimiento', type: 'date', name: 'fechaVencimiento' },
        ].map(({ label, type, name }) => (
          <Form.Group controlId={name} key={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type={type} name={name} value={formData[name] || ''} onChange={handleInputChange} />
          </Form.Group>
        ))}

        <Form.Group controlId="estadoMembresia">
          <Form.Label>Estado Membresía</Form.Label>
          <Form.Control as="select" name="estadoMembresia" value={formData.estadoMembresia} onChange={handleInputChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="idMembresia">
          <Form.Label>Membresía</Form.Label>
          <Form.Control as="select" name="idMembresia" value={formData.idMembresia} onChange={handleSelectChange}>
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
  <Form.Control as="select" name="idPromocion" value={formData.idPromocion} onChange={handleSelectChange}>
    <option value="">Sin promoción</option>
    {promociones.map((p) => (
      <option key={p.id} value={p.id}>
        {p.id} {/* Muestra solo el ID de la promoción */}
      </option>
    ))}
  </Form.Control>
</Form.Group>


        <Button variant="primary" onClick={handleUpdateEntities} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditClient;
