import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const templatesInventariosHeaders: GridieHeaderConfig[] = [
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
    label: 'Descripcion',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Tipo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Tipo Entrada',
    type: 'string',
    sortable: true,
    width: '140px',
  },
  {
    label: 'Tipo Salida',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Is Default',
    type: 'boolean',
    sortable: true,
  },
  // {
  //   label: 'Contenido Hbs',
  //   type: 'string',
  //   sortable: true,
  // },
  // {
  //   label: 'Variables Utilizadas',
  //   type: 'string',
  //   sortable: true,
  // },
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
