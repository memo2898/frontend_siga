import type { TemplateElement, VariableGroupsMap } from '../../../types/template.types';
import VariableEditor from './VariableEditor';
import './RightPanel.css';

export interface RightPanelProps {
  selectedElement: TemplateElement | null;
  onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onElementRemove: (elementId: string) => void;
  variableGroups?: VariableGroupsMap;
}

export default function RightPanel({
  selectedElement,
  onElementUpdate,
  onElementRemove,
  variableGroups
}: RightPanelProps) {
  if (!selectedElement) {
    return (
      <div className="right-panel">
        <div className="right-panel__empty">
          Selecciona un elemento para editar sus propiedades
        </div>
      </div>
    );
  }

  const handlePositionModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onElementUpdate(selectedElement.id, {
      positionMode: e.target.value as 'static' | 'absolute' | 'inline'
    });
  };

  const handleStyleChange = (key: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [key]: value
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      onElementRemove(selectedElement.id);
    }
  };

  const handlePropertyChange = (key: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      properties: { ...(selectedElement.properties as any), [key]: value }
    });
  };

  return (
    <div className="right-panel">
      <div className="right-panel__header">
        <h3>Propiedades</h3>
        <button
          className="right-panel__delete-btn"
          onClick={handleDelete}
          title="Eliminar elemento"
        >
          🗑️
        </button>
      </div>

      <div className="right-panel__content">
        {/* Tipo de elemento */}
        <div className="property-group">
          <label className="property-label">Tipo</label>
          <div className="property-value">{selectedElement.type}</div>
        </div>

        {/* Modo de posición */}
        <div className="property-group">
          <label className="property-label">Posicionamiento</label>
          <select
            className="property-input"
            value={selectedElement.positionMode}
            onChange={handlePositionModeChange}
          >
            <option value="static">Estático</option>
            <option value="absolute">Absoluto</option>
            <option value="inline">Cuadrado (Inline)</option>
          </select>
        </div>

        {/* Posición (solo si es absolute o inline) */}
        {(selectedElement.positionMode === 'absolute' || selectedElement.positionMode === 'inline') && (
          <div className="property-group">
            <label className="property-label">Posición</label>
            <div className="property-row">
              <input
                type="number"
                className="property-input"
                placeholder="X"
                value={selectedElement.position.x}
                onChange={e => onElementUpdate(selectedElement.id, {
                  position: { ...selectedElement.position, x: Number(e.target.value) }
                })}
              />
              <input
                type="number"
                className="property-input"
                placeholder="Y"
                value={selectedElement.position.y}
                onChange={e => onElementUpdate(selectedElement.id, {
                  position: { ...selectedElement.position, y: Number(e.target.value) }
                })}
              />
            </div>
          </div>
        )}

        {/* Float direction para modo inline */}
        {selectedElement.positionMode === 'inline' && (
          <div className="property-group">
            <label className="property-label">Ajuste de Texto</label>
            <select
              className="property-input"
              value={selectedElement.styles.floatDirection || 'left'}
              onChange={e => handleStyleChange('floatDirection', e.target.value)}
            >
              <option value="left">Izquierda (texto fluye a la derecha)</option>
              <option value="right">Derecha (texto fluye a la izquierda)</option>
              <option value="none">Sin ajuste de texto</option>
            </select>
          </div>
        )}

        {/* Dimensiones */}
        <div className="property-group">
          <label className="property-label">Dimensiones</label>
          <div className="property-row">
            <input
              type="number"
              className="property-input"
              placeholder="Ancho"
              value={selectedElement.styles.width || ''}
              onChange={e => handleStyleChange('width', Number(e.target.value))}
            />
            <input
              type="number"
              className="property-input"
              placeholder="Alto"
              value={selectedElement.styles.height || ''}
              onChange={e => handleStyleChange('height', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Estilos de texto */}
        {selectedElement.type === 'TEXT' && (
          <>
            <div className="property-group">
              <label className="property-label">Familia de Fuente</label>
              <select
                className="property-input"
                value={selectedElement.styles.fontFamily || 'Arial'}
                onChange={e => handleStyleChange('fontFamily', e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Palatino Linotype">Palatino Linotype</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Tamaño de Fuente</label>
              <input
                type="number"
                className="property-input"
                value={selectedElement.styles.fontSize || 14}
                onChange={e => handleStyleChange('fontSize', Number(e.target.value))}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Grosor de Fuente</label>
              <select
                className="property-input"
                value={selectedElement.styles.fontWeight || 'normal'}
                onChange={e => handleStyleChange('fontWeight', e.target.value)}
              >
                <option value="normal">Normal (400)</option>
                <option value="bold">Bold (700)</option>
                <option value="100">Thin (100)</option>
                <option value="200">Extra Light (200)</option>
                <option value="300">Light (300)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Estilo de Fuente</label>
              <select
                className="property-input"
                value={selectedElement.styles.fontStyle || 'normal'}
                onChange={e => handleStyleChange('fontStyle', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="italic">Itálica</option>
                <option value="oblique">Oblicua</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Color</label>
              <input
                type="color"
                className="property-input"
                value={selectedElement.styles.color || '#000000'}
                onChange={e => handleStyleChange('color', e.target.value)}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Alineación</label>
              <select
                className="property-input"
                value={selectedElement.styles.textAlign || 'left'}
                onChange={e => handleStyleChange('textAlign', e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
                <option value="justify">Justificado</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Contenido</label>
              <VariableEditor
                value={selectedElement.content || ''}
                onChange={(content) => onElementUpdate(selectedElement.id, { content })}
                variableGroups={variableGroups}
                rows={4}
                placeholder="Escribe {{ para insertar variables..."
              />
            </div>
          </>
        )}

        {/* Propiedades específicas de INPUT */}
        {selectedElement.type === 'INPUT' && (
          <>
            <div className="property-group">
              <label className="property-label">Placeholder</label>
              <input
                type="text"
                className="property-input"
                value={(selectedElement.properties as any)?.placeholder || ''}
                onChange={e => onElementUpdate(selectedElement.id, {
                  properties: { ...selectedElement.properties, placeholder: e.target.value }
                })}
              />
            </div>
          </>
        )}

        {/* Propiedades específicas de IMAGE */}
        {selectedElement.type === 'IMAGE' && (
          <>
            <div className="property-group">
              <label className="property-label">URL de Imagen</label>
              <input
                type="text"
                className="property-input"
                placeholder="https://... o data:image/..."
                value={(selectedElement.properties as any)?.url || ''}
                onChange={e => onElementUpdate(selectedElement.id, {
                  properties: { ...selectedElement.properties, url: e.target.value }
                })}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Cargar desde archivo</label>
              <input
                type="file"
                className="property-input"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64 = event.target?.result as string;
                      onElementUpdate(selectedElement.id, {
                        properties: { ...selectedElement.properties, url: base64 }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Texto Alternativo</label>
              <input
                type="text"
                className="property-input"
                placeholder="Descripción de la imagen"
                value={(selectedElement.properties as any)?.alt || ''}
                onChange={e => onElementUpdate(selectedElement.id, {
                  properties: { ...selectedElement.properties, alt: e.target.value }
                })}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Ajuste de Imagen</label>
              <select
                className="property-input"
                value={(selectedElement.properties as any)?.fit || 'contain'}
                onChange={e => handlePropertyChange('fit', e.target.value)}
              >
                <option value="contain">Contener</option>
                <option value="cover">Cubrir</option>
                <option value="fill">Rellenar</option>
              </select>
            </div>

            <div className="property-group">
              <label className="property-label">Alineación</label>
              <select
                className="property-input"
                value={(selectedElement.properties as any)?.align || 'left'}
                onChange={e => handlePropertyChange('align', e.target.value)}
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </>
        )}

        {/* Propiedades específicas de DIVISOR */}
        {selectedElement.type === 'DIVISOR' && (
          <>
            <div className="property-group">
              <label className="property-label">Ancho</label>
              <input
                type="number"
                className="property-input"
                value={selectedElement.styles.width || 500}
                onChange={e => handleStyleChange('width', Number(e.target.value))}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Grosor de Línea</label>
              <input
                type="number"
                className="property-input"
                min={1}
                max={20}
                value={(selectedElement.properties as any)?.lineWidth || 1}
                onChange={e => handlePropertyChange('lineWidth', Number(e.target.value))}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Color de Línea</label>
              <input
                type="color"
                className="property-input"
                value={(selectedElement.properties as any)?.lineColor || '#000000'}
                onChange={e => handlePropertyChange('lineColor', e.target.value)}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Estilo de Línea</label>
              <select
                className="property-input"
                value={(selectedElement.properties as any)?.lineStyle || 'solid'}
                onChange={e => handlePropertyChange('lineStyle', e.target.value)}
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Guiones</option>
                <option value="dotted">Puntos</option>
              </select>
            </div>
          </>
        )}

        {/* Propiedades específicas de TABLA */}
        {selectedElement.type === 'TABLA' && (
          <>
            <div className="property-group">
              <label className="property-label">Variable Vinculada</label>
              <input
                type="text"
                className="property-input"
                placeholder="nombre.de.variable"
                value={(selectedElement.properties as any)?.linkedVariable || ''}
                onChange={e => handlePropertyChange('linkedVariable', e.target.value)}
              />
            </div>

            {/* Editor de columnas */}
            <div className="property-group">
              <label className="property-label">Columnas</label>
              <div className="columns-editor">
                {(selectedElement.properties as any)?.columns?.map((col: any, index: number) => (
                  <div key={col.id} className="column-item">
                    <div className="column-item__header">
                      <span>Columna {index + 1}</span>
                      <button
                        type="button"
                        className="column-item__delete"
                        onClick={() => {
                          const columns = [...((selectedElement.properties as any)?.columns || [])];
                          columns.splice(index, 1);
                          handlePropertyChange('columns', columns);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      className="property-input"
                      placeholder="Encabezado"
                      value={col.header}
                      onChange={e => {
                        const columns = [...((selectedElement.properties as any)?.columns || [])];
                        columns[index] = { ...columns[index], header: e.target.value };
                        handlePropertyChange('columns', columns);
                      }}
                    />
                    <input
                      type="text"
                      className="property-input"
                      placeholder="Campo (field)"
                      value={col.field}
                      onChange={e => {
                        const columns = [...((selectedElement.properties as any)?.columns || [])];
                        columns[index] = { ...columns[index], field: e.target.value };
                        handlePropertyChange('columns', columns);
                      }}
                    />
                    <input
                      type="number"
                      className="property-input"
                      placeholder="Ancho"
                      value={col.width || 150}
                      onChange={e => {
                        const columns = [...((selectedElement.properties as any)?.columns || [])];
                        columns[index] = { ...columns[index], width: Number(e.target.value) };
                        handlePropertyChange('columns', columns);
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-column-btn"
                  onClick={() => {
                    const columns = [...((selectedElement.properties as any)?.columns || [])];
                    columns.push({
                      id: `col_${Date.now()}`,
                      header: `Columna ${columns.length + 1}`,
                      field: `campo${columns.length + 1}`,
                      width: 150
                    });
                    handlePropertyChange('columns', columns);
                  }}
                >
                  + Agregar Columna
                </button>
              </div>
            </div>

            <div className="property-group">
              <label className="property-label">Color de Borde</label>
              <input
                type="color"
                className="property-input"
                value={(selectedElement.properties as any)?.borderColor || '#000000'}
                onChange={e => handlePropertyChange('borderColor', e.target.value)}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Grosor de Borde</label>
              <input
                type="number"
                className="property-input"
                min={1}
                max={10}
                value={(selectedElement.properties as any)?.borderWidth || 1}
                onChange={e => handlePropertyChange('borderWidth', Number(e.target.value))}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Fondo del Encabezado</label>
              <input
                type="color"
                className="property-input"
                value={(selectedElement.properties as any)?.headerBg || '#f0f0f0'}
                onChange={e => handlePropertyChange('headerBg', e.target.value)}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Color Texto Encabezado</label>
              <input
                type="color"
                className="property-input"
                value={(selectedElement.properties as any)?.headerTextColor || '#000000'}
                onChange={e => handlePropertyChange('headerTextColor', e.target.value)}
              />
            </div>

            <div className="property-group">
              <label className="property-label">
                <input
                  type="checkbox"
                  checked={(selectedElement.properties as any)?.striped || false}
                  onChange={e => handlePropertyChange('striped', e.target.checked)}
                />
                {' '}Filas Alternadas
              </label>
            </div>

            {(selectedElement.properties as any)?.striped && (
              <div className="property-group">
                <label className="property-label">Color Filas Alternadas</label>
                <input
                  type="color"
                  className="property-input"
                  value={(selectedElement.properties as any)?.stripedColor || '#f9f9f9'}
                  onChange={e => handlePropertyChange('stripedColor', e.target.value)}
                />
              </div>
            )}

            <div className="property-group">
              <label className="property-label">Padding de Celdas</label>
              <input
                type="number"
                className="property-input"
                min={0}
                max={50}
                value={(selectedElement.properties as any)?.cellPadding || 8}
                onChange={e => handlePropertyChange('cellPadding', Number(e.target.value))}
              />
            </div>

            <div className="property-group">
              <label className="property-label">Tamaño de Fuente</label>
              <input
                type="number"
                className="property-input"
                min={8}
                max={32}
                value={(selectedElement.properties as any)?.fontSize || 14}
                onChange={e => handlePropertyChange('fontSize', Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
