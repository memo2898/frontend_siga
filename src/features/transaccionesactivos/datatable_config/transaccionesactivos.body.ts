import type { TransaccionesActivos, TransaccionesActivosGridRow } from '../transaccionesactivos.types';

export interface TransaccionesActivosHandlers {
  onEdit: (transaccionesActivos: TransaccionesActivos) => void;
  onDelete: (transaccionesActivos: TransaccionesActivos) => void;
}

// Estilos inline para los botones de acción
const actionButtonStyles = `
  <style>
    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px;
      border: 1px solid transparent;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 105px;
    }

    .btn-action:not(:last-child) {
      margin-right: 8px;
    }

    .btn-action:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-action:active {
      transform: translateY(0);
    }

    .btn-action svg {
      flex-shrink: 0;
    }

    .btn-edit {
      color: #2563eb;
      border-color: #dbeafe;
      background: #eff6ff;
    }

    .btn-edit:hover {
      background: #dbeafe;
      border-color: #93c5fd;
    }

    .btn-edit:active {
      background: #bfdbfe;
    }

    .btn-delete {
      color: #dc2626;
      border-color: #fee2e2;
      background: #fef2f2;
    }

    .btn-delete:hover {
      background: #fee2e2;
      border-color: #fecaca;
    }

    .btn-delete:active {
      background: #fecaca;
    }

    @media (max-width: 768px) {
      .btn-action span {
        display: none;
      }

      .btn-action {
        padding: 8px;
        min-width: 36px;
      }
    }
  </style>
`;

export const toTransaccionesActivosGridRow = (transaccionesActivos: TransaccionesActivos, handlers: TransaccionesActivosHandlers): TransaccionesActivosGridRow => ({
  id: transaccionesActivos.id,
  transaccion_id: transaccionesActivos.transaccion_id,
  activo_id: transaccionesActivos.activo_id,
  cantidad: transaccionesActivos.cantidad,
  estado_anterior: transaccionesActivos.estado_anterior,
  estado_salida: transaccionesActivos.estado_salida,
  estado_retorno: transaccionesActivos.estado_retorno,
  observacion: transaccionesActivos.observacion,
  agregado_por: transaccionesActivos.agregado_por,
  agregado_en: transaccionesActivos.agregado_en,
  actualizado_por: transaccionesActivos.actualizado_por,
  actualizado_en: transaccionesActivos.actualizado_en,
  estado: transaccionesActivos.estado,
  actions: [
    {
      content: `
        ${actionButtonStyles}
        <button class="btn-action btn-edit" title="Editar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>Editar</span>
        </button>
      `,
      event: 'click',
      funct: () => handlers.onEdit(transaccionesActivos),
    },
    {
      content: `
        <button class="btn-action btn-delete" title="Eliminar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          <span>Eliminar</span>
        </button>
      `,
      event: 'click',
      funct: () => handlers.onDelete(transaccionesActivos),
    },
  ],
});

export const toTransaccionesActivosGridRows = (transaccionesActivos: TransaccionesActivos[], handlers: TransaccionesActivosHandlers): TransaccionesActivosGridRow[] =>
  transaccionesActivos.map((transaccionesActivos) => toTransaccionesActivosGridRow(transaccionesActivos, handlers));
