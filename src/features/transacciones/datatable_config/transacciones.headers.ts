import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const transaccionesHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
  },
  {
    label: 'Codigo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Modulo Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Persona Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Tipo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Tipo Salida',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Fecha',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Usuario Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Rol Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Fecha Devolucion Esperada',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Fecha Devolucion Real',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Motivo Descargo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Comentario Descargo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Metadata',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Estado Transaccion',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Observaciones',
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
