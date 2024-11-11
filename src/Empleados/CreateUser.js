import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEmpleado = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaContratacion, setFechaContratacion] = useState('');
  const [salario, setSalario] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateFields = () => {
    const validationErrors = {};

    // Validar nombre completo
    if (!nombreCompleto.trim()) {
      validationErrors.nombreCompleto = 'El nombre completo es obligatorio.';
    } else if (nombreCompleto.length > 50) {
      validationErrors.nombreCompleto = 'El nombre completo no puede tener más de 50 caracteres.';
    } else if (!/^[a-zA-Z\s]+$/.test(nombreCompleto)) {
      validationErrors.nombreCompleto = 'El nombre completo solo puede contener letras y espacios.';
    }

    // Validar cargo
    if (!cargo.trim()) {
      validationErrors.cargo = 'El cargo es obligatorio.';
    } else if (cargo.length > 30) {
      validationErrors.cargo = 'El cargo no puede tener más de 30 caracteres.';
    } else if (!/^[a-zA-Z\s]+$/.test(cargo)) {
      validationErrors.cargo = 'El cargo solo puede contener letras y espacios.';
    }

    // Validar fecha de contratación
    if (!fechaContratacion) {
      validationErrors.fechaContratacion = 'La fecha de contratación es obligatoria.';
    }

    // Validar salario
    const salarioNumerico = parseFloat(salario);
    if (!salario) {
      validationErrors.salario = 'El salario es obligatorio.';
    } else if (isNaN(salarioNumerico) || salarioNumerico < 1000 || salarioNumerico > 1000000) {
      validationErrors.salario = 'El salario debe estar entre 1000 y 1,000,000.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleCreateEmpleado = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const empleadoData = {
        nombre_completo: nombreCompleto,
        cargo: cargo,
        fecha_contratacion: fechaContratacion,
        salario: salario,
      };

      await axios.post('http://localhost:8000/api/empleados', empleadoData);

      alert('Empleado creado con éxito');
      limpiarFormulario();
      navigate('/ShowUser');
    } catch (error) {
      alert('Hubo un problema al crear el empleado.');
      console.error('Error al crear el empleado:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNombreCompleto('');
    setCargo('');
    setFechaContratacion('');
    setSalario('');
    setErrors({});
  };

  return (
    <div className="container">
      <h2>Crear Empleado</h2>
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          className={`form-control ${errors.nombreCompleto ? 'is-invalid' : ''}`}
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          disabled={loading}
        />
        {errors.nombreCompleto && (
          <div className="invalid-feedback">{errors.nombreCompleto}</div>
        )}
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <input
          type="text"
          className={`form-control ${errors.cargo ? 'is-invalid' : ''}`}
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          disabled={loading}
        />
        {errors.cargo && <div className="invalid-feedback">{errors.cargo}</div>}
      </div>
      <div className="form-group">
        <label>Fecha de Contratación (YYYY-MM-DD)</label>
        <input
          type="date"
          className={`form-control ${errors.fechaContratacion ? 'is-invalid' : ''}`}
          value={fechaContratacion}
          onChange={(e) => setFechaContratacion(e.target.value)}
          disabled={loading}
        />
        {errors.fechaContratacion && (
          <div className="invalid-feedback">{errors.fechaContratacion}</div>
        )}
      </div>
      <div className="form-group">
        <label>Salario</label>
        <input
          type="number"
          className={`form-control ${errors.salario ? 'is-invalid' : ''}`}
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          disabled={loading}
        />
        {errors.salario && <div className="invalid-feedback">{errors.salario}</div>}
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
