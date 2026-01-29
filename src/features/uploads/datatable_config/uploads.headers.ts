import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const uploadsHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
  },
  {
    label: 'Filename',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Acciones',
    width: '120px',
  },
];
