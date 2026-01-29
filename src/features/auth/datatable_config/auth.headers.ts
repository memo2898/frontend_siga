import type { GridieHeaderConfig } from '../../../lib/gridie-react';

export const authHeaders: GridieHeaderConfig[] = [
  {
    label: 'Id',
    type: 'number',
    sortable: true,
    width: '80px',
  },
  {
    label: 'Username',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Password',
    type: 'string',
    sortable: true,
  },
  {
    label: 'Acciones',
    width: '120px',
  },
];
