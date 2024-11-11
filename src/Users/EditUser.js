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
    const [fieldErrors, setFieldErrors] = useState({});
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

    // Validar campos
    const validateFields = () => {
        const errors = {};

        // Validar nombre
        if (!user.name.trim()) {
            errors.name = 'El nombre es obligatorio.';
        } else if (user.name.length > 30) {
            errors.name = 'El nombre no puede tener más de 30 caracteres.';
        } else if (!/^[a-zA-Z\s]+$/.test(user.name)) {
            errors.name = 'El nombre solo puede contener letras y espacios.';
        }

        // Validar contraseña si se ingresa
        if (user.password && (user.password.length < 8 || user.password.length > 20)) {
            errors.password = 'La contraseña debe tener entre 8 y 20 caracteres.';
        } else if (user.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/.test(user.password)) {
            errors.password = 'La contraseña debe contener al menos una letra y un número.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validar en tiempo real
        if (name === 'name' && (value.length > 30 || !/^[a-zA-Z\s]*$/.test(value))) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                name: 'El nombre debe tener máximo 30 caracteres y solo letras y espacios.',
            }));
            return;
        }

        if (name === 'password' && value.length > 20) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                password: 'La contraseña debe tener máximo 20 caracteres.',
            }));
            return;
        }

        // Actualizar el campo si pasa las validaciones
        setUser({ ...user, [name]: value });

        // Limpiar errores en tiempo real
        setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    };

    // Manejar la edición del usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

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
                        isInvalid={!!fieldErrors.name}
                        required
                    />
                    {fieldErrors.name && (
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.name}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña (opcional)</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={user.password || ''} // Evitar mostrar `undefined`
                        onChange={handleChange}
                        isInvalid={!!fieldErrors.password}
                        placeholder="Dejar en blanco para no cambiar"
                    />
                    {fieldErrors.password && (
                        <Form.Control.Feedback type="invalid">
                            {fieldErrors.password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </Form>
        </div>
    );
};

export default EditUser;
