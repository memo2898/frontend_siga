import React, { useState, useEffect, useCallback } from 'react';
import type {
  TemplateElement,
  VariableSchemaMap,
  VariableGroupsMap
} from '../../../types/template.types';
import './DroppableElement.css';

export interface DroppableElementProps {
  element: TemplateElement;
  isSelected: boolean;
  onUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onRemove: (elementId: string) => void;
  onSelect: (elementId: string | null) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
}

export default function DroppableElement({
  element,
  isSelected,
  onUpdate,
  onRemove,
  onSelect,
  onReorder,
  variableSchema,
  variableGroups
}: DroppableElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  // Obtener todas las variables válidas del schema
  const getValidVariables = useCallback((): Set<string> => {
    const validVars = new Set<string>();

    if (variableGroups) {
      Object.entries(variableGroups).forEach(([groupKey, group]) => {
        validVars.add(groupKey);
        Object.keys(group.schema).forEach(fieldKey => {
          validVars.add(fieldKey);
          validVars.add(`${groupKey}.${fieldKey}`);
        });
      });
    }

    return validVars;
  }, [variableGroups]);

  // Verificar si una variable es válida
  const isValidVariable = useCallback((variable: string): boolean => {
    const validVars = getValidVariables();
    const cleanVar = variable.trim();

    if (cleanVar.startsWith('#each ') || cleanVar.startsWith('/each')) {
      const groupName = cleanVar.replace('#each ', '').replace('/each', '').trim();
      return validVars.has(groupName) || groupName === '';
    }

    return validVars.has(cleanVar);
  }, [getValidVariables]);

  // Renderizar contenido con variables resaltadas
  const renderTextWithVariables = (text: string) => {
    if (!text) return 'Texto vacío';

    const parts: React.ReactNode[] = [];
    const regex = /(\{\{[^}]*\}\})/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      // Agregar texto antes de la variable
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Agregar la variable con estilo
      const varName = match[1].slice(2, -2);
      const isValid = isValidVariable(varName);

      parts.push(
        <span
          key={key++}
          className={`canvas-variable ${isValid ? 'canvas-variable--valid' : 'canvas-variable--invalid'}`}
        >
          {match[1]}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    // Agregar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : 'Texto vacío';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);

    if (element.positionMode === 'absolute' || element.positionMode === 'inline') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.position.x,
        y: e.clientY - element.position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    if (element.positionMode !== 'absolute' && element.positionMode !== 'inline') return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    onUpdate(element.id, {
      position: { x: Math.max(0, newX), y: Math.max(0, newY) }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejadores de drag and drop para reordenamiento (solo elementos estáticos)
  const handleDragStart = (e: React.DragEvent) => {
    if (element.positionMode === 'static') {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', element.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (element.positionMode === 'static') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (element.positionMode === 'static') {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== element.id) {
        onReorder(draggedId, element.id);
      }

      setIsDragOver(false);
    }
  };

  // Registrar listeners de mouse
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const getElementStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: element.positionMode === 'absolute' ? 'absolute' : 'relative',
      cursor: element.positionMode === 'absolute' || element.positionMode === 'inline' ? 'move' : element.positionMode === 'static' ? 'grab' : 'pointer',
      border: isSelected ? '2px solid #007bff' : isDragOver ? '2px dashed #007bff' : '1px solid transparent',
      ...element.styles
    };

    if (element.positionMode === 'absolute') {
      baseStyles.left = `${element.position.x}px`;
      baseStyles.top = `${element.position.y}px`;
    }

    // Modo inline: comportamiento híbrido como Word
    if (element.positionMode === 'inline') {
      const properties = element.properties as any;
      const floatDirection = element.styles.floatDirection || properties?.floatDirection || 'left';

      baseStyles.float = floatDirection as 'left' | 'right' | 'none';

      // Usar la posición Y como margen superior y X como margen lateral
      baseStyles.marginTop = `${element.position.y}px`;

      if (floatDirection === 'left') {
        baseStyles.marginLeft = `${element.position.x}px`;
        baseStyles.marginRight = '15px';
        baseStyles.marginBottom = '10px';
      } else if (floatDirection === 'right') {
        baseStyles.marginRight = `${Math.max(0, 600 - element.position.x - (element.styles.width as number || 100))}px`;
        baseStyles.marginLeft = '15px';
        baseStyles.marginBottom = '10px';
      } else {
        // Sin float, usar márgenes para simular posición
        baseStyles.marginLeft = `${element.position.x}px`;
      }
    }

    return baseStyles;
  };

  const getDragProps = () => {
    if (element.positionMode === 'static') {
      return {
        draggable: true,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
      };
    }
    return {};
  };

  const renderElementContent = () => {
    const dragProps = getDragProps();

    switch (element.type) {
      case 'TEXT':
        return (
          <div
            className="canvas-text-element"
            style={getElementStyles()}
            onMouseDown={handleMouseDown}
            {...dragProps}
          >
            {renderTextWithVariables(element.content || '')}
          </div>
        );

      case 'INPUT':
        const inputProps = element.properties as any;
        return (
          <input
            type={inputProps?.inputType || 'text'}
            placeholder={inputProps?.placeholder || ''}
            style={getElementStyles()}
            onMouseDown={handleMouseDown}
            readOnly
            {...dragProps}
          />
        );

      case 'RADIO':
        const radioProps = element.properties as any;
        return (
          <div style={getElementStyles()} onMouseDown={handleMouseDown} {...dragProps}>
            {radioProps?.options?.map((opt: any) => (
              <label key={opt.id} style={{ marginRight: '10px' }}>
                <input type="radio" name={radioProps.name} value={opt.value} />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case 'DIVISOR':
        const divisorProps = element.properties as any;
        const lineWidth = divisorProps?.lineWidth || 1;
        const lineColor = divisorProps?.lineColor || '#000000';
        const lineStyle = divisorProps?.lineStyle || 'solid';

        return (
          <hr
            style={{
              ...getElementStyles(),
              border: 'none',
              borderTop: `${lineWidth}px ${lineStyle} ${lineColor}`,
              margin: '10px 0'
            }}
            onMouseDown={handleMouseDown}
            {...dragProps}
          />
        );

      case 'IMAGE':
        const imageProps = element.properties as any;
        const imageAlign = imageProps?.align || 'left';
        const imageFit = imageProps?.fit || 'contain';

        const imageContainerStyles: React.CSSProperties = {
          ...getElementStyles()
        };

        // Aplicar alineación con respecto a la hoja completa
        if (element.positionMode === 'static') {
          if (imageAlign === 'center') {
            imageContainerStyles.marginLeft = 'auto';
            imageContainerStyles.marginRight = 'auto';
            imageContainerStyles.display = 'block';
          } else if (imageAlign === 'right') {
            imageContainerStyles.marginLeft = 'auto';
            imageContainerStyles.marginRight = '0';
            imageContainerStyles.display = 'block';
          } else {
            // left
            imageContainerStyles.marginLeft = '0';
            imageContainerStyles.marginRight = 'auto';
            imageContainerStyles.display = 'block';
          }
        }

        const imageDisplayStyles: React.CSSProperties = {
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: imageFit as 'contain' | 'cover' | 'fill',
          display: 'block'
        };

        return (
          <div style={imageContainerStyles} onMouseDown={handleMouseDown} {...dragProps}>
            {imageProps?.url ? (
              <img
                src={imageProps.url}
                alt={imageProps?.alt || 'Imagen'}
                style={imageDisplayStyles}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🖼 Imagen
              </div>
            )}
          </div>
        );

      case 'FIRMA':
        return (
          <div
            style={{
              ...getElementStyles(),
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={handleMouseDown}
            {...dragProps}
          >
            ✍ Firma
          </div>
        );

      case 'TABLA':
        const tableProps = element.properties as any;
        const borderColor = tableProps?.borderColor || '#000000';
        const borderWidth = tableProps?.borderWidth || 1;
        const headerBg = tableProps?.headerBg || '#f0f0f0';
        const headerTextColor = tableProps?.headerTextColor || '#000000';
        const striped = tableProps?.striped || false;
        const stripedColor = tableProps?.stripedColor || '#f9f9f9';
        const cellPadding = tableProps?.cellPadding || 8;
        const tableFontSize = tableProps?.fontSize || 14;

        return (
          <table
            style={{
              ...getElementStyles(),
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: `${tableFontSize}px`
            }}
            onMouseDown={handleMouseDown}
            {...dragProps}
          >
            <thead>
              <tr>
                {tableProps?.columns?.map((col: any) => (
                  <th
                    key={col.id}
                    style={{
                      border: `${borderWidth}px solid ${borderColor}`,
                      padding: `${cellPadding}px`,
                      backgroundColor: headerBg,
                      color: headerTextColor,
                      width: col.width ? `${col.width}px` : 'auto'
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {tableProps?.columns?.map((col: any, colIndex: number) => (
                  <td
                    key={col.id}
                    style={{
                      border: `${borderWidth}px solid ${borderColor}`,
                      padding: `${cellPadding}px`,
                      backgroundColor: striped && colIndex % 2 === 1 ? stripedColor : 'transparent'
                    }}
                  >
                    {col.field}
                  </td>
                ))}
              </tr>
              {/* Fila de ejemplo adicional para mostrar striped */}
              {striped && (
                <tr>
                  {tableProps?.columns?.map((col: any) => (
                    <td
                      key={`${col.id}-2`}
                      style={{
                        border: `${borderWidth}px solid ${borderColor}`,
                        padding: `${cellPadding}px`,
                        backgroundColor: stripedColor
                      }}
                    >
                      ...
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        );

      default:
        return (
          <div style={getElementStyles()} onMouseDown={handleMouseDown} {...dragProps}>
            Elemento desconocido: {element.type}
          </div>
        );
    }
  };

  return renderElementContent();
}
