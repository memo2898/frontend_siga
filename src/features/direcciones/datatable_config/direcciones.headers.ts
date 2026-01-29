import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const direccionesHeaders: GridieHeaderConfig[] = [
  // {
  //   label: 'Id',
  //   type: 'number',
  //   sortable: true,
  //   width: '80px',
  // },
  // {
  //   label: 'Sede Id',
  //   type: 'number',
  //   sortable: true,
  // },
  {
    label: 'Sede',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Nombre',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
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
