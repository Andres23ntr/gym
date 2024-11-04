import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FaBars, FaUser, FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import Profile from "../Login/Profile";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";
import { BsCash } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";

const MySidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ruta actual

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      if (!token) {
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userName = response.data.name;
        setUserInitial(userName.charAt(0).toUpperCase());
        setUserName(userName); // Almacena el nombre completo
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      console.log("Logout exitoso:", response.data.message);
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Oculta el sidebar si la ruta actual es "/"
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="sidebar-container">
      <Sidebar collapsed={collapsed}>
        <Menu iconShape="square">
          <MenuItem>
            <div className="user-info">
              <div className="user-initial">{userInitial}</div>
              {!collapsed && <p className="user-name">{userName}</p>}
            </div>
          </MenuItem>
          <div style={{ height: "40px" }}></div>

          <MenuItem icon={<FaHome />} onClick={() => handleNavigation("/")}>
            Home
          </MenuItem>

          <MenuItem icon={<FaUser />} onClick={() => handleNavigation("/Clientes")}>
            Clientes
          </MenuItem>

          <MenuItem icon={<HiUserGroup />} onClick={() => handleNavigation("/ShowUser")}>
            Empleados
          </MenuItem>

          <MenuItem 
            icon={<TfiLayoutColumn3Alt />} 
            onClick={() => handleNavigation("/Locker")}
          >
            Casillero
          </MenuItem>

          <MenuItem 
            icon={<BsCash />} 
            onClick={() => handleNavigation("/ShowPagos")}
          >
            Pagos
          </MenuItem>
          <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>

      <div className="sidebar-toggle" onClick={handleToggle}>
        <FaBars />
      </div>
    </div>
  );
};

export default MySidebar;
