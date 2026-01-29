import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const modulosHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
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
    label: 'Descripcion',
    type: 'string',
    sortable: true,
    filters: {
      filterRow: { visible: true },
    },
  },
  {
    label: 'Permite Asignacion',
    type: 'boolean',
    sortable: true,
  },
  {
    label: 'Permite Prestamo',
    type: 'boolean',
    sortable: true,
  },
  {
    label: 'Permite Descargo',
    type: 'boolean',
    sortable: true,
  },
  {
    label: 'Template Entrega Id',
    type: 'number',
    sortable: true,
    width: '140px',
  },
  {
    label: 'Template Recibo Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Template Descargo Id',
    type: 'number',
    sortable: true,
  },
  {
    label: 'Configuracion',
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
