import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link ,useNavigate} from 'react-router-dom';
const ShowClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // Función para obtener los clientes desde la API
  const fetchClientes = async () => {

 

    
    try {
      const response = await axios.get('http://localhost:8000/api/clientes',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      setClientes(response.data);
    } catch (error) {
      setError('Hubo un problema al obtener los clientes.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los clientes cuando el componente se monta
  useEffect(() => {
   if (!token) {
      navigate('/');
      return;
    }
    fetchClientes();
  }, []);

  // Manejar eliminación de cliente
  const handleDeleteConfirmation = (id) => {
    setClientIdToDelete(id);
    setShowConfirmation(true);
  };

  const handleDeleteClient = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/clientes/${clientIdToDelete}`);

      
      setClientes(clientes.filter(cliente => cliente.id_cliente !== clientIdToDelete));
      setShowConfirmation(false);
    } catch (error) {
      setError('Hubo un problema al eliminar el cliente.');
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Manejar creación de cliente
  const goToCreateCliente = () => {
    window.location.href = '/CreateClients'; // Ajusta la ruta si es necesario
  };

  // Manejar búsqueda de clientes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar clientes por el término de búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Lista de Clientes</h1>

      <Button onClick={goToCreateCliente} className="mb-3">Crear Cliente</Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar cliente por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
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
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirmation(cliente.id_cliente)}
                >
                  Eliminar
                </Button>
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
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteClient}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowClientes;
