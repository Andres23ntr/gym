import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FaBars, FaUser, FaCog, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";
import { BsCash } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { IoManSharp } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";

const MySidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      if (!token) {
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userName = response.data.name;
        setUserInitial(userName.charAt(0).toUpperCase());
        setUserName(userName);
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

          <MenuItem
            className="menu-item-hover"
            icon={<FaHome />}
            onClick={() => handleNavigation("/Inicio")}
          >
            Home
          </MenuItem>

          <MenuItem
            className="menu-item-hover"
            icon={<FaUser />}
            onClick={() => handleNavigation("/Clientes")}
          >
            Clientes
          </MenuItem>
          <MenuItem
            className="menu-item-hover"
            icon={<IoManSharp />}
            onClick={() => handleNavigation("/userr")}
          >
            Usuarios
          </MenuItem>
          <MenuItem
            className="menu-item-hover"
            icon={<HiUserGroup />}
            onClick={() => handleNavigation("/ShowUser")}
          >
            Empleados
          </MenuItem>

          <MenuItem
            className="menu-item-hover"
            icon={<TfiLayoutColumn3Alt />}
            onClick={() => handleNavigation("/Locker")}
          >
            Casillero
          </MenuItem>
          <MenuItem
            className="menu-item-hover"
            icon={<IoNotifications />}
            onClick={() => handleNavigation("/Vencimientos")}
          >
            Notificaciones
          </MenuItem>

          <MenuItem
            className="menu-item-hover"
            icon={<BsCash />}
            onClick={() => handleNavigation("/ShowPagos")}
          >
            Pagos
          </MenuItem>

          <MenuItem
            className="menu-item-hover"
            icon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
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
