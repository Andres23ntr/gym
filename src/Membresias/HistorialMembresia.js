import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const HistorialMembresiaForm = () => {
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_membresia: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_promocion: '',
  });

  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('http://localhost:8000/api/clientes');
        const membresiasResponse = await axios.get('http://localhost:8000/api/membresias');
        const promocionesResponse = await axios.get('http://localhost:8000/api/promociones');

        setClientes(clientesResponse.data);
        setMembresias(membresiasResponse.data);
        setPromociones(promocionesResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id_cliente: parseInt(formData.id_cliente),
      id_membresia: parseInt(formData.id_membresia),
      fecha_inscripcion: formData.fecha_inicio,
      fecha_vencimiento: formData.fecha_fin,
      id_promocion: formData.id_promocion ? parseInt(formData.id_promocion) : null
    };

    try {
      const response = await axios.post('http://localhost:8000/api/Renovar', data);
      toast.success('Membresía renovada exitosamente');
      setFormData({
        id_cliente: '',
        id_membresia: '',
        fecha_inicio: '',
        fecha_fin: '',
        id_promocion: '',
      });
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'No se pudo renovar la membresía'}`);
      } else {
        toast.error('Error al renovar la membresía');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
      <button type="submit" className="btn btn-primary">
        Renovar Membresía
      </button>
    </form>
  );
};

export default HistorialMembresiaForm;
