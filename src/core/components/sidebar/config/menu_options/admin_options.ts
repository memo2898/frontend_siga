// ============================================
// MENÚ PARA ADMINISTRADOR - Acceso Total
// ============================================



export const ADMIN_OPTIONS = [
  {
    id: 'dashboard',
    icon: 'fas fa-home',
    text: 'Dashboard',
    active: true,
    href: '/dashboard'
  },
  {
    id: 'datasets',
    icon: 'fas fa-database',
    text: 'Inventario de Datos',
    submenu: [
      { text: 'Inventario General', href: '/datasets' },
      { text: 'Activos Fijos', href: '/activos-fijos' },
      { text: 'Equipos', href: '/equipos' },
    ]
  },
  {
    id: 'usuarios',
    icon: 'fas fa-users',
    text: 'Usuarios',
    submenu: [
      { text: 'Lista de Usuarios', href: '/usuarios' },
      { text: 'Roles y Permisos', href: '/roles' },
    ]
  },
  {
    id: 'reportes',
    icon: 'fas fa-chart-bar',
    text: 'Reportes',
    href: '/reportes'
  },
  {
    id: 'configuracion',
    icon: 'fas fa-cog',
    text: 'Configuración',
    href: '/configuracion'
  },
  
  
  
  // Seguridad y Auditoría
  // {
  //   id: 'seguridad',
  //   icon: 'fas fa-shield-alt',
  //   text: 'Seguridad y Auditoría',
  //   href: route('#'),
  //   submenu: [
  //     { text: 'Sesiones de Usuarios', href: route('/sesiones-usuarios'), icon: 'fas fa-clock' },
  //     { text: 'Logs de Auditoría', href: route('/logs-auditoria'), icon: 'fas fa-clipboard-list' }
  //   ]
  // },
  
  // Reportes
  // {
  //   id: 'reportes',
  //   icon: 'fas fa-chart-bar',
  //   text: 'Reportes',
  //   href: route('/reportes')
  // },
  
  // Notificaciones
  // {
  //   id: 'notificaciones',
  //   icon: 'fas fa-bell',
  //   text: 'Notificaciones',
  //   href: route('/notificaciones'),
  //   badge: 0
  // }
];