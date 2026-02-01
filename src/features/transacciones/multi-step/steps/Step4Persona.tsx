import { useState } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { usePersonaBusqueda } from '../hooks/usePersonaBusqueda';
import { InputX, SelectX } from '../../../../lib/uiX';
import { MOTIVOS_DESCARGO, type PersonaTransaccion } from '../types';
import './Steps.css';

export function Step4Persona() {
  const { state, dispatch, requiresFechaDevolucion, requiresMotivoDescargo } = useTransaccionWizardContext();
  const { personas, loading, searchTerm, setSearchTerm, buscarPorDocumento, clearResults } = usePersonaBusqueda();

  const [showForm, setShowForm] = useState(false);
  const [nuevaPersona, setNuevaPersona] = useState<Partial<PersonaTransaccion>>({});
  const [searchByDoc, setSearchByDoc] = useState('');

  const isEntrada = state.tipoTransaccion === 'ENTRADA';

  // Seleccionar persona existente
  const handleSelectPersona = (persona: PersonaTransaccion) => {
    dispatch({ type: 'SET_PERSONA', payload: { ...persona, isNew: false } });
    clearResults();
  };

  // Cambiar persona seleccionada
  const handleChangePersona = () => {
    dispatch({ type: 'SET_PERSONA', payload: null });
  };

  // Agregar nueva persona
  const handleAddNuevaPersona = () => {
    if (!nuevaPersona.nombre || !nuevaPersona.numero_documento) return;

    dispatch({
      type: 'SET_PERSONA',
      payload: {
        ...nuevaPersona,
        isNew: true,
      } as PersonaTransaccion,
    });
    setNuevaPersona({});
    setShowForm(false);
  };

  // Buscar por documento
  const handleSearchByDoc = async () => {
    if (searchByDoc.length >= 3) {
      await buscarPorDocumento(searchByDoc);
    }
  };

  // Cambiar fecha de devolucion
  const handleFechaDevolucionChange = (value: string) => {
    dispatch({ type: 'SET_FECHA_DEVOLUCION', payload: value });
  };

  // Cambiar motivo de descargo
  const handleMotivoDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: value as any,
        comentario: state.comentarioDescargo,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  // Cambiar comentario de descargo
  const handleComentarioDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: value,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  // Cambiar documento de aprobacion
  const handleDocumentoAprobacionChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: state.comentarioDescargo,
        documento: value,
      },
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">
          {isEntrada ? 'Datos del Solicitante' : 'Datos del Receptor'}
        </h2>
        <p className="step-description">
          {isEntrada
            ? 'Identifique quien entrega o devuelve el activo'
            : 'Identifique a quien se entrega el activo'}
        </p>
      </div>

      {/* Persona ya seleccionada */}
      {state.persona && (
        <div className="step-section">
          <div className="persona-selected">
            <div className="persona-selected-info">
              <span className="persona-selected-nombre">{state.persona.nombre}</span>
              <span className="persona-selected-documento">
                Doc: {state.persona.numero_documento}
                {state.persona.cargo && ` | ${state.persona.cargo}`}
              </span>
            </div>
            <button
              type="button"
              className="persona-selected-change"
              onClick={handleChangePersona}
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {/* Busqueda de persona */}
      {!state.persona && !showForm && (
        <>
          <div className="step-section">
            <label className="step-label">Buscar por Documento</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <InputX
                  name="buscarDocumento"
                  placeholder="Numero de documento..."
                  defaultValue={searchByDoc}
                  onChange={(value) => setSearchByDoc(value as string)}
                />
              </div>
              <button
                type="button"
                className="resumen-btn resumen-btn-primary"
                onClick={handleSearchByDoc}
                disabled={searchByDoc.length < 3 || loading}
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="step-section">
            <label className="step-label">O buscar por Nombre</label>
            <InputX
              name="buscarNombre"
              placeholder="Escriba al menos 3 caracteres..."
              defaultValue={searchTerm}
              onChange={(value) => setSearchTerm(value as string)}
            />
          </div>

          {/* Resultados de busqueda */}
          {loading && <p style={{ color: '#64748b' }}>Buscando...</p>}

          {personas.length > 0 && (
            <div className="step-section">
              <label className="step-label">Resultados</label>
              <div className="persona-search-results">
                {personas.map((persona) => (
                  <div
                    key={persona.id}
                    className="persona-result-item"
                    onClick={() => handleSelectPersona(persona as PersonaTransaccion)}
                  >
                    <div className="persona-result-info">
                      <span className="persona-result-nombre">{persona.nombre}</span>
                      <span className="persona-result-documento">
                        {persona.numero_documento}
                        {persona.cargo && ` | ${persona.cargo}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boton para nueva persona */}
          <div className="persona-form-toggle">
            <button
              type="button"
              className="persona-form-toggle-btn"
              onClick={() => setShowForm(true)}
            >
              + Registrar Nueva Persona
            </button>
          </div>
        </>
      )}

      {/* Formulario de nueva persona */}
      {!state.persona && showForm && (
        <div className="step-section">
          <div
            className="step-form"
            style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.375rem' }}
          >
            <h4 style={{ margin: '0 0 1rem', color: '#334155' }}>Nueva Persona</h4>
            <div className="step-form-row">
              <div className="step-form-group">
                <InputX
                  name="nombre"
                  label="Nombre Completo"
                  placeholder="Nombre y apellidos"
                  defaultValue={nuevaPersona.nombre}
                  onChange={(value) => setNuevaPersona({ ...nuevaPersona, nombre: value as string })}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-form-group">
                <InputX
                  name="numero_documento"
                  label="Numero de Documento"
                  placeholder="Cedula o pasaporte"
                  defaultValue={nuevaPersona.numero_documento}
                  onChange={(value) => setNuevaPersona({ ...nuevaPersona, numero_documento: value as string })}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
            </div>
            <div className="step-form-row">
              <div className="step-form-group">
                <InputX
                  name="cargo"
                  label="Cargo"
                  placeholder="Cargo en la institucion"
                  defaultValue={nuevaPersona.cargo}
                  onChange={(value) => setNuevaPersona({ ...nuevaPersona, cargo: value as string })}
                />
              </div>
              <div className="step-form-group">
                <InputX
                  name="telefono"
                  label="Telefono"
                  placeholder="809-000-0000"
                  defaultValue={nuevaPersona.telefono}
                  onChange={(value) => setNuevaPersona({ ...nuevaPersona, telefono: value as string })}
                />
              </div>
            </div>
            <div className="step-form-row">
              <div className="step-form-group">
                <InputX
                  name="correo"
                  label="Correo Electronico"
                  placeholder="correo@ejemplo.com"
                  defaultValue={nuevaPersona.correo}
                  onChange={(value) => setNuevaPersona({ ...nuevaPersona, correo: value as string })}
                  rules={{
                    validations: [{ type: 'email', message: 'Email invalido' }],
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="resumen-btn resumen-btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setNuevaPersona({});
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="resumen-btn resumen-btn-primary"
                onClick={handleAddNuevaPersona}
                disabled={!nuevaPersona.nombre || !nuevaPersona.numero_documento}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campos adicionales segun tipo de salida */}
      {state.persona && (
        <>
          {/* Fecha de devolucion para prestamos */}
          {requiresFechaDevolucion() && (
            <div className="step-section">
              <label className="step-label">Fecha de Devolucion Esperada</label>
              <InputX
                name="fechaDevolucion"
                type="date"
                defaultValue={state.fechaDevolucionEsperada}
                onChange={(value) => handleFechaDevolucionChange(value as string)}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido para prestamos' }],
                }}
              />
            </div>
          )}

          {/* Campos para descargo */}
          {requiresMotivoDescargo() && (
            <>
              <div className="step-section">
                <SelectX
                  name="motivoDescargo"
                  label="Motivo del Descargo"
                  placeholder="Seleccione un motivo..."
                  options={MOTIVOS_DESCARGO.map((m) => ({ value: m.value, label: m.label }))}
                  defaultValue={state.motivoDescargo}
                  onChange={(value) => handleMotivoDescargoChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="comentarioDescargo"
                  label="Detalles del Descargo"
                  placeholder="Describa los detalles..."
                  defaultValue={state.comentarioDescargo}
                  onChange={(value) => handleComentarioDescargoChange(value as string)}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="documentoAprobacion"
                  label="Documento de Aprobacion"
                  placeholder="Ej: RES-2026-003"
                  defaultValue={state.documentoAprobacionDescargo}
                  onChange={(value) => handleDocumentoAprobacionChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
            </>
          )}

          {/* Observaciones generales */}
          <div className="step-section">
            <InputX
              name="observaciones"
              label="Observaciones Adicionales"
              placeholder="Observaciones sobre la transaccion..."
              defaultValue={state.observaciones}
              onChange={(value) => dispatch({ type: 'SET_OBSERVACIONES', payload: value as string })}
            />
          </div>
        </>
      )}

      {/* Errores */}
      {state.errors['step_3'] && state.errors['step_3'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_3'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
