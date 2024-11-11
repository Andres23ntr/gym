import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePago = () => {
    const [formData, setFormData] = useState({
        id_cliente: '',
        fecha_pago: '',
        monto: '',
        metodo_pago: '',
        detalle: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData((prev) => ({ ...prev, fecha_pago: today }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'id_cliente') {
            if (!/^\d*$/.test(value)) return; // Solo números
            if (value.length > 9) return; // Máximo 9 caracteres
        }

        if (name === 'monto') {
            if (!/^\d*$/.test(value)) return; // Solo números
            if (value.length > 4) return; // Máximo 4 caracteres
        }

        if (name === 'detalle') {
            if (!/^[a-zA-Z\s]*$/.test(value)) return; // Solo letras y espacios
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        // Limpiar errores si el usuario corrige el campo
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateFields = () => {
        const newErrors = {};

        if (!formData.id_cliente || formData.id_cliente.length < 7) {
            newErrors.id_cliente = 'El ID del cliente debe tener al menos 7 caracteres.';
        } else if (formData.id_cliente.length > 9) {
            newErrors.id_cliente = 'El ID del cliente no puede tener más de 9 caracteres.';
        }

        if (!formData.monto || formData.monto === '0') {
            newErrors.monto = 'El monto debe ser mayor a 0.';
        }

        if (!formData.metodo_pago) {
            newErrors.metodo_pago = 'Debe seleccionar un método de pago.';
        }

        if (!formData.detalle) {
            newErrors.detalle = 'Debe seleccionar un detalle.';
        }

        setErrors(newErrors);

        // Retorna true si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) {
          toast.error('Por favor, complete correctamente todos los campos .');
          return;
      }
      

        try {
            const nuevoPago = {
                id_cliente: parseInt(formData.id_cliente, 10),
                fecha_pago: formData.fecha_pago,
                monto: parseFloat(formData.monto).toFixed(2),
                metodo_pago: formData.metodo_pago,
                detalle: formData.detalle,
            };

            await axios.post('http://localhost:8000/api/pagos', nuevoPago);

            toast.success('Pago creado exitosamente');

            setTimeout(() => {
                navigate('/ShowPagos');
            }, 2000);
        } catch (error) {
            if (error.response) {
                const serverMessage = error.response.data.message || 'Revisa los datos enviados';
                if (serverMessage.includes('id cliente is invalid')) {
                    toast.error('El ID del cliente no es válido. Verifique los datos.');
                } else {
                    toast.error(`Error del servidor: ${serverMessage}`);
                }
            } else {
                toast.error('Error desconocido al enviar el pago.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Crear Pago</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label style={styles.label}>ID Cliente:</label>
                    <input
                        type="text"
                        name="id_cliente"
                        value={formData.id_cliente}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            borderColor: errors.id_cliente ? 'red' : '#ccc',
                        }}
                        placeholder="Ingrese el ID del cliente (7-9 dígitos)"
                        maxLength={9}
                    />
                    {errors.id_cliente && <p style={styles.error}>{errors.id_cliente}</p>}
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Fecha de Pago:</label>
                    <input
                        type="date"
                        name="fecha_pago"
                        value={formData.fecha_pago}
                        readOnly
                        style={{
                            ...styles.input,
                            backgroundColor: '#f0f0f0',
                            cursor: 'not-allowed',
                        }}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Monto:</label>
                    <input
                        type="text"
                        name="monto"
                        value={formData.monto}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            borderColor: errors.monto ? 'red' : '#ccc',
                        }}
                        placeholder="Ingrese el monto (máximo 4 dígitos)"
                        maxLength={4}
                    />
                    {errors.monto && <p style={styles.error}>{errors.monto}</p>}
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Método de Pago:</label>
                    <select
                        name="metodo_pago"
                        value={formData.metodo_pago}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            borderColor: errors.metodo_pago ? 'red' : '#ccc',
                        }}
                    >
                        <option value="">Seleccione un método</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                    {errors.metodo_pago && <p style={styles.error}>{errors.metodo_pago}</p>}
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Detalle:</label>
                    <select
                        name="detalle"
                        value={formData.detalle}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            borderColor: errors.detalle ? 'red' : '#ccc',
                        }}
                    >
                        <option value="">Seleccione un detalle</option>
                        <option value="Membresia">Membresía</option>
                        <option value="Renovacion de Membresia">Renovación de Membresía</option>
                        <option value="Casillero">Casillero</option>
                    </select>
                    {errors.detalle && <p style={styles.error}>{errors.detalle}</p>}
                </div>
                <button type="submit" style={styles.button}>Crear</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: 'auto',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    field: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        padding: '12px 10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '5px',
    },
};

export default CreatePago;
