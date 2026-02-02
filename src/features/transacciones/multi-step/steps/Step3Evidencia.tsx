import { useState, useMemo } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { InputFileX } from '../../../../lib/uiX';
import type { ImagenEvidencia, TipoImagen } from '../types';
import { TIPOS_IMAGEN } from '../types';
import './Steps.css';

export function Step3Evidencia() {
  const { state, dispatch } = useTransaccionWizardContext();
  const [activoExpandido, setActivoExpandido] = useState<number | null>(
    state.activosSeleccionados.length > 0 ? 0 : null
  );

  // Agrupar imágenes por activo
  const imagenesPorActivo = useMemo(() => {
    const map = new Map<number, ImagenEvidencia[]>();
    state.imagenes.forEach((img) => {
      const existing = map.get(img.activoIndex) || [];
      map.set(img.activoIndex, [...existing, img]);
    });
    return map;
  }, [state.imagenes]);

  // Obtener imágenes de un activo específico
  const getImagenesDeActivo = (index: number): ImagenEvidencia[] => {
    return imagenesPorActivo.get(index) || [];
  };

  // Contar total de imágenes
  const totalImagenes = state.imagenes.length;

  // Handler: recibe solo los archivos NUEVOS que se agregaron
  const handleFilesChange = (files: File[], activoIndex: number) => {
    // Crear las nuevas imágenes con preview y ID único
    const nuevasImagenes: (ImagenEvidencia & { id: string })[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      activoIndex,
      tipo: 'PRINCIPAL' as TipoImagen,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    }));

    // Agregar todas las nuevas imágenes al estado existente
    const todasLasImagenes = [...state.imagenes, ...nuevasImagenes];
    dispatch({ type: 'SET_IMAGENES', payload: todasLasImagenes });
  };

  const handleRemoveImagen = (imagenId: string) => {
    // Buscar la imagen por ID
    const imagen = state.imagenes.find(img => (img as any).id === imagenId);
    
    if (!imagen) {
      console.error('Imagen no encontrada:', imagenId);
      return;
    }

    // Limpiar la URL del preview
    if (imagen.preview) {
      URL.revokeObjectURL(imagen.preview);
    }
    
    // Crear nuevo array sin la imagen eliminada
    const nuevasImagenes = state.imagenes.filter(img => (img as any).id !== imagenId);
    dispatch({ type: 'SET_IMAGENES', payload: nuevasImagenes });
  };

  const handleDescripcionChange = (imagenId: string, descripcion: string) => {
    const nuevasImagenes = state.imagenes.map(img => 
      (img as any).id === imagenId 
        ? { ...img, descripcion } 
        : img
    );
    dispatch({ type: 'SET_IMAGENES', payload: nuevasImagenes });
  };

  const handleTipoChange = (imagenId: string, tipo: TipoImagen) => {
    const nuevasImagenes = state.imagenes.map(img => 
      (img as any).id === imagenId 
        ? { ...img, tipo } 
        : img
    );
    dispatch({ type: 'SET_IMAGENES', payload: nuevasImagenes });
  };

  if (state.activosSeleccionados.length === 0) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2 className="step-title">Evidencia Fotográfica</h2>
          <p className="step-description">
            Documente el estado de los activos con fotografías (opcional)
          </p>
        </div>
        <div className="step-empty-message">
          No hay activos seleccionados. Vuelva al paso anterior para agregar activos.
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Evidencia Fotográfica</h2>
        <p className="step-description">
          Documente el estado de cada activo con fotografías (opcional)
        </p>
      </div>

      {/* Aviso de paso opcional */}
      <div className="evidencia-skip">
        <p className="evidencia-skip-text">
          Este paso es <strong>opcional</strong>. Puede continuar sin agregar fotos.
        </p>
        {totalImagenes > 0 && (
          <span className="evidencia-total-badge">
            {totalImagenes} foto(s) agregada(s)
          </span>
        )}
      </div>

      {/* Lista de activos con sus fotos */}
      <div className="evidencia-activos-list">
        {state.activosSeleccionados.map((item, index) => {
          const imagenesDelActivo = getImagenesDeActivo(index);
          const isExpanded = activoExpandido === index;

          return (
            <div key={index} className="evidencia-activo-card">
              {/* Header del activo */}
              <button
                type="button"
                className={`evidencia-activo-header ${isExpanded ? 'evidencia-activo-header--expanded' : ''}`}
                onClick={() => setActivoExpandido(isExpanded ? null : index)}
              >
                <div className="evidencia-activo-info">
                  <span className="evidencia-activo-nombre">
                    {item.activo.marca} {item.activo.modelo}
                  </span>
                  <span className="evidencia-activo-codigo">
                    {item.activo.codigo_inventario_local || 'Sin código'}
                    {item.isNew && ' (Nuevo)'}
                  </span>
                </div>
                <div className="evidencia-activo-meta">
                  {imagenesDelActivo.length > 0 && (
                    <span className="evidencia-activo-count">
                      {imagenesDelActivo.length} foto(s)
                    </span>
                  )}
                  <svg
                    className={`evidencia-activo-chevron ${isExpanded ? 'evidencia-activo-chevron--rotated' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Contenido expandido */}
              {isExpanded && (
                <div className="evidencia-activo-content">
                  {/* Upload de fotos - Modo controlado con value=[] */}
                  <div className="evidencia-upload-section">
                    <InputFileX
                      name={`evidencias-${index}`}
                      label="Subir fotos"
                      accept="image/*"
                      multiple={true}
                      maxFiles={10}
                      maxSize={5 * 1024 * 1024}
                      value={[]} // ← CRÍTICO: Modo controlado con array vacío
                      onChange={(files) => handleFilesChange(files, index)}
                      showPreview={false}
                    />
                  </div>

                  {/* Preview personalizado de imágenes del activo */}
                  {imagenesDelActivo.length > 0 && (
                    <div className="evidencia-preview-section">
                      <label className="step-label">
                        Fotos de este activo ({imagenesDelActivo.length})
                      </label>
                      <div className="evidencia-preview">
                        {imagenesDelActivo.map((imagen) => {
                          const imagenConId = imagen as any;
                          const imagenId = imagenConId.id || `fallback-${imagen.file.name}-${imagen.activoIndex}`;
                          const tipoInfo = TIPOS_IMAGEN.find(t => t.value === imagen.tipo);

                          return (
                            <div key={imagenId} className="evidencia-preview-item">
                              <div className="evidencia-preview-image-wrapper">
                                <img
                                  src={imagen.preview}
                                  alt={imagen.file.name}
                                  className="evidencia-preview-image"
                                />
                                <span className="evidencia-preview-tipo-badge">
                                  {tipoInfo?.label || imagen.tipo}
                                </span>
                                <button
                                  type="button"
                                  className="evidencia-preview-remove"
                                  onClick={() => handleRemoveImagen(imagenId)}
                                  title="Eliminar"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="evidencia-preview-details">
                                <select
                                  className="evidencia-tipo-select"
                                  value={imagen.tipo}
                                  onChange={(e) => handleTipoChange(imagenId, e.target.value as TipoImagen)}
                                >
                                  {TIPOS_IMAGEN.map((tipo) => (
                                    <option key={tipo.value} value={tipo.value}>
                                      {tipo.label}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  className="evidencia-descripcion-input"
                                  placeholder="Descripción (opcional)..."
                                  value={imagen.descripcion || ''}
                                  onChange={(e) => handleDescripcionChange(imagenId, e.target.value)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {imagenesDelActivo.length === 0 && (
                    <div className="evidencia-no-fotos">
                      No hay fotos agregadas para este activo
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info adicional */}
      <div className="evidencia-info-box">
        <strong>Nota:</strong> Las fotografías se guardarán como evidencia de cada activo
        y podrán ser consultadas posteriormente para verificar su estado.
      </div>
    </div>
  );
}