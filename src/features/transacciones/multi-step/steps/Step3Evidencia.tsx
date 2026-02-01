import { useCallback } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { InputFileX } from '../../../../lib/uiX';
import type { ImagenEvidencia } from '../types';
import './Steps.css';

export function Step3Evidencia() {
  const { state, dispatch } = useTransaccionWizardContext();

  const handleFilesChange = useCallback(
    (files: File[]) => {
      const nuevasImagenes: ImagenEvidencia[] = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        momento: state.tipoTransaccion === 'ENTRADA' ? 'DESPUES' : 'ANTES',
      }));

      dispatch({ type: 'SET_IMAGENES', payload: [...state.imagenes, ...nuevasImagenes] });
    },
    [state.imagenes, state.tipoTransaccion, dispatch]
  );

  const handleRemoveImagen = (index: number) => {
    // Liberar URL del objeto
    URL.revokeObjectURL(state.imagenes[index].preview);
    dispatch({ type: 'REMOVE_IMAGEN', payload: index });
  };

  const handleDescripcionChange = (index: number, descripcion: string) => {
    const nuevasImagenes = [...state.imagenes];
    nuevasImagenes[index] = { ...nuevasImagenes[index], descripcion };
    dispatch({ type: 'SET_IMAGENES', payload: nuevasImagenes });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Evidencia Fotografica</h2>
        <p className="step-description">
          Documente el estado de los activos con fotografias (opcional)
        </p>
      </div>

      {/* Aviso de paso opcional */}
      <div className="evidencia-skip">
        <p className="evidencia-skip-text">
          Este paso es <strong>opcional</strong>. Puede continuar sin agregar fotos.
        </p>
      </div>

      {/* Sugerencias de fotos */}
      <div className="step-section">
        <label className="step-label">Tipos de fotos sugeridas:</label>
        <ul style={{ color: '#64748b', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
          {state.tipoTransaccion === 'ENTRADA' ? (
            <>
              <li>Foto general del activo</li>
              <li>Numero de serie / Placa patrimonial</li>
              <li>Danos o detalles especiales</li>
            </>
          ) : (
            <>
              <li>Vista general del equipo</li>
              <li>Estado de la pantalla/display</li>
              <li>Accesorios incluidos</li>
              <li>Numero de serie visible</li>
            </>
          )}
        </ul>
      </div>

      {/* Upload de fotos */}
      <div className="step-section">
        <InputFileX
          name="evidencias"
          label="Subir Fotografias"
          accept="image/*"
          multiple={true}
          maxFiles={10}
          maxSize={5 * 1024 * 1024}
          onChange={handleFilesChange}
        />
      </div>

      {/* Preview de imagenes subidas */}
      {state.imagenes.length > 0 && (
        <div className="step-section">
          <label className="step-label">
            Imagenes Agregadas ({state.imagenes.length})
          </label>
          <div className="evidencia-preview">
            {state.imagenes.map((imagen, index) => (
              <div key={index} className="evidencia-preview-item">
                <img
                  src={imagen.preview}
                  alt={`Evidencia ${index + 1}`}
                  className="evidencia-preview-image"
                />
                <button
                  type="button"
                  className="evidencia-preview-remove"
                  onClick={() => handleRemoveImagen(index)}
                  title="Eliminar"
                >
                  X
                </button>
                <div style={{ padding: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Descripcion..."
                    value={imagen.descripcion || ''}
                    onChange={(e) => handleDescripcionChange(index, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          color: '#92400e',
        }}
      >
        <strong>Nota:</strong> Las fotografias se guardaran como evidencia de la transaccion
        y podran ser consultadas posteriormente para verificar el estado de los activos.
      </div>
    </div>
  );
}
