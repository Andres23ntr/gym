// src/components/ImagenPesas.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagenPesas from '../assets/aae.png'; // Ajusta la ruta si es necesario

const ImagenPesas = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirige al inicio de sesión si no hay token
    }
  }, [navigate, token]);

  return (
    <div style={estilos.contenedor}>
      <img src={imagenPesas} alt="Pesas" style={estilos.imagen} />
      <p style={estilos.texto}>Página no encontrada</p>
    </div>
  );
};

const estilos = {
  contenedor: {
    display: 'flex',
    flexDirection: 'column', // Organiza los elementos en columna (imagen arriba, texto abajo)
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0, // Elimina cualquier margen alrededor del componente
    padding: 0, // Elimina cualquier padding alrededor del componente
    height: '100vh', // Altura del viewport completo
    background: 'linear-gradient(135deg, #2c3e50, #bdc3c7)', // Fondo degradado
  },
  imagen: {
    width: '400px', // Ajusta el tamaño según sea necesario
    height: 'auto',
  },
  texto: {
    color: '#FFF', // Color blanco para que contraste con el fondo oscuro
    fontSize: '64px', // Tamaño de fuente ajustado
    marginTop: '20px', // Espacio entre la imagen y el texto
    fontFamily: 'Arial, sans-serif', // Fuente básica
  },
};

export default ImagenPesas;
