import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const usuariosHeaders: GridieHeaderConfig[] = [
  // {
  //   label: 'Id',
  //   type: 'number',
  //   sortable: true,
  //   width: '80px',
  // },
  {
    label: 'Nombre',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Apellido',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Username',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Email',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Password Hash',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Avatar Url',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Ultimo Acceso',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Intentos Fallidos',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Bloqueado Hasta',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Debe Cambiar Password',
    type: 'boolean',
    sortable: true,
  },
  {
    label: 'Fecha Ultimo Cambio Password',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Agregado Por',
    type: 'number',
    sortable: true,
    width: '120px',
  },
  {
    label: 'Agregado En',
    type: 'string',
    sortable: true,
    width: '140px',
  },
  {
    label: 'Actualizado Por',
    type: 'number',
    sortable: true,
    width: '120px',
  },
  {
    label: 'Actualizado En',
    type: 'string',
    sortable: true,
    width: '140px',
  },
  {
    label: 'Estado',
    type: 'string',
    sortable: true,
    width: '100px',
    filters: {
      headerFilter: { visible: true, showCount: true },
    },
  },
  {
    label: 'Acciones',
    width: '120px',
  },
];
