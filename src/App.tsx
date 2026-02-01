import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import NotFound from "./pages/404/NotFound";

import SidebarWrapper from './core/components/sidebar/SidebarWrapper';
import Lobby from './pages/lobby/Lobby';
import SedesPage from './pages/organizacion/sedes/SedesPage';
import DireccionesPage from './pages/organizacion/direcciones/DireccionesPage';
import DepartamentosPage from './pages/organizacion/departamentos/DepartamentosPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';
import TemplatesInventarioPage from './pages/templates/TemplatesInventarioPage';
import TemplatesModuloPage from './pages/templates/TemplatesModuloPage';
import TemplateBuilderPage from './pages/templateBuilderPage/TemplateBuilderPage';
import EntradaSalida from './pages/entrada_salida/EntradaSalida';
import ActivosPage from './pages/activos/ActivosPage';


const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/lobby" element={<Lobby/>} /> {/* Elegirems el perfil con el que se logueará el usuario */}

      <Route path="template-builder-inventarios/:id" element={<TemplateBuilderPage builderType ='inventario'/>} />
      <Route path="template-builder-modulos/:id" element={<TemplateBuilderPage builderType ='modulos'/>} />
      {/* Rutas con Sidebar */}
      <Route element={<SidebarWrapper />}>

        <Route path="/dashboard" element={<h1>Dashboard</h1>} />


        {/* PAGINAS DEL INVENTARIO START */}
        <Route path="/inventario/entrada_salida" element={<EntradaSalida/>} />
        <Route path="/inventario/activos" element={<ActivosPage/>} />
        {/* PAGINAS DEL INVENTARIO END */}


       {/* PAGINAS DE ORGANIZACION START */}
          <Route path="organizacion/sedes" element={<SedesPage/>} />
          <Route path="organizacion/direcciones" element={<DireccionesPage/>} />
          <Route path="organizacion/departamentos" element={<DepartamentosPage/>} />
       {/* PAGINAS DE ORGANIZACION END */}

     
     
          <Route path="usuarios" element={<UsuariosPage/>} />
          <Route path="templates/inventario" element={<TemplatesInventarioPage/>} />
          <Route path="templates/modulos" element={<TemplatesModuloPage/>} />
         


      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

