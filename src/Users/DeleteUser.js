import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios'; // Importar axios
import 'react-toastify/dist/ReactToastify.css';

const DeleteUser = ({ userId, onUserDeleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const token = localStorage.getItem('token');

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleDeleteUser = async () => {
    try {
        await axios.delete(`http://localhost:8000/api/auth/destroyUser/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        onUserDeleted(userId);
        toast.success('Usuario eliminado correctamente.');
        setShowConfirmation(false);
    } catch (error) {
        console.error('Error eliminando usuario:', error.response?.data || error.message);
        const message =
            error.response?.data?.message || 'Ocurrió un error inesperado al eliminar el usuario.';
        toast.error(message);
    }
};


  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleDeleteConfirmation}>
        Eliminar
      </Button>

      <Modal show={showConfirmation} onHide={handleCancelConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de que desea eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUser;
