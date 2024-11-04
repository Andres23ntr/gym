import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Container } from 'react-bootstrap';

const EditClient = () => {
  const { id } = useParams(); // Obtener ID del cliente de la URL
  const navigate = useNavigate(); // Para redirección

  // Estados para el formulario y los datos
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

  const token = localStorage.getItem('token'); // Suponiendo que el token se guarda en localStorage

  // Cargar datos del cliente, membresías y promociones al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clienteRes, membresiaRes, contactoRes, allMembresias, allPromociones] = await Promise.all([
          axios.get(`http://localhost:8000/api/clientes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`http://localhost:8000/api/clientes-membresias/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`http://localhost:8000/api/contacto-clientes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:8000/api/membresias', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:8000/api/promociones', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const cliente = clienteRes.data;
        const membresia = membresiaRes.data;
        const contacto = contactoRes.data;

        setFormData({
          nombreCompleto: cliente.nombre_completo,
          estadoMembresia: cliente.estado_membresia,
          fechaInscripcion: membresia.fecha_inscripcion,
          fechaVencimiento: membresia.fecha_vencimiento,
          idPromocion: membresia.id_promocion || '',
          idMembresia: membresia.id_membresia,
          direccion: contacto.direccion,
          telefono: contacto.telefono,
          correoElectronico: contacto.correo_electronico,
        });

        setMembresias(allMembresias.data);
        setPromociones(allPromociones.data);
      } catch (error) {
        alert('Error al cargar los datos.');
        console.error(error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id, token]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizar entidades en la API
  const handleUpdateEntities = async () => {
    const { nombreCompleto, estadoMembresia, idMembresia } = formData;

    if (!nombreCompleto || !estadoMembresia || !idMembresia) {
      alert('Nombre, Estado y Membresía son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const clienteData = {
        nombre_completo: nombreCompleto,
        estado_membresia: estadoMembresia,
      };
      await axios.put(`http://localhost:8000/api/clientes/${id}`, clienteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const membresiaData = {
        id_membresia: idMembresia,
        fecha_inscripcion: formData.fechaInscripcion,
        fecha_vencimiento: formData.fechaVencimiento,
        id_promocion: formData.idPromocion || null,
      };
      await axios.put(`http://localhost:8000/api/clientes-membresias/${id}/${idMembresia}`, membresiaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contactoData = {
        direccion: formData.direccion,
        telefono: formData.telefono,
        correo_electronico: formData.correoElectronico,
      };
      await axios.put(`http://localhost:8000/api/contacto-clientes/${id}`, contactoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Datos actualizados con éxito.');
      navigate('/clientes');
    } catch (error) {
      alert('Error al actualizar los datos.');
      console.error(error);
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
      <h1>Editar Cliente</h1>
      <Form>
        <Form.Group controlId="nombreCompleto">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="estadoMembresia">
          <Form.Label>Estado Membresía</Form.Label>
          <Form.Control
            as="select"
            name="estadoMembresia"
            value={formData.estadoMembresia}
            onChange={handleInputChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Form.Control>
        </Form.Group>

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

        <Form.Group controlId="fechaInscripcion">
          <Form.Label>Fecha Inscripción</Form.Label>
          <Form.Control
            type="date"
            name="fechaInscripcion"
            value={formData.fechaInscripcion}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="fechaVencimiento">
          <Form.Label>Fecha Vencimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaVencimiento"
            value={formData.fechaVencimiento}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="direccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="telefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdateEntities} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditClient;
