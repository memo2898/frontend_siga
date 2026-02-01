import { useState } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { useActivosDisponibles } from '../hooks/useActivosDisponibles';
import { InputX } from '../../../../lib/uiX';
import type { Activos } from '../../../activos/activos.types';
import type { ActivoSeleccionado } from '../types';
import './Steps.css';

export function Step2Activos() {
  const { state, dispatch, isDevolucion } = useTransaccionWizardContext();
  const [showForm, setShowForm] = useState(false);
  const [nuevoActivo, setNuevoActivo] = useState<Partial<Activos>>({});

  const { activos, loading, searchTerm, setSearchTerm, error } = useActivosDisponibles({
    soloDisponibles: state.tipoTransaccion === 'SALIDA',
    categoriasPermitidas: state.categoriasPermitidas,
  });

  const isEntrada = state.tipoTransaccion === 'ENTRADA';
  const isSalida = state.tipoTransaccion === 'SALIDA';

  // Verificar si un activo ya esta seleccionado
  const isSelected = (activoId: number | undefined) => {
    if (!activoId) return false;
    return state.activosSeleccionados.some((item) => item.activo.id === activoId);
  };

  // Agregar activo existente
  const handleAddActivo = (activo: Activos) => {
    if (isSelected(activo.id)) return;

    const nuevoItem: ActivoSeleccionado = {
      activo,
      cantidad: 1,
      isNew: false,
    };
    dispatch({ type: 'ADD_ACTIVO', payload: nuevoItem });
  };

  // Remover activo
  const handleRemoveActivo = (index: number) => {
    dispatch({ type: 'REMOVE_ACTIVO', payload: index });
  };

  // Actualizar cantidad
  const handleCantidadChange = (index: number, cantidad: number) => {
    dispatch({
      type: 'UPDATE_ACTIVO',
      payload: { index, updates: { cantidad } },
    });
  };

  // Agregar activo nuevo (solo para entradas)
  const handleAddNuevoActivo = () => {
    if (!nuevoActivo.marca || !nuevoActivo.modelo) return;

    const nuevoItem: ActivoSeleccionado = {
      activo: {
        ...nuevoActivo,
        id: undefined,
      } as Activos,
      cantidad: 1,
      isNew: true,
    };
    dispatch({ type: 'ADD_ACTIVO', payload: nuevoItem });
    setNuevoActivo({});
    setShowForm(false);
  };

  // Actualizar datos del acta CB
  const handleActaCBChange = (field: string, value: string) => {
    dispatch({
      type: 'SET_DATOS_ACTA_CB',
      payload: {
        ...state.datosActaCB,
        actaControlBienes: state.datosActaCB?.actaControlBienes || '',
        fechaActa: state.datosActaCB?.fechaActa || '',
        codigoCB: state.datosActaCB?.codigoCB || '',
        [field]: value,
      },
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">
          {isEntrada ? 'Registro de Activos' : 'Seleccion de Activos'}
        </h2>
        <p className="step-description">
          {isEntrada
            ? 'Registre los activos que ingresan al inventario'
            : 'Seleccione los activos que salen del inventario'}
        </p>
      </div>

      {/* Datos de Acta CB (solo para ingreso desde Control de Bienes) */}
      {state.subtipoEntrada === 'INGRESO_CB' && (
        <div className="step-section">
          <label className="step-label">Datos del Acta de Control de Bienes</label>
          <div className="step-form">
            <div className="step-form-row">
              <div className="step-form-group">
                <InputX
                  name="actaControlBienes"
                  label="Numero de Acta"
                  placeholder="Ej: CB-2026-001"
                  defaultValue={state.datosActaCB?.actaControlBienes}
                  onChange={(value) => handleActaCBChange('actaControlBienes', value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-form-group">
                <InputX
                  name="fechaActa"
                  label="Fecha del Acta"
                  type="date"
                  defaultValue={state.datosActaCB?.fechaActa}
                  onChange={(value) => handleActaCBChange('fechaActa', value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-form-group">
                <InputX
                  name="codigoCB"
                  label="Codigo CB"
                  placeholder="Ej: CB-2026-5678"
                  defaultValue={state.datosActaCB?.codigoCB}
                  onChange={(value) => handleActaCBChange('codigoCB', value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buscador de activos (para salidas o devoluciones) */}
      {(isSalida || isDevolucion()) && (
        <div className="step-section">
          <label className="step-label">Buscar Activos Disponibles</label>
          <div className="activos-search">
            <InputX
              name="buscarActivo"
              placeholder="Buscar por codigo, marca o modelo..."
              defaultValue={searchTerm}
              onChange={(value) => setSearchTerm(value as string)}
            />
          </div>

          {loading && <p style={{ color: '#64748b' }}>Buscando...</p>}
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}

          <div className="activos-lista">
            {activos.map((activo) => (
              <div
                key={activo.id}
                className={`activo-item ${isSelected(activo.id) ? 'selected' : ''}`}
                onClick={() => handleAddActivo(activo)}
              >
                <input
                  type="checkbox"
                  className="activo-item-checkbox"
                  checked={isSelected(activo.id)}
                  readOnly
                />
                <div className="activo-item-info">
                  <span className="activo-item-nombre">
                    {activo.marca} {activo.modelo}
                  </span>
                  <span className="activo-item-meta">
                    {activo.codigo_inventario_local || 'Sin codigo'} |
                    Cantidad: {activo.cantidad || 1} |
                    Estado: {activo.estado_activo}
                  </span>
                </div>
              </div>
            ))}
            {activos.length === 0 && !loading && (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>
                No se encontraron activos
              </p>
            )}
          </div>
        </div>
      )}

      {/* Formulario para nuevo activo (solo para entradas que no son devoluciones) */}
      {isEntrada && !isDevolucion() && (
        <div className="step-section">
          {!showForm ? (
            <div className="persona-form-toggle">
              <button
                type="button"
                className="persona-form-toggle-btn"
                onClick={() => setShowForm(true)}
              >
                + Agregar Nuevo Activo
              </button>
            </div>
          ) : (
            <div className="step-form" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 1rem', color: '#334155' }}>Nuevo Activo</h4>
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="marca"
                    label="Marca"
                    placeholder="Ej: Samsung"
                    defaultValue={nuevoActivo.marca}
                    onChange={(value) => setNuevoActivo({ ...nuevoActivo, marca: value as string })}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="modelo"
                    label="Modelo"
                    placeholder="Ej: Galaxy S23"
                    defaultValue={nuevoActivo.modelo}
                    onChange={(value) => setNuevoActivo({ ...nuevoActivo, modelo: value as string })}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="unidad_medida"
                    label="Unidad de Medida"
                    placeholder="Ej: UNIDAD"
                    defaultValue={nuevoActivo.unidad_medida}
                    onChange={(value) => setNuevoActivo({ ...nuevoActivo, unidad_medida: value as string })}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="observaciones"
                    label="Observaciones"
                    placeholder="Observaciones adicionales..."
                    defaultValue={nuevoActivo.observaciones}
                    onChange={(value) => setNuevoActivo({ ...nuevoActivo, observaciones: value as string })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="resumen-btn resumen-btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setNuevoActivo({});
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="resumen-btn resumen-btn-primary"
                  onClick={handleAddNuevoActivo}
                  disabled={!nuevoActivo.marca || !nuevoActivo.modelo}
                >
                  Agregar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de activos seleccionados */}
      {state.activosSeleccionados.length > 0 && (
        <div className="step-section activos-seleccionados">
          <div className="activos-seleccionados-header">
            <span className="activos-seleccionados-title">Activos Seleccionados</span>
            <span className="activos-seleccionados-count">
              {state.activosSeleccionados.length} item(s)
            </span>
          </div>
          <div className="activos-lista">
            {state.activosSeleccionados.map((item, index) => (
              <div key={index} className="activo-item selected">
                <div className="activo-item-info">
                  <span className="activo-item-nombre">
                    {item.activo.marca} {item.activo.modelo}
                    {item.isNew && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        background: '#22c55e',
                        color: '#fff',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem'
                      }}>
                        Nuevo
                      </span>
                    )}
                  </span>
                  <span className="activo-item-meta">
                    {item.activo.codigo_inventario_local || 'Sin codigo'}
                  </span>
                </div>
                <div className="activo-item-cantidad">
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => handleCantidadChange(index, parseInt(e.target.value) || 1)}
                  />
                  <button
                    type="button"
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleRemoveActivo(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errores */}
      {state.errors['step_1'] && state.errors['step_1'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_1'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
