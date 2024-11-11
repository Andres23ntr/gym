import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateEntities = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    estadoMembresia: "Activo", // Estado Membresía manejado internamente
    ci: "",
    idMembresia: "",
    fechaInscripcion: "",
    fechaVencimiento: "",
    idPromocion: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
  });

  const [ciExists, setCiExists] = useState(false);
  const [promociones, setPromociones] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!token) return navigate("/");
    (async () => {
      try {
        const [membresiasRes, promocionesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/membresias"),
          axios.get("http://localhost:8000/api/promociones"),
        ]);
        setMembresias(membresiasRes.data);
        setPromociones(promocionesRes.data);
        setFormData((prev) => ({
          ...prev,
          fechaInscripcion: new Date().toISOString().split("T")[0],
        }));
      } catch (error) {
        toast.error("Error al cargar datos");
      }
    })();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validations = {
      ci: () => !isNaN(value) && value.length <= 9,
      nombreCompleto: () => /^[a-zA-Z\s]*$/.test(value),
      direccion: () => /^[a-zA-Z\s]*$/.test(value),
      telefono: () => !isNaN(value) && value.length <= 10,
      correoElectronico: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Valida el formato del correo

    };

    if (validations[name] && !validations[name]()) return;

    setFormData({ ...formData, [name]: value });

    if (name === "ci") {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => checkCiExists(value), 700);
    }
    if (validations[name] && !validations[name]()) {
      if (name === "correoElectronico") {
        toast.warn("Por favor, ingrese un correo válido.");
      }
      return;
    }
  };

  const handleMembresiaChange = (e) => {
    const idMembresia = e.target.value;
    const mesesPorMembresia = {
      "1": 1,
      "2": 12,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 7,
      "9": 8,
      "10": 9,
      "11": 10,
      "12": 11,
      "13": 12,
    };

    const meses = mesesPorMembresia[idMembresia] || 0;
    const fechaVencimiento =
      meses > 0
        ? new Date(new Date().setMonth(new Date().getMonth() + meses))
            .toISOString()
            .split("T")[0]
        : "";

    setFormData({
      ...formData,
      idMembresia,
      fechaVencimiento,
    });
  };

  const checkCiExists = async (ci) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/exists/${ci}`);
      if (response.data) {
        setCiExists(true);
        setFormData((prev) => ({ ...prev, ci: "" }));
        toast.warn("El CI ya está registrado, intente con otro.");
      } else {
        setCiExists(false);
      }
    } catch (error) {
    }
  };

  const handleCreateEntities = async () => {
    const { ci, nombreCompleto, idMembresia } = formData;
    if (!ci || !nombreCompleto || !idMembresia) {
      return toast.warn("Campos obligatorios incompletos.");
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/clientes",
        {
          id_cliente: ci,
          nombre_completo: nombreCompleto,
          estado_membresia: formData.estadoMembresia, // Estado Membresía manejado internamente
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Promise.all([
        axios.post("http://localhost:8000/api/clientes-membresias", {
          id_cliente: ci,
          id_membresia: idMembresia,
          fecha_inscripcion: formData.fechaInscripcion,
          fecha_vencimiento: formData.fechaVencimiento,
          id_promocion: formData.idPromocion,
        }),
        axios.post("http://localhost:8000/api/contacto-clientes", {
          id_cliente: ci,
          direccion: formData.direccion,
          telefono: formData.telefono,
          correo_electronico: formData.correoElectronico,
        }),
      ]);

      toast.success("Cliente creado con éxito");
      navigate("/pago", { state: { idCliente: ci } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear entidades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Crear Cliente</h2>

      {/* Campo de CI */}
      <div className="mb-3">
        <label className="form-label">CI</label>
        <input
          type="text"
          className={`form-control ${ciExists ? "is-invalid" : ""}`}
          name="ci"
          value={formData.ci}
          onChange={handleInputChange}
          maxLength="8"
          minLength="7"
          required
        />
        {ciExists && <div className="invalid-feedback">El CI ya está registrado.</div>}
      </div>

      {/* Campos generales */}
      {[
        { label: "Nombre Completo", name: "nombreCompleto", type: "text" },
        { label: "Teléfono", name: "telefono", type: "tel", maxLength: "10" },
        { label: "Correo Electrónico", name: "correoElectronico", type: "email" },
        { label: "Dirección", name: "direccion", type: "text" },
      ].map(({ label, name, type, maxLength }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            type={type}
            className="form-control"
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            maxLength={maxLength}
            required
          />
        </div>
      ))}
        <div className="mb-3"> 
    <label className="form-label">Promoción</label>
    <select 
      className="form-select" 
      name="idPromocion" 
      value={formData.idPromocion} 
      onChange={(e) => setFormData({ ...formData, idPromocion: e.target.value })}
    >
      <option value="">Seleccione una Promoción (opcional)</option>
      {promociones.map(({ id_promocion, descripcion, descuento }) => (
        <option key={id_promocion} value={id_promocion}>
          {`${id_promocion} - ${descripcion} - ${descuento}%`}
        </option>
      ))}
    </select>
  </div>

      {/* Campo de Membresías */}
      <div className="mb-3">
        <label className="form-label">Membresía</label>
        <select
          className="form-select"
          name="idMembresia"
          value={formData.idMembresia}
          onChange={handleMembresiaChange}
          required
        >
          <option value="">Seleccione una Membresía</option>
          {membresias.map(({ id_membresia, tipo_membresia, descripcion }) => (
            <option key={id_membresia} value={id_membresia}>
              {`${tipo_membresia} - ${descripcion}`}
            </option>
          ))}
        </select>
      </div>

      {/* Fechas */}
      {[
        { label: "Fecha Inscripción", name: "fechaInscripcion" },
        { label: "Fecha Vencimiento", name: "fechaVencimiento" },
      ].map(({ label, name }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            type="date"
            className="form-control"
            name={name}
            value={formData[name]}
            readOnly
          />
        </div>
      ))}

      <button
        className="btn btn-primary"
        onClick={handleCreateEntities}
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear Cliente"}
      </button>
    </div>
  );
};

export default CreateEntities;
