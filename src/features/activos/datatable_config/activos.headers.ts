import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const activosHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
  },
  {
    label: 'Codigo Inventario Local',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Codigo Inventario Control Bienes',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Marca',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Modelo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Categoria Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Almacen Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Estado Activo',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Cantidad',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Unidad Medida',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Atributos',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Fecha Ingreso',
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
