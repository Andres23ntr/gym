import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link ,useNavigate} from 'react-router-dom';

const ShowEmpleadoList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [empleadoIdToDelete, setEmpleadoIdToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // Función para obtener los empleados desde la API
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/empleados',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpleados(response.data);
    } catch (error) {
      setError('Hubo un problema al obtener los empleados.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los empleados cuando el componente se monta
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchEmpleados();
  }, []);

  // Manejar eliminación de empleado
  const handleDeleteConfirmation = (id) => {
    setEmpleadoIdToDelete(id);
    setShowConfirmation(true);
  };

  const handleDeleteEmpleado = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/empleados/${empleadoIdToDelete}`);
      setEmpleados(empleados.filter(empleado => empleado.id_empleado !== empleadoIdToDelete));
      setShowConfirmation(false);
    } catch (error) {
      setError('Hubo un problema al eliminar el empleado.');
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Manejar creación de empleado
  const goToCreateEmpleado = () => {
    window.location.href = '/CreateUser'; // Ajusta la ruta si es necesario
  };

  // Manejar búsqueda de empleados
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar empleados por el término de búsqueda
  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Lista de Empleados</h1>

      <Button onClick={goToCreateEmpleado} className="mb-3">Crear Empleado</Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar empleado por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Cargo</th>
            <th>Fecha de Contratación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmpleados.map((empleado) => (
            <tr key={empleado.id_empleado}>
              <td>{empleado.id_empleado}</td>
              <td>{empleado.nombre_completo}</td>
              <td>{empleado.cargo}</td>
              <td>{new Date(empleado.fecha_contratacion).toLocaleDateString()}</td>
              <td>
                <Link to={`/EditUser/${empleado.id_empleado}`}>
                  <Button variant="warning" className="me-2">Editar</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirmation(empleado.id_empleado)}
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
        <Modal.Body>¿Está seguro de que desea eliminar este empleado?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteEmpleado}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowEmpleadoList;
