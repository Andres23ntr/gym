import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ShowClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(''); // Mensaje de éxito al eliminar cliente
  const [generalMessage, setGeneralMessage] = useState(''); // Mensaje genérico
  const [searchTerm, setSearchTerm] = useState('');
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showRenewalSuccess, setShowRenewalSuccess] = useState(false);
  const [renewalFormData, setRenewalFormData] = useState({ fecha: '', idMembresia: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchClientes();
  }, [token, navigate]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(response.data);
    } catch (error) {
      setError('Hubo un problema al obtener los clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setClientIdToDelete(id);
    setShowConfirmation(true);
  };

  const handleDeleteClient = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/clientes/${clientIdToDelete}`);
      setClientes(clientes.filter(cliente => cliente.id_cliente !== clientIdToDelete));
      setDeleteMessage(`Cliente con ID ${clientIdToDelete} eliminado exitosamente.`);
      setTimeout(() => setDeleteMessage(''), 5000); // Ocultar mensaje tras 5 segundos
      setShowConfirmation(false);
    } catch (error) {
      setError('Hubo un problema al eliminar el cliente.');
    }
  };

  const handleCancelConfirmation = () => setShowConfirmation(false);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleViewHistorial = async (idCliente) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/historial_mem/${idCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorial(response.data);
      setGeneralMessage('Historial de membresía cargado.');
      setTimeout(() => setGeneralMessage(''), 5000);
      setShowHistorial(true);
    } catch (error) {
      setError('Hubo un problema al obtener el historial de membresía.');
    }
  };

  const closeHistorialModal = () => setShowHistorial(false);

  const handleRenewMembresia = async (idCliente) => {
    try {
      await axios.put(`http://localhost:8000/api/Renovar/${idCliente}`, renewalFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowRenewalSuccess(true);
      fetchClientes();
      setGeneralMessage('Membresía renovada exitosamente.');
      setTimeout(() => setGeneralMessage(''), 5000);
    } catch (error) {
      setError('Hubo un problema al renovar la membresía.');
    }
  };

  const closeRenewalModal = () => setShowRenewalSuccess(false);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h1 className="text-center">Lista de Clientes</h1>

      {/* Mensajes de alerta */}
      {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>}
      {generalMessage && <Alert variant="info">{generalMessage}</Alert>}

      <Button onClick={() => navigate('/CreateClients')} className="mb-3">Crear Cliente</Button>
      <Button onClick={() => navigate('/Vencimientos')} className="mb-3 ms-3">Ver Membresías Vencidas</Button>
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Buscar cliente por nombre" value={searchTerm} onChange={handleSearchChange} />
      </Form.Group>

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Estado Membresía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.nombre_completo}</td>
              <td>{cliente.estado_membresia}</td>
              <td>
                <Link to={`/edit/${cliente.id_cliente}`}>
                  <Button variant="warning" className="me-2">Editar</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDeleteConfirmation(cliente.id_cliente)}>Eliminar</Button>
                <Button variant="info" onClick={() => handleViewHistorial(cliente.id_cliente)} className="ms-2">Ver Historial</Button>
                <Link to={`/ClientMenbresia/${cliente.id_cliente}`}>
                  <Button variant="success" className="ms-2">Renovar Membresía</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showConfirmation} onHide={handleCancelConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de que desea eliminar este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteClient}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHistorial} onHide={closeHistorialModal}>
        <Modal.Header closeButton>
          <Modal.Title>Historial de Membresía</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historial.length > 0 ? (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>ID Historial</th>
                  <th>ID Cliente</th>
                  <th>ID Membresía</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Promoción</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item) => (
                  <tr key={item.id_historial}>
                    <td>{item.id_historial}</td>
                    <td>{item.id_cliente}</td>
                    <td>{item.id_membresia}</td>
                    <td>{item.fecha_inicio}</td>
                    <td>{item.fecha_fin}</td>
                    <td>{item.id_promocion ? `Promoción ID: ${item.id_promocion}` : 'Ninguna'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay registros de membresía para este cliente.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeHistorialModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowClientes;
