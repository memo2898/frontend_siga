import type {
  TemplatePage,
  TemplateElement,
  PageSize,
  VariableSchemaMap,
  VariableGroupsMap
} from '../../../types/template.types';
import { mmToPixels } from '../../../utils/helpers';
import DroppableElement from './DroppableElement';

export interface CanvasPageProps {
  page: TemplatePage;
  pageSize: PageSize;
  pageIndex: number;
  selectedElementId: string | null;
  onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onElementRemove: (elementId: string) => void;
  onElementSelect: (elementId: string | null) => void;
  onReorderElements: (pageIndex: number, elements: TemplateElement[]) => void;
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
}

export default function CanvasPage({
  page,
  pageSize,
  pageIndex,
  selectedElementId,
  onElementUpdate,
  onElementRemove,
  onElementSelect,
  onReorderElements,
  variableSchema,
  variableGroups
}: CanvasPageProps) {
  const widthPx = mmToPixels(pageSize.width);
  const heightPx = mmToPixels(pageSize.height);

  const handlePageClick = (e: React.MouseEvent) => {
    // Si se hace clic en el fondo de la página, deseleccionar elemento
    if (e.target === e.currentTarget) {
      onElementSelect(null);
    }
  };

  // Separar elementos por tipo de posicionamiento y ordenar los estáticos
  const staticElements = page.elements
    .filter(el => el.positionMode === 'static')
    .sort((a, b) => a.order - b.order);

  const absoluteElements = page.elements.filter(el => el.positionMode === 'absolute');

  const inlineElements = page.elements.filter(el => el.positionMode === 'inline');

  // Combinar elementos estáticos e inline para que fluyan juntos
  // Los inline se intercalan según su posición Y
  const flowElements = [...staticElements, ...inlineElements].sort((a, b) => {
    if (a.positionMode === 'inline' && b.positionMode === 'inline') {
      return a.position.y - b.position.y;
    }
    if (a.positionMode === 'inline') {
      // Los inline se ordenan por su posición Y
      return a.position.y < b.order * 30 ? -1 : 1;
    }
    if (b.positionMode === 'inline') {
      return a.order * 30 < b.position.y ? -1 : 1;
    }
    return a.order - b.order;
  });

  const handleReorder = (draggedId: string, targetId: string) => {
    const draggedIndex = staticElements.findIndex(el => el.id === draggedId);
    const targetIndex = staticElements.findIndex(el => el.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reordered = [...staticElements];
    const [draggedElement] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedElement);

    // Combinar elementos reordenados con los absolutos e inline
    const allElements = [...reordered, ...absoluteElements, ...inlineElements];
    onReorderElements(pageIndex, allElements);
  };

  return (
    <div
      className="canvas-page"
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        position: 'relative',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onClick={handlePageClick}
    >
      {/* Renderizar elementos estáticos e inline intercalados */}
      {flowElements.map(element => (
        <DroppableElement
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onUpdate={onElementUpdate}
          onRemove={onElementRemove}
          onSelect={onElementSelect}
          onReorder={handleReorder}
          variableSchema={variableSchema}
          variableGroups={variableGroups}
        />
      ))}

      {/* Renderizar elementos absolutos al final (encima de todo) */}
      {absoluteElements.map(element => (
        <DroppableElement
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onUpdate={onElementUpdate}
          onRemove={onElementRemove}
          onSelect={onElementSelect}
          onReorder={handleReorder}
          variableSchema={variableSchema}
          variableGroups={variableGroups}
        />
      ))}
    </div>
  );
}
