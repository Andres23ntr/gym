// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DeleteUser from './DeleteUser'; // Importa el nuevo componente

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/index', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError('Hubo un problema al obtener los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, []);

  // Función para actualizar la lista cuando un usuario sea eliminado
  const handleUserDeleted = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Lista de Usuarios</h1>

      <Link to="/create-user">
        <Button className="mb-3">Crear Usuario</Button>
      </Link>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar usuario por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Link to={`/editt/${user.id}`}>
                  <Button variant="warning" className="me-2">Editar</Button>
                </Link>
                {/* Usar el componente DeleteUser para eliminar */}
                <DeleteUser userId={user.id} onUserDeleted={handleUserDeleted} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
