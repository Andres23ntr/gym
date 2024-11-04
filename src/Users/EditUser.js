import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Función para obtener los detalles del usuario
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/auth/Usuario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            setError('Hubo un problema al obtener el usuario.');
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar los datos del usuario
    useEffect(() => {
        if (!token) {
            navigate('/'); // Redirigir si no hay token
            return;
        }
        fetchUser();
    }, [id, token, navigate]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Manejar la edición del usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Inicia el proceso de envío
        try {
            await axios.post(`http://localhost:8000/api/auth/updateUser/${id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/userr'); // Redirigir a la lista de usuarios después de editar
        } catch (error) {
            setError('Hubo un problema al editar el usuario.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-5">
            <h1 className="text-center">Editar Usuario</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña (opcional)</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={user.password || ''} // Evitar mostrar `undefined`
                        onChange={handleChange}
                        placeholder="Dejar en blanco para no cambiar"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </Form>
        </div>
    );
};

export default EditUser;
