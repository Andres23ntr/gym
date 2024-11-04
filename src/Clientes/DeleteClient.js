import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const DeleteClient = ({ idCliente, onDelete }) => {
  
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
      if (confirmDelete) {
        await axios.delete(`http://localhost:8000/api/clientes/${idCliente}`);
        alert("Cliente eliminado correctamente.");
        onDelete(); // Llama a la función para actualizar la lista de clientes
      }
    } catch (error) {
      alert('Hubo un problema al eliminar el cliente.');
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Eliminar
    </Button>
  );
};

export default DeleteClient;
