import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from '../assets/aa.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Evita el scroll en la página
    document.body.style.overflow = 'hidden';

    // Limpia el estilo cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validateFields = () => {
    if (!email || !password) {
      toast.error('Por favor, complete todos los campos.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Ingrese un email válido.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      toast.success('Inicio de sesión exitoso');
      console.log('Login exitoso. Token:', response.data.access_token);

      setTimeout(() => navigate('/Clientes'), 1500); // Redirige después de 1.5 segundos
    } catch (err) {
      toast.error('Credenciales incorrectas');
      console.error('Error de login', err);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.leftContainer}>
          <img src={img} alt="Imagen de Inicio de Sesión" style={styles.image} />
        </div>
        <div style={styles.rightContainer}>
          <h2 style={styles.loginTitle}>Inicio de sesión</h2>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.loginInput}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.loginInput}
              />
            </div>
            <button type="submit" style={styles.loginButton}>Login</button>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const styles = {
  rightContainer: {
    flex: '1',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw', // Asegura que ocupe el ancho completo de la pantalla
    height: '100vh', // Asegura que ocupe el alto completo de la pantalla
    background: 'linear-gradient(135deg, #a11717de, #2f0505fe)',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: '80%', // Ajusta el ancho para que sea dinámico
    maxWidth: '900px', // Establece un tamaño máximo
    height: '80%', // Ajusta la altura para que sea dinámica
    maxHeight: '400px', // Establece una altura máxima
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  leftContainer: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#333',
    marginBottom: '20px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  loginInput: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#272727',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;
