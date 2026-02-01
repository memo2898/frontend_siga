/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import type { TemplateBuilderProps } from '../../types/template.types';
import { useTemplate } from '../../hooks/useTemplate';

import { generateHandlebarsTemplate } from '../../utils/hbsGenerator';
import LeftPanel from './LeftPanel';
import Canvas from './Canvas';
import RightPanel from './RightPanel';
import './TemplateBuilder.css';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

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
  onExit,
  onChange
}: TemplateBuilderProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'variables'>('elements');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [pendingExit, setPendingExit] = useState(false);

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
  const handleSave = async (shouldExit: boolean = false) => {
    if (saveStatus === 'saving') return;

    setSaveStatus('saving');
    setPendingExit(shouldExit);

    try {
      const hbsTemplate = generateHandlebarsTemplate(template);
      if (onSave) {
        await onSave(template, hbsTemplate);
      }
      setSaveStatus('success');

      // Mostrar éxito por 1.5 segundos, luego resetear o salir
      setTimeout(() => {
        setSaveStatus('idle');
        if (shouldExit && onExit) {
          onExit();
        }
      }, 1500);
    } catch (error) {
      setSaveStatus('error');
      setPendingExit(false);

      // Resetear estado de error después de 3 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const isSaving = saveStatus === 'saving';
  const isDisabled = saveStatus !== 'idle';

  return (
    <div className="template-builder">
      <div className="template-builder__header">
        <h1 className="template-builder__title">Template Builder</h1>
        <div className="template-builder__actions">
          <button
            className={`template-builder__btn template-builder__btn--secondary ${saveStatus}`}
            onClick={() => handleSave(false)}
            disabled={isDisabled}
          >
            {isSaving && !pendingExit ? (
              <>
                <span className="template-builder__spinner" />
                Guardando...
              </>
            ) : saveStatus === 'success' && !pendingExit ? (
              <>
                <span className="template-builder__check">✓</span>
                Guardado
              </>
            ) : saveStatus === 'error' ? (
              'Error al guardar'
            ) : (
              'Guardar'
            )}
          </button>
          <button
            className={`template-builder__btn template-builder__btn--primary ${saveStatus}`}
            onClick={() => handleSave(true)}
            disabled={isDisabled}
          >
            {isSaving && pendingExit ? (
              <>
                <span className="template-builder__spinner" />
                Guardando...
              </>
            ) : saveStatus === 'success' && pendingExit ? (
              <>
                <span className="template-builder__check">✓</span>
                Saliendo...
              </>
            ) : (
              'Guardar y salir'
            )}
          </button>
        </div>
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
