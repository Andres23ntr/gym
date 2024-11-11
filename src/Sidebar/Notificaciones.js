import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthListener from './useAuthListener';

const Notifications = () => {
  const isAuthenticated = useAuthListener();
  const [hasDisplayed, setHasDisplayed] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const response1 = await axios.get('http://localhost:8000/api/cVencimiento');
      const response2 = await axios.get('http://localhost:8000/api/VencimientosFuturos');
      const notifications = [];

      if (response1.data.length > 0) {
        notifications.push({
          message: `Hay ${response1.data.length} membresías próximas a vencer.`,
          type: 'warn',
        });
      }
      if (response2.data.length > 0) {
        notifications.push({
          message: `Hay ${response2.data.length} membresías que ya vencieron.`,
          type: 'error',
        });
      }

      // Mostrar las notificaciones
      notifications.forEach(notification => {
        if (notification.type === 'warn') {
          toast.warn(notification.message, {
            position: 'top-right',
            autoClose: 5000,
          });
        } else if (notification.type === 'error') {
          toast.error(notification.message, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      });
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
      toast.error('Error al obtener las notificaciones.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && !hasDisplayed) {
      // El usuario acaba de iniciar sesión
      toast.success('Sesión iniciada', { position: 'top-right', autoClose: 3000 });
      fetchNotifications();
      setHasDisplayed(true);
    } else if (!isAuthenticated && hasDisplayed) {
      // El usuario acaba de cerrar sesión
      toast.info('Sesión cerrada', { position: 'top-right', autoClose: 3000 });
      setHasDisplayed(false);
    }
  }, [isAuthenticated]);

  return null;
};

export default Notifications;
