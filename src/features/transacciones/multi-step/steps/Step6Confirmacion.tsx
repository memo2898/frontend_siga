import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { useTransaccionWizard } from '../hooks/useTransaccionWizard';
import './Steps.css';

interface Step6ConfirmacionProps {
  onComplete?: () => void;
  onNewTransaction?: () => void;
}

export function Step6Confirmacion({ onComplete, onNewTransaction }: Step6ConfirmacionProps) {
  const { state, getTipoLabel, getSubtipoLabel, getTotalActivos } = useTransaccionWizardContext();
  const { submit, reset, isSubmitting, isComplete, transaccionCreada, submitError } = useTransaccionWizard();

  const handleSubmit = async () => {
    const success = await submit();
    if (success) {
      onComplete?.();
    }
  };

  const handleNewTransaction = () => {
    reset();
    onNewTransaction?.();
  };

  const handlePrint = () => {
    window.print();
  };

  // Vista de exito
  if (isComplete && transaccionCreada) {
    return (
      <div className="step-container">
        <div className="resumen-success">
          <div className="resumen-success-icon">&#10004;</div>
          <h2 className="resumen-success-title">Transaccion Creada Exitosamente</h2>
          <p className="resumen-success-code">
            Codigo: {transaccionCreada.codigo || `TRX-${transaccionCreada.id}`}
          </p>
        </div>

        <div className="resumen-actions">
          <button
            type="button"
            className="resumen-btn resumen-btn-secondary"
            onClick={handlePrint}
          >
            Imprimir
          </button>
          <button
            type="button"
            className="resumen-btn resumen-btn-primary"
            onClick={handleNewTransaction}
          >
            Nueva Transaccion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Confirmacion</h2>
        <p className="step-description">
          Revise la informacion antes de confirmar la transaccion
        </p>
      </div>

      <div className="resumen-container">
        {/* Tipo de transaccion */}
        <div className="resumen-card">
          <div className="resumen-card-header">Tipo de Transaccion</div>
          <div className="resumen-card-body">
            <div className="resumen-row">
              <span className="resumen-label">Tipo:</span>
              <span className="resumen-value">{getTipoLabel()}</span>
            </div>
            <div className="resumen-row">
              <span className="resumen-label">Subtipo:</span>
              <span className="resumen-value">{getSubtipoLabel()}</span>
            </div>
            {state.datosActaCB && (
              <>
                <div className="resumen-row">
                  <span className="resumen-label">Acta CB:</span>
                  <span className="resumen-value">{state.datosActaCB.actaControlBienes}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-label">Codigo CB:</span>
                  <span className="resumen-value">{state.datosActaCB.codigoCB}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Activos */}
        <div className="resumen-card">
          <div className="resumen-card-header">
            Activos ({state.activosSeleccionados.length} items, {getTotalActivos()} unidades)
          </div>
          <div className="resumen-card-body">
            <ul className="resumen-activos-list">
              {state.activosSeleccionados.map((item, index) => (
                <li key={index} className="resumen-activo-item">
                  <div className="resumen-activo-info">
                    <span className="resumen-activo-nombre">
                      {item.activo.marca} {item.activo.modelo}
                    </span>
                    <span className="resumen-activo-codigo">
                      {item.activo.codigo_inventario_local || 'Sin codigo'}
                    </span>
                  </div>
                  <span className="resumen-activo-cantidad">x{item.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Imagenes */}
        {state.imagenes.length > 0 && (
          <div className="resumen-card">
            <div className="resumen-card-header">
              Evidencia Fotografica ({state.imagenes.length} fotos)
            </div>
            <div className="resumen-card-body">
              <div className="resumen-imagenes">
                {state.imagenes.map((imagen, index) => (
                  <img
                    key={index}
                    src={imagen.preview}
                    alt={`Evidencia ${index + 1}`}
                    className="resumen-imagen-thumb"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Persona */}
        <div className="resumen-card">
          <div className="resumen-card-header">
            {state.tipoTransaccion === 'ENTRADA' ? 'Solicitante/Entrega' : 'Receptor'}
          </div>
          <div className="resumen-card-body">
            <div className="resumen-row">
              <span className="resumen-label">Nombre:</span>
              <span className="resumen-value">{state.persona?.nombre || '-'}</span>
            </div>
            <div className="resumen-row">
              <span className="resumen-label">Documento:</span>
              <span className="resumen-value">{state.persona?.numero_documento || '-'}</span>
            </div>
            {state.persona?.cargo && (
              <div className="resumen-row">
                <span className="resumen-label">Cargo:</span>
                <span className="resumen-value">{state.persona.cargo}</span>
              </div>
            )}
            {state.fechaDevolucionEsperada && (
              <div className="resumen-row">
                <span className="resumen-label">Fecha Devolucion:</span>
                <span className="resumen-value">{state.fechaDevolucionEsperada}</span>
              </div>
            )}
            {state.motivoDescargo && (
              <div className="resumen-row">
                <span className="resumen-label">Motivo Descargo:</span>
                <span className="resumen-value">{state.motivoDescargo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Firma */}
        <div className="resumen-card">
          <div className="resumen-card-header">Firma Digital</div>
          <div className="resumen-card-body">
            <div className="resumen-row">
              <span className="resumen-label">Firmante:</span>
              <span className="resumen-value">{state.firmante || '-'}</span>
            </div>
            {state.firmaData && (
              <div style={{ marginTop: '0.5rem' }}>
                <img
                  src={state.firmaData}
                  alt="Firma"
                  className="resumen-firma"
                />
              </div>
            )}
          </div>
        </div>

        {/* Observaciones */}
        {state.observaciones && (
          <div className="resumen-card">
            <div className="resumen-card-header">Observaciones</div>
            <div className="resumen-card-body">
              <p style={{ margin: 0 }}>{state.observaciones}</p>
            </div>
          </div>
        )}

        {/* Error de submit */}
        {submitError && (
          <div className="step-errors">
            <p className="step-error">{submitError}</p>
          </div>
        )}

        {/* Boton de confirmacion */}
        <div className="resumen-actions">
          <button
            type="button"
            className="resumen-btn resumen-btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
                Procesando...
              </>
            ) : (
              'Confirmar y Crear Transaccion'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
