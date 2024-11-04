import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const DeleteEmpleado = ({ id }) => {
  const navigate = useNavigate(); // Cambia useHistory() por useNavigate()

  const deleteEmpleado = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este empleado?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/empleados/${id}`);
        alert('Empleado eliminado con éxito');
        navigate('/empleados'); // Redirige a la lista de empleados usando navigate()
      } catch (error) {
        alert('Error: No se pudo eliminar el empleado.');
        console.error(error);
      }
    } else {
      navigate('/empleados'); // Redirige si la eliminación es cancelada
    }
  };

  return (
    <button onClick={deleteEmpleado} style={styles.deleteButton}>
      Eliminar Empleado
    </button>
  );
};

const styles = {
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default DeleteEmpleado;
