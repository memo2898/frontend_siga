import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const transaccionesActivosHeaders: GridieHeaderConfig[] = [
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
    label: 'Cantidad',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Estado Anterior',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Estado Salida',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Estado Retorno',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Observacion',
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
