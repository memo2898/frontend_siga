import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import NotFound from "./pages/404/NotFound";

import SidebarWrapper from './core/components/sidebar/SidebarWrapper';

const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas con Sidebar */}
      <Route element={<SidebarWrapper />}>

        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/datasets" element={<h1>Inventario General</h1>} />
        <Route path="/activos-fijos" element={<h1>Activos Fijos</h1>} />
        <Route path="/equipos" element={<h1>Equipos</h1>} />
        <Route path="/usuarios" element={<h1>Usuarios</h1>} />
        <Route path="/roles" element={<h1>Roles y Permisos</h1>} />
        <Route path="/reportes" element={<h1>Reportes</h1>} />
        <Route path="/configuracion" element={<h1>Configuración</h1>} />
        <Route path="/mi-perfil" element={<h1>Mi Perfil</h1>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

