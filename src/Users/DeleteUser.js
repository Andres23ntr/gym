import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteUser = ({ userId, onUserDeleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
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
      onUserDeleted(userId); // Notifica al componente padre que el usuario fue eliminado
      setShowConfirmation(false);
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      setError('Hubo un problema al eliminar el usuario.');
      toast.error('Error al eliminar el usuario.');
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

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* Contenedor de Toastify para mostrar notificaciones */}
      <ToastContainer />
    </>
  );
};

export default DeleteUser;
