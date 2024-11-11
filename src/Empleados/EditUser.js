import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmpleado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [empleado, setEmpleado] = useState({
    nombre_completo: '',
    cargo: '',
    fecha_contratacion: '',
    salario: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmpleado = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/empleados/${id}`);
        const empleadoData = response.data;

        const fechaFormateada = empleadoData.fecha_contratacion.split('T')[0];

        setEmpleado({
          ...empleadoData,
          fecha_contratacion: fechaFormateada,
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

  const validateFields = () => {
    const validationErrors = {};

    // Validar nombre completo
    if (!empleado.nombre_completo.trim()) {
      validationErrors.nombre_completo = 'El nombre completo es obligatorio.';
    } else if (empleado.nombre_completo.length > 50) {
      validationErrors.nombre_completo = 'El nombre completo no puede tener más de 50 caracteres.';
    } else if (!/^[a-zA-Z\s]+$/.test(empleado.nombre_completo)) {
      validationErrors.nombre_completo = 'El nombre completo solo puede contener letras y espacios.';
    }

    // Validar cargo
    if (!empleado.cargo.trim()) {
      validationErrors.cargo = 'El cargo es obligatorio.';
    } else if (empleado.cargo.length > 30) {
      validationErrors.cargo = 'El cargo no puede tener más de 30 caracteres.';
    } else if (!/^[a-zA-Z\s]+$/.test(empleado.cargo)) {
      validationErrors.cargo = 'El cargo solo puede contener letras y espacios.';
    }

    // Validar fecha de contratación
    if (!empleado.fecha_contratacion) {
      validationErrors.fecha_contratacion = 'La fecha de contratación es obligatoria.';
    }

    // Validar salario
    const salarioNumerico = parseFloat(empleado.salario);
    if (!empleado.salario) {
      validationErrors.salario = 'El salario es obligatorio.';
    } else if (isNaN(salarioNumerico) || salarioNumerico < 1000 || salarioNumerico > 1000000) {
      validationErrors.salario = 'El salario debe estar entre 1000 y 1,000,000.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleEditEmpleado = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/api/empleados/${id}`, empleado);
      alert('Empleado actualizado con éxito');
      navigate('/ShowUser');
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
          className={`form-control ${errors.nombre_completo ? 'is-invalid' : ''}`}
          value={empleado.nombre_completo}
          onChange={(e) => setEmpleado({ ...empleado, nombre_completo: e.target.value })}
          disabled={loading}
          placeholder="Nombre Completo"
        />
        {errors.nombre_completo && (
          <div className="invalid-feedback">{errors.nombre_completo}</div>
        )}
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <input
          type="text"
          className={`form-control ${errors.cargo ? 'is-invalid' : ''}`}
          value={empleado.cargo}
          onChange={(e) => setEmpleado({ ...empleado, cargo: e.target.value })}
          disabled={loading}
          placeholder="Cargo"
        />
        {errors.cargo && <div className="invalid-feedback">{errors.cargo}</div>}
      </div>
      <div className="form-group">
        <label>Fecha de Contratación (YYYY-MM-DD)</label>
        <input
          type="date"
          className={`form-control ${errors.fecha_contratacion ? 'is-invalid' : ''}`}
          value={empleado.fecha_contratacion}
          onChange={(e) => setEmpleado({ ...empleado, fecha_contratacion: e.target.value })}
          disabled={loading}
        />
        {errors.fecha_contratacion && (
          <div className="invalid-feedback">{errors.fecha_contratacion}</div>
        )}
      </div>
      <div className="form-group">
        <label>Salario</label>
        <input
          type="number"
          className={`form-control ${errors.salario ? 'is-invalid' : ''}`}
          value={empleado.salario}
          onChange={(e) => setEmpleado({ ...empleado, salario: e.target.value })}
          disabled={loading}
          placeholder="Salario"
        />
        {errors.salario && <div className="invalid-feedback">{errors.salario}</div>}
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
