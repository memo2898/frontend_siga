import { useState } from 'react';
import { useAlmacenDetalle } from '../hooks/useAlmacenDetalle';
import type { ActivoDetalle } from '../almacenes.types';
import './AlmacenDetalle.css';

export function AlmacenDetalle() {
  const { detalle, loading, error, fetch, filters } = useAlmacenDetalle({
    defaultFilters: { unitariosLimit: 10, unitariosPage: 1, cantidadLimit: 10, cantidadPage: 1 }
  });

  const [unitariosPage, setUnitariosPage] = useState(1);
  const [cantidadPage, setCantidadPage] = useState(1);

  if (loading && !detalle) {
    return <div className="almacen-detalle-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="almacen-detalle-error">{error}</div>;
  }

  if (!detalle) {
    return <div className="almacen-detalle-empty">No se encontró el almacén</div>;
  }

  const { almacen, sede, estadisticas, activosUnitarios, activosCantidad } = detalle;

  const handleUnitariosPageChange = (newPage: number) => {
    setUnitariosPage(newPage);
    fetch({ ...filters, unitariosPage: newPage });
  };

  const handleCantidadPageChange = (newPage: number) => {
    setCantidadPage(newPage);
    fetch({ ...filters, cantidadPage: newPage });
  };

  const renderActivoRow = (activo: ActivoDetalle, isCantidad = false) => (
    <tr key={activo.id}>
      <td>{activo.codigo_inventario_local}</td>
      <td>{activo.marca || '-'}</td>
      <td>{activo.modelo || '-'}</td>
      <td>
        <span className={`estado-badge estado-${activo.estado_activo?.toLowerCase().replace(/\s/g, '-')}`}>
          {activo.estado_activo}
        </span>
      </td>
      {isCantidad && (
        <>
          <td>{activo.cantidad}</td>
          <td>{activo.unidad_medida || '-'}</td>
        </>
      )}
    </tr>
  );

  const renderPagination = (
    meta: { page: number; totalPages: number; hasNext: boolean; hasPrev: boolean },
    currentPage: number,
    onPageChange: (page: number) => void
  ) => (
    <div className="activos-pagination">
      <button
        disabled={!meta.hasPrev}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>
      <span>Página {meta.page} de {meta.totalPages || 1}</span>
      <button
        disabled={!meta.hasNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );

  return (
    <div className="almacen-detalle">
      <div className="almacen-detalle-header">
        <h1>{almacen.nombre}</h1>
        <span className={`estado-badge estado-${almacen.estado.toLowerCase()}`}>
          {almacen.estado}
        </span>
      </div>

      <div className="almacen-detalle-grid">
        <section className="almacen-info-card">
          <h2>Información del Almacén</h2>
          <dl>
            <dt>ID</dt>
            <dd>{almacen.id}</dd>
            <dt>Ubicación</dt>
            <dd>{almacen.ubicacion}</dd>
            <dt>Agregado en</dt>
            <dd>{new Date(almacen.agregado_en).toLocaleDateString()}</dd>
            {almacen.actualizado_en && (
              <>
                <dt>Actualizado en</dt>
                <dd>{new Date(almacen.actualizado_en).toLocaleDateString()}</dd>
              </>
            )}
          </dl>
        </section>

        <section className="almacen-info-card">
          <h2>Sede</h2>
          <dl>
            <dt>Nombre</dt>
            <dd>{sede.nombre}</dd>
            <dt>Dirección</dt>
            <dd>{sede.direccion_fisica}</dd>
          </dl>
        </section>

        <section className="almacen-info-card estadisticas">
          <h2>Estadísticas</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{estadisticas.totalActivos}</span>
              <span className="stat-label">Total Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estadisticas.activosDisponibles}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estadisticas.activosAsignados}</span>
              <span className="stat-label">Asignados</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estadisticas.activosPrestados}</span>
              <span className="stat-label">Prestados</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estadisticas.activosMantenimiento}</span>
              <span className="stat-label">En Mantenimiento</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{estadisticas.activosDescargados}</span>
              <span className="stat-label">Descargados</span>
            </div>
          </div>
          <div className="stats-summary">
            <div className="stat-item highlight">
              <span className="stat-value">
                {estadisticas.valorTotal.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}
              </span>
              <span className="stat-label">Valor Total</span>
            </div>
            {estadisticas.alertasStockBajo > 0 && (
              <div className="stat-item warning">
                <span className="stat-value">{estadisticas.alertasStockBajo}</span>
                <span className="stat-label">Alertas Stock Bajo</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="almacen-activos-section">
        <section className="almacen-info-card activos-table-card">
          <h2>Activos Unitarios ({activosUnitarios.meta.total})</h2>
          {activosUnitarios.data.length > 0 ? (
            <>
              <table className="activos-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {activosUnitarios.data.map(activo => renderActivoRow(activo))}
                </tbody>
              </table>
              {renderPagination(activosUnitarios.meta, unitariosPage, handleUnitariosPageChange)}
            </>
          ) : (
            <p className="no-data">No hay activos unitarios en este almacén</p>
          )}
        </section>

        <section className="almacen-info-card activos-table-card">
          <h2>Activos por Cantidad ({activosCantidad.meta.total})</h2>
          {activosCantidad.data.length > 0 ? (
            <>
              <table className="activos-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Estado</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {activosCantidad.data.map(activo => renderActivoRow(activo, true))}
                </tbody>
              </table>
              {renderPagination(activosCantidad.meta, cantidadPage, handleCantidadPageChange)}
            </>
          ) : (
            <p className="no-data">No hay activos por cantidad en este almacén</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default AlmacenDetalle;
