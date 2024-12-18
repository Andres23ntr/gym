import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importa el Sidebar
import Sidebar from './Sidebar/nav';

// Importa los componentes de clientes
import CreateClients from './Clientes/CreateCliente';
import ShowClientes from './Clientes/ShowClientes';
import EditClient from './Clientes/EditCliente';
import DeleteClient from './Clientes/DeleteClient';
import Pago from './Clientes/Pago';
import ShowPagos from './Clientes/ShowPago';
import EditPago from './Clientes/EditPago';
import ShowUser from './Empleados/ShowUser';
import CreateUser from './Empleados/CreateUser';
import DeleteUser from './Empleados/Delete';
import EditUser from './Empleados/EditUser';
import ThreeScene from './lockers/ThreeScene';
import Locker from './lockers/GestionCasilleros';
import Login from './Login/Login';
import CreatePago from './Clientes/CreatePago';
import AllPayForClient from './Clientes/AllPays';
import UserList from './Users/UserList';
import EditUserr from './Users/EditUser';
import DeleteU from './Users/DeleteUser';
import UserForm from './Users/UserForm';
import Casilleros from './lockers/casilleros';
import HistorialMembresiaForm from './Membresias/HistorialMembresia';
import ClienteMembresia from './Clientes/EditMenbresia';
import HistorialPagos from './Clientes/HistorialPagos';
import Vencimientos from './Clientes/Vencimientos';
import NotFound from './Redireccion/NotFound';
import Dashboard from './Dashboard/Panel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}> {/* Asegúrate de que el contenedor ocupe toda la altura */}
      {/* Sidebar de navegación */}
        <Sidebar />

        {/* Área de contenido principal */}
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}> {/* Asegúrate de que el área de contenido pueda desplazarse */}
        <ToastContainer />
        
          <Routes>     
          <Route path="/Inicio" element={<Dashboard />} />
    
          <Route path="/" element={<Login />} />
   
            <Route path="/Clientes" element={<ShowClientes />} />
            <Route path="/CreateClients" element={<CreateClients />} />
            <Route path="/Edit/:id" element={<EditClient />} />
            <Route path="/Eliminar" element={<DeleteClient />} />
            <Route path="/Pago" element={<Pago />} />
            <Route path="/ShowPagos" element={<ShowPagos />} />
            <Route path="/EditPagos/:id" element={<EditPago />} />

            <Route path="/ShowUser" element={<ShowUser />} />
            <Route path="/EditUser/:id" element={<EditUser />} />
            <Route path="/DeleteUser" element={<DeleteUser />} />
            <Route path="/CreateUser" element={<CreateUser />} />
            <Route path="/Locker" element={<Locker/>} />
            <Route path="/allPay/:id" element={<AllPayForClient />} />  {/* Nueva ruta */}
            <Route path="/allPay" element={<AllPayForClient />} />  {/* Nueva ruta */}
            <Route path="/Casilleros" element={<Casilleros />} />

            <Route path="/createPago" element={<CreatePago/>}/>
            <Route path="/userr" element={<UserList/>}/>
            <Route path="/create-user" element={<UserForm/>}/>

            <Route path="/editt/:id" element={<EditUserr />} />
            <Route path="/delete/:id" element={<DeleteU />} />

            <Route path="/menbresia/:id" element={<HistorialMembresiaForm />} />
            <Route path="/ClientMenbresia/:id" element={<ClienteMembresia />} />
            <Route path="/HistorialPag/:id" element={<HistorialPagos />} />
            <Route path="/Vencimientos" element={<Vencimientos />} />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
