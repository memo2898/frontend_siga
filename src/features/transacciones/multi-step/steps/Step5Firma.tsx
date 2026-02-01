import { useEffect } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { useSignature } from '../../../../lib/template-builder/hooks/useSignature';
import { InputX } from '../../../../lib/uiX';
import './Steps.css';

export function Step5Firma() {
  const { state, dispatch, getTipoLabel, getSubtipoLabel } = useTransaccionWizardContext();
  const { canvasRef, isEmpty, clear, getSignatureData, setSignatureData } = useSignature({
    strokeColor: '#000000',
    strokeWidth: 2,
    backgroundColor: '#ffffff',
  });

  // Restaurar firma si ya existe
  useEffect(() => {
    if (state.firmaData && isEmpty) {
      setSignatureData(state.firmaData);
    }
  }, []);

  // Guardar firma cuando cambia
  useEffect(() => {
    if (!isEmpty) {
      const data = getSignatureData();
      if (data && data !== state.firmaData) {
        dispatch({
          type: 'SET_FIRMA',
          payload: { data, firmante: state.firmante },
        });
      }
    }
  }, [isEmpty]);

  const handleClear = () => {
    clear();
    dispatch({ type: 'CLEAR_FIRMA' });
  };

  const handleFirmanteChange = (value: string) => {
    dispatch({
      type: 'SET_FIRMA',
      payload: { data: state.firmaData || '', firmante: value },
    });
  };

  const handleCanvasMouseUp = () => {
    const data = getSignatureData();
    if (data) {
      dispatch({
        type: 'SET_FIRMA',
        payload: { data, firmante: state.firmante },
      });
    }
  };

  // Generar texto de compromiso segun tipo de transaccion
  const getTextoCompromiso = () => {
    if (state.tipoTransaccion === 'ENTRADA') {
      return (
        <>
          <p>Yo, <strong>{state.firmante || '[Nombre del firmante]'}</strong>, confirmo que:</p>
          <ul>
            <li>Recibi el/los activo(s) en buen estado</li>
            <li>La informacion proporcionada es correcta</li>
            <li>Me comprometo al cuidado del equipo</li>
          </ul>
        </>
      );
    }

    if (state.subtipoSalida === 'PRESTAMO') {
      return (
        <>
          <p>Yo, <strong>{state.firmante || '[Nombre del firmante]'}</strong>, confirmo que:</p>
          <ul>
            <li>Recibo el/los activo(s) en buen estado</li>
            <li>Me comprometo a su cuidado y uso responsable</li>
            <li>Devolvere el equipo antes del {state.fechaDevolucionEsperada || '[fecha]'}</li>
          </ul>
        </>
      );
    }

    if (state.subtipoSalida === 'DESCARGO') {
      return (
        <>
          <p>Yo, <strong>{state.firmante || '[Nombre del firmante]'}</strong>, certifico que:</p>
          <ul>
            <li>El activo se encuentra en estado: {state.motivoDescargo || '[motivo]'}</li>
            <li>Los detalles descritos son correctos</li>
            <li>Autorizo el descargo segun documento: {state.documentoAprobacionDescargo || '[documento]'}</li>
          </ul>
        </>
      );
    }

    return (
      <>
        <p>Yo, <strong>{state.firmante || '[Nombre del firmante]'}</strong>, confirmo que:</p>
        <ul>
          <li>Recibo el/los activo(s) en las condiciones descritas</li>
          <li>Me comprometo a su uso responsable</li>
          <li>Acepto los terminos de la transaccion</li>
        </ul>
      </>
    );
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Firma Digital</h2>
        <p className="step-description">
          Capture la firma del responsable para completar la transaccion
        </p>
      </div>

      {/* Resumen de la transaccion */}
      <div className="resumen-card" style={{ marginBottom: '1.5rem' }}>
        <div className="resumen-card-header">Resumen de la Transaccion</div>
        <div className="resumen-card-body">
          <div className="resumen-row">
            <span className="resumen-label">Tipo:</span>
            <span className="resumen-value">{getTipoLabel()}</span>
          </div>
          <div className="resumen-row">
            <span className="resumen-label">Subtipo:</span>
            <span className="resumen-value">{getSubtipoLabel()}</span>
          </div>
          <div className="resumen-row">
            <span className="resumen-label">Activos:</span>
            <span className="resumen-value">{state.activosSeleccionados.length} item(s)</span>
          </div>
          <div className="resumen-row">
            <span className="resumen-label">Persona:</span>
            <span className="resumen-value">{state.persona?.nombre || '-'}</span>
          </div>
        </div>
      </div>

      {/* Nombre del firmante */}
      <div className="step-section">
        <div className="step-form-group">
          <InputX
            name="firmante"
            label="Nombre del firmante"
            placeholder="Ingrese el nombre completo"
            defaultValue={state.firmante}
            onChange={(value) => handleFirmanteChange(value as string)}
            rules={{
              validations: [{ type: 'required', message: 'El nombre es requerido' }],
            }}
          />
        </div>
      </div>

      {/* Texto de compromiso */}
      <div className="step-section">
        <div
          style={{
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#334155',
          }}
        >
          {getTextoCompromiso()}
        </div>
      </div>

      {/* Canvas de firma */}
      <div className="step-section">
        <label className="step-label">Firma</label>
        <div className="signature-container">
          <div className={`signature-canvas-wrapper ${!isEmpty ? 'has-signature' : ''}`}>
            <canvas
              ref={canvasRef}
              className="signature-canvas"
              width={600}
              height={200}
              onMouseUp={handleCanvasMouseUp}
              onTouchEnd={handleCanvasMouseUp}
            />
          </div>
          <div className="signature-actions">
            <button
              type="button"
              className="signature-btn signature-btn-clear"
              onClick={handleClear}
            >
              Limpiar
            </button>
          </div>
        </div>

        {!isEmpty && (
          <div className="signature-preview">
            <div className="signature-preview-label">Vista previa de la firma</div>
            {state.firmaData && (
              <img
                src={state.firmaData}
                alt="Firma"
                className="signature-preview-image"
              />
            )}
          </div>
        )}
      </div>

      {/* Errores */}
      {state.errors['step_4'] && state.errors['step_4'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_4'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
