import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // En lugar de history

const CreateEmpleado = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaContratacion, setFechaContratacion] = useState('');
  const [salario, setSalario] = useState('');
  const [loading, setLoading] = useState(false); // Controlar el estado de carga

  const navigate = useNavigate(); // Nuevo hook de React Router

  const handleCreateEmpleado = async () => {
    if (!nombreCompleto || !cargo) {
      alert('Nombre completo y cargo son obligatorios.');
      return;
    }

    try {
      setLoading(true); // Activar loading

      const empleadoData = {
        nombre_completo: nombreCompleto,
        cargo: cargo,
        fecha_contratacion: fechaContratacion,
        salario: salario,
      };

      await axios.post('http://localhost:8000/api/empleados', empleadoData);

      alert('Empleado creado con éxito');
      limpiarFormulario(); // Limpiar campos tras el envío
      navigate('/ShowUser'); // Redirigir a la lista de empleados
    } catch (error) {
      alert('Hubo un problema al crear el empleado.');
      console.error('Error al crear el empleado:', error);
    } finally {
      setLoading(false); // Desactivar loading
    }
  };

  const limpiarFormulario = () => {
    setNombreCompleto('');
    setCargo('');
    setFechaContratacion('');
    setSalario('');
  };

  return (
    <div className="container">
      <h2>Crear Empleado</h2>
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          className="form-control"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <input
          type="text"
          className="form-control"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Fecha de Contratación (YYYY-MM-DD)</label>
        <input
          type="date"
          className="form-control"
          value={fechaContratacion}
          onChange={(e) => setFechaContratacion(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Salario</label>
        <input
          type="number"
          className="form-control"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleCreateEmpleado}
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Empleado'}
      </button>
    </div>
  );
};

export default CreateEmpleado;
