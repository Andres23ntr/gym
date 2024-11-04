import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // useParams para obtener el id

const EditEmpleado = () => {
  const { id } = useParams(); // Obtener el ID del empleado desde los parámetros de la ruta
  const navigate = useNavigate(); // Hook para redirigir
  const [loading, setLoading] = useState(false); // Control de carga
  const [empleado, setEmpleado] = useState({
    nombre_completo: '',
    cargo: '',
    fecha_contratacion: '',
    salario: '',
  });

  useEffect(() => {
    const fetchEmpleado = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/empleados/${id}`);
        const empleadoData = response.data;
        
        // Extraer solo la parte de la fecha (yyyy-MM-dd)
        const fechaFormateada = empleadoData.fecha_contratacion.split('T')[0]; // Obtener la fecha en formato yyyy-MM-dd
        
        setEmpleado({
          ...empleadoData,
          fecha_contratacion: fechaFormateada, // Asignar la fecha con el formato correcto
        });
      } catch (error) {
        console.error('Error al obtener los datos del empleado:', error);
        alert('Hubo un problema al cargar los datos del empleado.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [id]);

  const handleEditEmpleado = async () => {
    if (!empleado.nombre_completo || !empleado.cargo) {
      alert('El nombre completo y el cargo son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/api/empleados/${id}`, empleado);
      alert('Empleado actualizado con éxito');
      navigate('/ShowUser'); // Redirigir a la lista de empleados
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      alert('Hubo un problema al actualizar el empleado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Editar Empleado</h2>
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          className="form-control"
          value={empleado.nombre_completo}
          onChange={(e) => setEmpleado({ ...empleado, nombre_completo: e.target.value })}
          disabled={loading}
          placeholder="Nombre Completo"
        />
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <input
          type="text"
          className="form-control"
          value={empleado.cargo}
          onChange={(e) => setEmpleado({ ...empleado, cargo: e.target.value })}
          disabled={loading}
          placeholder="Cargo"
        />
      </div>
      <div className="form-group">
        <label>Fecha de Contratación (YYYY-MM-DD)</label>
        <input
          type="date"
          className="form-control"
          value={empleado.fecha_contratacion}
          onChange={(e) => setEmpleado({ ...empleado, fecha_contratacion: e.target.value })}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Salario</label>
        <input
          type="number"
          className="form-control"
          value={empleado.salario}
          onChange={(e) => setEmpleado({ ...empleado, salario: e.target.value })}
          disabled={loading}
          placeholder="Salario"
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleEditEmpleado}
        disabled={loading}
      >
        {loading ? 'Actualizando...' : 'Actualizar Empleado'}
      </button>
    </div>
  );
};

export default EditEmpleado;
