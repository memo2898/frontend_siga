import { useState } from 'react';
import type {
  Template,
  TemplatePage,
  TemplateElement,
  PageSize,
  VariableSchemaMap,
  VariableGroupsMap
} from '../../../types/template.types';
import { getPageDimensions, mmToPixels } from '../../../utils/helpers';
import CanvasPage from './CanvasPage';
import './Canvas.css';

export interface CanvasProps {
  template: Template;
  currentPageIndex: number;
  currentPage: TemplatePage | null;
  selectedElementId: string | null;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onRemovePage: (pageId: string) => void;
  onPageSizeChange: (pageSize: Partial<PageSize>) => void;
  onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onElementRemove: (elementId: string) => void;
  onElementSelect: (elementId: string | null) => void;
  onReorderElements: (pageIndex: number, elements: TemplateElement[]) => void;
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
}

export default function Canvas({
  template,
  currentPageIndex,
  currentPage,
  selectedElementId,
  onPageChange,
  onAddPage,
  onRemovePage,
  onPageSizeChange,
  onElementUpdate,
  onElementRemove,
  onElementSelect,
  onReorderElements,
  variableSchema,
  variableGroups
}: CanvasProps) {
  const [zoom, setZoom] = useState(1);

  const { pageSize, pages } = template;

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value as PageSize['format'];
    const dimensions = getPageDimensions(format, pageSize.orientation);
    onPageSizeChange({
      format,
      ...dimensions
    });
  };

  const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orientation = e.target.value as 'portrait' | 'landscape';
    const dimensions = getPageDimensions(pageSize.format, orientation);
    onPageSizeChange({
      orientation,
      ...dimensions
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleZoomReset = () => setZoom(1);

  const handleDeletePage = () => {
    if (currentPage && pages.length > 1) {
      onRemovePage(currentPage.id);
    }
  };

  return (
    <div className="canvas">
      {/* Header con controles */}
      <div className="canvas__header">
        <div className="canvas__controls">
          <select
            className="canvas__format-select"
            value={pageSize.format}
            onChange={handleFormatChange}
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
            <option value="Custom">Personalizado</option>
          </select>

          <select
            className="canvas__orientation-select"
            value={pageSize.orientation}
            onChange={handleOrientationChange}
          >
            <option value="portrait">Vertical</option>
            <option value="landscape">Horizontal</option>
          </select>

          <button className="canvas__btn" onClick={onAddPage} title="Agregar página">
            + Página
          </button>

          <div className="canvas__page-info">
            Página {currentPageIndex + 1} / {pages.length}
          </div>

          {pages.length > 1 && (
            <button
              className="canvas__btn canvas__btn--danger"
              onClick={handleDeletePage}
              title="Eliminar página actual"
            >
              🗑️
            </button>
          )}
        </div>

        <div className="canvas__zoom-controls">
          <button onClick={handleZoomOut} title="Alejar">−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} title="Acercar">+</button>
          <button onClick={handleZoomReset} title="Reset">⟲</button>
        </div>
      </div>

      {/* Área de páginas con scroll */}
      <div className="canvas__workspace">
        <div className="canvas__pages" style={{ transform: `scale(${zoom})` }}>
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`canvas__page-wrapper ${index === currentPageIndex ? 'active' : ''}`}
              onClick={() => onPageChange(index)}
            >
              {index === currentPageIndex && currentPage ? (
                <CanvasPage
                  page={currentPage}
                  pageSize={pageSize}
                  pageIndex={currentPageIndex}
                  selectedElementId={selectedElementId}
                  onElementUpdate={onElementUpdate}
                  onElementRemove={onElementRemove}
                  onElementSelect={onElementSelect}
                  onReorderElements={onReorderElements}
                  variableSchema={variableSchema}
                  variableGroups={variableGroups}
                />
              ) : (
                <div
                  className="canvas__page-preview"
                  style={{
                    width: `${mmToPixels(pageSize.width)}px`,
                    height: `${mmToPixels(pageSize.height)}px`
                  }}
                >
                  <span>Página {index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
