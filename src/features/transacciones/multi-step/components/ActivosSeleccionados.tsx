import type { ActivoSeleccionado } from '../types';
import './Components.css';

interface ActivosSeleccionadosProps {
  activos: ActivoSeleccionado[];
  onRemove: (index: number) => void;
  onUpdateCantidad: (index: number, cantidad: number) => void;
  onUpdateObservacion?: (index: number, observacion: string) => void;
  readOnly?: boolean;
  showCategoria?: boolean;
}

export function ActivosSeleccionados({
  activos,
  onRemove,
  onUpdateCantidad,
  onUpdateObservacion,
  readOnly = false,
  showCategoria = false,
}: ActivosSeleccionadosProps) {
  if (activos.length === 0) {
    return null;
  }

  return (
    <div className="activos-seleccionados">
      <div className="activos-seleccionados-header">
        <span className="activos-seleccionados-title">
          {readOnly ? 'Activos a devolver' : 'Activos seleccionados'}
        </span>
        <span className="activos-seleccionados-count">{activos.length} item(s)</span>
      </div>

      <div className="activos-seleccionados-list">
        {activos.map((item, index) => (
          <div key={index} className="activo-seleccionado-item">
            <div className="activo-seleccionado-info">
              <div className="activo-seleccionado-main">
                <span className="activo-seleccionado-nombre">
                  {item.activo.marca} {item.activo.modelo}
                </span>
                {item.isNew && (
                  <span className="activo-seleccionado-badge activo-seleccionado-badge--new">
                    Nuevo
                  </span>
                )}
              </div>
              <div className="activo-seleccionado-meta">
                <span>{item.activo.codigo_inventario_local || 'Sin codigo'}</span>
                {showCategoria && item.activo.categoria_id && (
                  <span>Cat. ID: {item.activo.categoria_id}</span>
                )}
              </div>
            </div>

            {!readOnly && (
              <div className="activo-seleccionado-controls">
                <div className="activo-seleccionado-cantidad">
                  <label>Cant:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => onUpdateCantidad(index, parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  type="button"
                  className="activo-seleccionado-remove"
                  onClick={() => onRemove(index)}
                  title="Quitar activo"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {readOnly && (
              <div className="activo-seleccionado-cantidad-readonly">
                Cantidad: {item.cantidad}
              </div>
            )}

            {/* Campo de observación opcional */}
            {onUpdateObservacion && !readOnly && (
              <div className="activo-seleccionado-observacion">
                <input
                  type="text"
                  placeholder="Observacion (opcional)..."
                  value={item.observacion || ''}
                  onChange={(e) => onUpdateObservacion(index, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="activos-seleccionados-footer">
        <span>
          Total: {activos.reduce((sum, item) => sum + item.cantidad, 0)} unidad(es)
        </span>
      </div>
    </div>
  );
}
