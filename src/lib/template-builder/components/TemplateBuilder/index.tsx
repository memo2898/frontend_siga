/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import type { TemplateBuilderProps } from '../../types/template.types';
import { useTemplate } from '../../hooks/useTemplate';

import { generateHandlebarsTemplate } from '../../utils/hbsGenerator';
import LeftPanel from './LeftPanel';
import Canvas from './Canvas';
import RightPanel from './RightPanel';
import './TemplateBuilder.css';

/**
 * Componente principal del Template Builder
 *
 * Permite crear templates visuales mediante drag & drop
 * y exportarlos como archivos Handlebars (.hbs)
 */
export default function TemplateBuilder({
  variableSchema,
  variableGroups,
  initialPageSize,
  initialTemplate,
  onSave,
  onChange
}: TemplateBuilderProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'variables'>('elements');

  const templateState = useTemplate(initialTemplate);

  const {
    template,
    currentPageIndex,
    currentPage,
    selectedElementId,
    setCurrentPageIndex,
    addPage,
    removePage,
    updatePageSize,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    getSelectedElement,
    reorderElements
  } = templateState;

  // Llamar onChange cuando cambie el template
  useEffect(() => {
    if (onChange) {
      onChange(template);
    }
  }, [template, onChange]);

  // Manejar guardar template
  const handleSave = () => {
    const hbsTemplate = generateHandlebarsTemplate(template);
    if (onSave) {
      onSave(template, hbsTemplate);
    }
  };

  return (
    <div className="template-builder">
      <div className="template-builder__header">
        <h1 className="template-builder__title">Template Builder</h1>
        <button className="template-builder__save-btn" onClick={handleSave}>
          Guardar Template
        </button>
      </div>

      <div className="template-builder__layout">
        {/* Panel Izquierdo */}
        <LeftPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variableSchema={variableSchema}
          variableGroups={variableGroups}
          onAddElement={addElement}
        />

        {/* Canvas Central */}
        <Canvas
          template={template}
          currentPageIndex={currentPageIndex}
          currentPage={currentPage}
          selectedElementId={selectedElementId}
          onPageChange={setCurrentPageIndex}
          onAddPage={addPage}
          onRemovePage={removePage}
          onPageSizeChange={updatePageSize}
          onElementUpdate={updateElement}
          onElementRemove={removeElement}
          onElementSelect={selectElement}
          onReorderElements={reorderElements}
          variableSchema={variableSchema}
          variableGroups={variableGroups}
        />

        {/* Panel Derecho */}
        <RightPanel
          selectedElement={getSelectedElement()}
          onElementUpdate={updateElement}
          onElementRemove={removeElement}
          variableGroups={variableGroups}
        />
      </div>
    </div>
  );
}

// Re-exportar tipos para facilitar el uso
export type { TemplateBuilderProps };
