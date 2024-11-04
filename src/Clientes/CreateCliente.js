import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateEntities.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateEntities = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    estadoMembresia: '',
    ci: '',
    idMembresia: '',
    fechaInscripcion: '',
    fechaVencimiento: '',
    idPromocion: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
  });

  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [membresias, setMembresias] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validar campo CI para solo permitir números y longitud máxima de 9
    if (name === 'ci' && (isNaN(value) || value.length > 9)) {
      return;
    }

    if (name === 'nombreCompleto' && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchMembresias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/membresias');
        setMembresias(response.data);
      } catch (error) {
        console.error('Error al obtener las membresías', error);
        toast.error('Error al obtener las membresías');
      }
    };

    const fetchPromociones = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/promociones');
        setPromociones(response.data);
      } catch (error) {
        console.error('Error al obtener las promociones', error);
        toast.error('Error al obtener las promociones');
      }
    };

    fetchMembresias();
    fetchPromociones();

    // Set default fechaInscripcion to today
    const today = new Date().toISOString().split('T')[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      fechaInscripcion: today,
    }));
  }, []);

  // Función para formatear fecha en formato DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1; // Meses van de 0 a 11
    const year = d.getFullYear();

    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    return `${day}/${month}/${year}`;
  };

  const handleCreateEntities = async () => {
    const { ci, nombreCompleto, idMembresia } = formData;

    if (!ci || !nombreCompleto || idMembresia === '') {
      toast.warn('CI, Nombre Completo y ID Membresía son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const clienteData = {
        id_cliente: ci,
        nombre_completo: nombreCompleto,
        estado_membresia: formData.estadoMembresia,
      };

      const clienteResponse = await axios.post('http://localhost:8000/api/clientes', clienteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const clienteCreado = clienteResponse.data;
      setIdCliente(clienteCreado.id);

      const membresiaData = {
        id_cliente: clienteData.id_cliente,
        id_membresia: idMembresia,
        fecha_inscripcion: formData.fechaInscripcion || null,
        fecha_vencimiento: formData.fechaVencimiento || null,
        id_promocion: formData.idPromocion || null,
      };

      await axios.post('http://localhost:8000/api/clientes-membresias', membresiaData);

      const contactoData = {
        id_cliente: clienteData.id_cliente,
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        correo_electronico: formData.correoElectronico || null,
      };
      await axios.post('http://localhost:8000/api/contacto-clientes', contactoData);

      toast.success('Cliente, Membresía y Contacto creados con éxito');
      navigate('/pago', { state: { idCliente: clienteData.id_cliente } });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un problema al crear las entidades.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMembresiaChange = (e) => {
    const selectedMembresia = e.target.value;
    const today = new Date();
    let nuevaFechaVencimiento = new Date(today);

    // Ajustar la fecha de vencimiento según el tipo de membresía
    if (selectedMembresia === 'mensual') {
      nuevaFechaVencimiento.setMonth(nuevaFechaVencimiento.getMonth() +2);
    } else if (selectedMembresia === 'anual') {
      nuevaFechaVencimiento.setFullYear(nuevaFechaVencimiento.getFullYear() + 1);
    }

    const fechaFormateada = formatDate(nuevaFechaVencimiento); // Formatear fecha a DD/MM/YYYY

    setFormData({
      ...formData,
      idMembresia: selectedMembresia,
      fechaVencimiento: fechaFormateada, // Asignar la fecha formateada
    });
  };

  return (
    <div className="form-container">
      <h2>Crear Cliente</h2>
      <input
        type="text"
        className="form-input"
        name="ci"
        value={formData.ci}
        onChange={handleInputChange}
        placeholder="CI"
        maxLength="9"
      />
      <input
        type="text"
        className="form-input"
        name="nombreCompleto"
        value={formData.nombreCompleto}
        onChange={handleInputChange}
        placeholder="Nombre Completo"
      />

      <label className="form-label">Estado Membresía:</label>
      <select
        name="estadoMembresia"
        className="form-control"
        value={formData.estadoMembresia}
        onChange={(e) => setFormData({ ...formData, estadoMembresia: e.target.value })}
      >
        <option value="">Seleccione el estado</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      {idCliente && <div className="form-success">ID Cliente Creado: {idCliente}</div>}

      <h2>Membresía</h2>
      <label className="form-label">Membresía:</label>
      <select
        className="form-input"
        name="idMembresia"
        value={formData.idMembresia}
        onChange={(e) => {
          const selectedMembresia = e.target.value;
          setFormData({ ...formData, idMembresia: selectedMembresia });
          handleMembresiaChange(e); // Llamamos a la función para ajustar la fecha de vencimiento
        }}
      >
        <option value="">Seleccione una Membresía</option>
        {membresias.map(({ id_membresia, tipo_membresia, descripcion }) => (
          <option key={id_membresia} value={id_membresia}>
            {tipo_membresia} - {descripcion}
          </option>
        ))}
      </select>

      <label className="form-label">Fecha Inscripción:</label>
      <input
        type="date"
        name="inscripcion"
        className="form-control"
        value={formData.fechaInscripcion}
        onChange={(e) => setFormData({ ...formData, fechaInscripcion: e.target.value })}
        min={new Date().toISOString().split('T')[0]}
        max={new Date().toISOString().split('T')[0]}
      />

      <label className="form-label">Fecha Vencimiento:</label>
      <input
        type="text"
        name="vencimiento"
        className="form-control"
        value={formData.fechaVencimiento || ''}
        readOnly
      />

      <h2>Promoción</h2>
      <select
        className="form-input"
        name="idPromocion"
        value={formData.idPromocion}
        onChange={(e) => setFormData({ ...formData, idPromocion: parseInt(e.target.value, 10) || null })}
      >
        <option value="">Seleccione una promoción</option>
        {promociones.map(({ id, descripcion, descuento, fecha_fin }) => (
          <option key={id} value={id}>
            {descripcion} - {descuento}% (Válido hasta: {fecha_fin})
          </option>
        ))}
      </select>

      <h2>Contacto Cliente</h2>
      <input
        type="text"
        className="form-input"
        name="direccion"
        value={formData.direccion}
        onChange={handleInputChange}
        placeholder="Dirección"
      />
      <input
        type="tel"
        className="form-input"
        name="telefono"
        value={formData.telefono}
        onChange={handleInputChange}
        placeholder="Teléfono"
        maxLength="10"
      />
      <input
        type="email"
        className="form-input"
        name="correoElectronico"
        value={formData.correoElectronico}
        onChange={handleInputChange}
        placeholder="Correo Electrónico"
      />

      <button
        className="btn btn-primary w-100"
        type="submit"
        onClick={handleCreateEntities}
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear'}
      </button>

      <ToastContainer />
    </div>
  );
};

export default CreateEntities;
