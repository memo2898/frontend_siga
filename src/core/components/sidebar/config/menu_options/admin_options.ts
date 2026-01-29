// ============================================
// MENÚ PARA ADMINISTRADOR - Módulos separados
// ============================================

export const ADMIN_OPTIONS = [
  {
    id: 'dashboard',
    icon: 'fas fa-home',
    text: 'Dashboard',
    active: true,
    href: '/dashboard'
  },

 

  // ============================================
  // GESTIÓN DE PERSONAS
  // ============================================
  {
    id: 'personas',
    icon: 'fas fa-users',
    text: 'Personas',
    submenu: [
      { text: 'Gestión de Personas', href: '/personas', icon: 'fas fa-users' },
      { text: 'Tipos de Documentos', href: '/personas/tipos-documentos', icon: 'fas fa-id-card' },
    ]
  },

  // ============================================
  // INVENTARIO Y ACTIVOS
  // ============================================
  {
    id: 'inventario',
    icon: 'fas fa-boxes',
    text: 'Inventario',
    submenu: [
      { text: 'Activos', href: '/inventario/activos', icon: 'fas fa-list' },
      { text: 'Categorías', href: '/inventario/categorias', icon: 'fas fa-tags' },
      { text: 'Almacenes', href: '/inventario/almacenes', icon: 'fas fa-warehouse' },
    ]
  },

  // ============================================
  // MÓDULOS DE GESTIÓN DINÁMICA
  // ============================================
  {
    id: 'modulos',
    icon: 'fas fa-th-large',
    text: 'Módulos',
    submenu: [
      { 
        text: 'Ver Módulos', 
        href: '/modulos', 
        icon: 'fas fa-eye',
        description: 'Visualizar y usar módulos activos'
      },
      { 
        text: 'Gestión de Módulos', 
        href: '/modulos/gestion', 
        icon: 'fas fa-cogs',
        description: 'Crear, editar y configurar módulos'
      },
    ]
  },

  // ============================================
  // TRANSACCIONES
  // ============================================
  {
    id: 'transacciones',
    icon: 'fas fa-exchange-alt',
    text: 'Transacciones',
    submenu: [
      { text: 'Todas las Transacciones', href: '/transacciones', icon: 'fas fa-list' },
      { 
        text: 'Entradas', 
        href: '/transacciones/entradas', 
        icon: 'fas fa-arrow-down',
      },
      { 
        text: 'Salidas', 
        href: '/transacciones/salidas', 
        icon: 'fas fa-arrow-up',
        submenu: [
          { text: 'Asignaciones', href: '/transacciones/salidas/asignaciones' },
          { text: 'Préstamos', href: '/transacciones/salidas/prestamos' },
          { text: 'Descargos', href: '/transacciones/salidas/descargos' },
        ]
      },
      { 
        text: 'Devoluciones', 
        href: '/transacciones/devoluciones', 
        icon: 'fas fa-undo',
      },
      { text: 'Pendientes de Devolución', href: '/transacciones/pendientes', icon: 'fas fa-clock' },
    ]
  },

  // ============================================
  // REPORTES Y ANÁLISIS
  // ============================================
  {
    id: 'reportes',
    icon: 'fas fa-chart-bar',
    text: 'Reportes',
    submenu: [
      { text: 'Dashboard de Reportes', href: '/reportes', icon: 'fas fa-chart-line' },
      { text: 'Stock por Categoría', href: '/reportes/stock-categoria', icon: 'fas fa-boxes' },
      { text: 'Activos por Estado', href: '/reportes/activos-estado', icon: 'fas fa-info-circle' },
      { text: 'Historial de Transacciones', href: '/reportes/historial', icon: 'fas fa-history' },
      { text: 'Activos Descargados', href: '/reportes/descargados', icon: 'fas fa-trash-alt' },
      { text: 'Préstamos Vencidos', href: '/reportes/prestamos-vencidos', icon: 'fas fa-exclamation-triangle' },
    ]
  },

  // ============================================
  // TEMPLATES Y DOCUMENTOS
  // ============================================
  {
    id: 'templates',
    icon: 'fas fa-file-alt',
    text: 'Templates',
    href: '/templates'
  },




   // ============================================
  // GESTIÓN ORGANIZACIONAL
  // ============================================
  {
    id: 'organizacion',
    icon: 'fas fa-building',
    text: 'Organización',
    submenu: [
      { text: 'Sedes', href: '/organizacion/sedes', icon: 'fas fa-map-marker-alt' },
      { text: 'Direcciones', href: '/organizacion/direcciones', icon: 'fas fa-sitemap' },
      { text: 'Departamentos', href: '/organizacion/departamentos', icon: 'fas fa-users-cog' },
    ]
  },

  
  // ============================================
  // USUARIOS Y SEGURIDAD
  // ============================================
  {
    id: 'usuarios',
    icon: 'fas fa-users-cog',
    text: 'Usuarios',
    submenu: [
      { text: 'Gestión de Usuarios', href: '/usuarios', icon: 'fas fa-users' },
      { text: 'Roles y Permisos', href: '/usuarios/roles', icon: 'fas fa-user-shield' },
      { text: 'Auditoría', href: '/usuarios/auditoria', icon: 'fas fa-clipboard-list' },
    ]
  },

  // ============================================
  // CONFIGURACIÓN DEL SISTEMA
  // ============================================
  {
    id: 'configuracion',
    icon: 'fas fa-cog',
    text: 'Configuración',
    href: '/configuracion'
  },

  // ============================================
  // NOTIFICACIONES
  // ============================================
  {
    id: 'notificaciones',
    icon: 'fas fa-bell',
    text: 'Notificaciones',
    href: '/notificaciones',
    badge: 0
  }
];