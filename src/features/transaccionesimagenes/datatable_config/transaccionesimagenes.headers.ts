import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const transaccionesImagenesHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
  },
  {
    label: 'Transaccion Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Activo Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Momento',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Tipo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Url',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Nombre Archivo',
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
    label: 'Orden',
    type: 'number',
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
