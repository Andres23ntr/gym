import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeIcon from '../assets/open.png';
import eyeOffIcon from '../assets/hidden.png';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateFields = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 3 || name.length > 25 || !nameRegex.test(name)) {
      toast.error('El nombre debe tener entre 3 y 25 caracteres y solo letras.');
      return false;
    }

    if (!email || !emailRegex.test(email)) {
      toast.error('Ingrese un correo electrónico válido.');
      return false;
    }

    if (!password || passwordStrength !== 'Fuerte') {
      toast.error('La contraseña debe ser fuerte y cumplir los requisitos.');
      return false;
    }

    return true;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength <= 2) return 'Débil';
    if (strength === 3) return 'Media';
    if (strength > 3) return 'Fuerte';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.slice(0, 25); // Limitar a 25 caracteres
    setPassword(newPassword);

    // Calcula la fuerza y actualiza la etiqueta
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(getPasswordStrengthLabel(strength));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCreateUser = async () => {
    if (!validateFields()) {
      return;
    }

    const userData = { name, email, password };

    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/auth/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Usuario creado con éxito.');
      navigate('/userr');
    } catch (error) {
      setLoading(false);
      console.error('Error completo:', error);

      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((key) => {
          const errorMessages = serverErrors[key];
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach((message) => {
              toast.error(`${key}: ${message}`);
            });
          } else {
            toast.error(`${key}: ${errorMessages}`);
          }
        });
      } else {
        toast.error('No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Crear Usuario</h2>
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 25).replace(/[^A-Za-z\s]/g, ''))}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <div className="password-container" style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            value={password}
            onChange={handlePasswordChange}
            disabled={loading}
            style={{ paddingRight: '40px' }}
          />
          <img
            src={showPassword ? eyeOffIcon : eyeIcon}
            alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
            }}
          />
        </div>
        {password && (
          <small className={`password-strength ${passwordStrength.toLowerCase()}`}>
            Fuerza: {passwordStrength}
          </small>
        )}
      </div>
      <button
        className="btn btn-primary"
        onClick={handleCreateUser}
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserForm;
