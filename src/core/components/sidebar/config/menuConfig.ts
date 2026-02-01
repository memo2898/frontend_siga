/* eslint-disable @typescript-eslint/no-explicit-any */
// config/menuConfig.ts
//import { doLogout } from '../global/logOut';
//import { getGlobalUserData } from '../global/myUserData';
import { ADMIN_OPTIONS } from './menu_options/admin_options.ts';


export const getMenuConfig = () => {
  //const userData = getGlobalUserData().data.user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userData = {}
  //const empleadoData = {}
  //const empleadoData = getGlobalUserData().data.empleado;


  //const rol = userData.role.nombre_rol.toLowerCase();
  const rol = 'admin' // Temporal para desarrollo
  //const nombreORusername = empleadoData[0]?.nombre_completo || userData.username;
  const nombreORusername = 'Manuel'

  let mainItems:any = [];

  mainItems = ADMIN_OPTIONS;
  if (rol.includes('admin')) {
    mainItems = ADMIN_OPTIONS;
  }

      
//    else if (rol.includes('director')) {
//     mainItems = DIRECTOR_OPTIONS;
//   } else if (rol.includes('líder de datos')) {
//     mainItems = DATA_LEADERSHIP_OPTIONS;
//   } else if (rol.includes('custodio')) {
//     mainItems = DATA_CUSTODIO;
//   }

  return {
    header: {
      title: 'Alcaldía Distrito Nacional',
      subtitle: 'Sistema Integral de Gestión de Activos'
    },
    mainItems,
    profileItem: {
      id: 'profile',
      name: nombreORusername || 'Usuario',
      rol: rol,
      avatar: 'M', // Inicial temporal para desarrollo
      href: '/mi-perfil'
    },
    bottomItems: [
      {
        id: 'logout',
        icon: 'fas fa-sign-out-alt',
        text: 'Cerrar Sesión',
        href: '#',
        onclick: ()=>{
            alert('...')
        }
      }
    ]
  };
};