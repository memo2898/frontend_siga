import { InputX } from '../../../../lib/uiX';
import type { Activos } from '../../../activos/activos.types';
import type { Categorias } from '../../../categorias/categorias.types';
import './Components.css';

interface ActivoConEstado extends Activos {
  esSeleccionable: boolean;
}

interface ActivosGridProps {
  categoriaSeleccionada: Categorias | null;
  activos: ActivoConEstado[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedIds: Set<number>;
  onToggleActivo: (activo: Activos) => void;
}

const ESTADO_LABELS: Record<string, { label: string; color: string }> = {
  DISPONIBLE: { label: 'Disponible', color: '#22c55e' },
  ASIGNADO: { label: 'Asignado', color: '#f59e0b' },
  PRESTADO: { label: 'Prestado', color: '#3b82f6' },
  MANTENIMIENTO: { label: 'En mantenimiento', color: '#8b5cf6' },
  DESCARGADO: { label: 'Descargado', color: '#ef4444' },
};

export function ActivosGrid({
  categoriaSeleccionada,
  activos,
  loading,
  error,
  searchTerm,
  onSearchChange,
  selectedIds,
  onToggleActivo,
}: ActivosGridProps) {
  if (!categoriaSeleccionada) {
    return (
      <div className="activos-grid">
        <div className="activos-grid-placeholder">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p>Selecciona una categoria para ver sus activos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activos-grid">
      <div className="activos-grid-header">
        <span className="activos-grid-title">
          Activos de: <strong>{categoriaSeleccionada.nombre}</strong>
        </span>
        <span className="activos-grid-count">
          {activos.filter((a) => a.esSeleccionable).length} disponibles
        </span>
      </div>

      <div className="activos-grid-search">
        <InputX
          name="buscarActivo"
          placeholder="Buscar por codigo, marca o modelo..."
          defaultValue={searchTerm}
          onChange={(value) => onSearchChange(value as string)}
        />
      </div>

      {loading && (
        <div className="activos-grid-loading">Cargando activos...</div>
      )}

      {error && (
        <div className="activos-grid-error">{error}</div>
      )}

      {!loading && !error && (
        <div className="activos-grid-items">
          {activos.length === 0 ? (
            <div className="activos-grid-empty">
              No se encontraron activos en esta categoria
            </div>
          ) : (
            activos.map((activo) => {
              const isSelected = activo.id ? selectedIds.has(activo.id) : false;
              const estadoInfo = ESTADO_LABELS[activo.estado_activo || ''] || {
                label: activo.estado_activo || 'Desconocido',
                color: '#6b7280',
              };

              return (
                <div
                  key={activo.id}
                  className={`activo-grid-item ${isSelected ? 'activo-grid-item--selected' : ''} ${!activo.esSeleccionable ? 'activo-grid-item--disabled' : ''}`}
                  onClick={() => activo.esSeleccionable && onToggleActivo(activo)}
                >
                  <div className="activo-grid-item-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!activo.esSeleccionable}
                      readOnly
                    />
                  </div>
                  <div className="activo-grid-item-content">
                    <div className="activo-grid-item-main">
                      <span className="activo-grid-item-nombre">
                        {activo.marca} {activo.modelo}
                      </span>
                      <span
                        className="activo-grid-item-estado"
                        style={{ backgroundColor: estadoInfo.color }}
                      >
                        {estadoInfo.label}
                      </span>
                    </div>
                    <div className="activo-grid-item-meta">
                      <span>{activo.codigo_inventario_local || 'Sin codigo'}</span>
                      {activo.cantidad && activo.cantidad > 1 && (
                        <span>Cant: {activo.cantidad}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
