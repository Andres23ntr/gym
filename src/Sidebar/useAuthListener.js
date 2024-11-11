import { useEffect, useState } from 'react';

const useAuthListener = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Configurar un intervalo para revisar el token cada segundo
    const intervalId = setInterval(checkToken, 1000);

    // Limpiar el intervalo cuando se desmonta el componente
    return () => clearInterval(intervalId);
  }, []);

  return isAuthenticated;
};

export default useAuthListener;
