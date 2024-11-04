import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Button, Modal, Form } from 'react-bootstrap';

const HistorialCasilleros = () => {
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id_cliente: '',
    fecha_alquiler: '',
    fecha_devolucion: '',
  });

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/historial-casilleros');
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de casilleros:', error);
        alert('Hubo un problema al cargar el historial.');
      } finally {
        setLoadingHistorial(false);
      }
    };

    fetchHistorial();
  }, []);

  // Función para abrir el modal y cargar los datos en el formulario
  const openModal = (item, isEdit = false) => {
    setSelectedItem(item);
    setEditMode(isEdit);
    setFormData({
      id_cliente: item.id_cliente,
      fecha_alquiler: item.fecha_alquiler,
      fecha_devolucion: item.fecha_devolucion,
    });
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({
      id_cliente: '',
      fecha_alquiler: '',
      fecha_devolucion: '',
    });
  };

  // Función para manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar la edición del historial
  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/historial-casilleros/${selectedItem.id_historial}`, formData);
      alert('Historial actualizado exitosamente.');
      setHistorial((prevHistorial) =>
        prevHistorial.map((item) =>
          item.id_historial === selectedItem.id_historial ? { ...item, ...formData } : item
        )
      );
      closeModal();
    } catch (error) {
      console.error('Error al actualizar el historial:', error);
      alert('Hubo un problema al actualizar el historial.');
    }
  };

  // Función para manejar la eliminación del historial
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/historial-casilleros/${selectedItem.id_historial}`);
      alert('Historial eliminado exitosamente.');
      setHistorial((prevHistorial) =>
        prevHistorial.filter((item) => item.id_historial !== selectedItem.id_historial)
      );
      closeModal();
    } catch (error) {
      console.error('Error al eliminar el historial:', error);
      alert('Hubo un problema al eliminar el historial.');
    }
  };

  return (
    <div>
      <h2 className="mt-5">Historial de Casilleros</h2>
      {loadingHistorial ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
          <p>Cargando historial...</p>
        </div>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID Historial</th>
              <th>ID Casillero</th>
              <th>ID Cliente</th>
              <th>Fecha Alquiler</th>
              <th>Fecha Devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => (
              <tr key={item.id_historial}>
                <td>{item.id_historial}</td>
                <td>{item.id_casillero}</td>
                <td>{item.id_cliente}</td>
                <td>{item.fecha_alquiler}</td>
                <td>{item.fecha_devolucion}</td>
                <td>
                  <Button variant="info" className="me-2" onClick={() => openModal(item)}>
                    Ver
                  </Button>
                  <Button variant="warning" className="me-2" onClick={() => openModal(item, true)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => openModal(item, false)}> {/* Delete button */}
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de Edición/Visualización */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Historial' : 'Ver Historial'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID Cliente</Form.Label>
              <Form.Control
                type="text"
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Alquiler</Form.Label>
              <Form.Control
                type="date"
                name="fecha_alquiler"
                value={formData.fecha_alquiler}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Devolución</Form.Label>
              <Form.Control
                type="date"
                name="fecha_devolucion"
                value={formData.fecha_devolucion}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          {editMode ? (
            <Button variant="primary" onClick={handleEdit}>
              Guardar Cambios
            </Button>
          ) : (
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistorialCasilleros;
