import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Datos del usuario:", response.data); // Verificar la respuesta
        setUser(response.data);
      } catch (err) {
        setError('Error al obtener los datos del usuario');
        console.error('Error al obtener los datos del usuario:', err.response ? err.response.data : err);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      {user ? (
        <div style={styles.userInfo}>
          <p> {user.name}</p>
        </div>
      ) : (
        <p style={styles.loading}>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '24px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  userInfo: {
    fontSize: '18px',
    color: '#555',
    textAlign: 'left',
  },
  loading: {
    fontSize: '16px',
    color: '#888',
    textAlign: 'center',
  },
};

export default Profile;
