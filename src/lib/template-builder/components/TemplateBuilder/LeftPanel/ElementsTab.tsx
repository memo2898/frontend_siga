import type { ElementType, TemplateElement } from '../../../types/template.types';
// import { createDefaultElement } from '../../../../utils/helpers';
import { createDefaultElement } from '../../../utils/helpers';

export interface ElementsTabProps {
  onAddElement: (element: TemplateElement) => void;
}

const ELEMENT_TYPES: { type: ElementType; label: string; icon: string }[] = [
  { type: 'TEXT', label: 'Texto', icon: 'T' },
  // { type: 'INPUT', label: 'Campo de Entrada', icon: '⎵' },
  // { type: 'RADIO', label: 'Radio Buttons', icon: '◉' },
  { type: 'DIVISOR', label: 'Divisor', icon: '─' },
  { type: 'IMAGE', label: 'Imagen', icon: '🖼' },
  { type: 'FIRMA', label: 'Firma', icon: '✍' },
  { type: 'TABLA', label: 'Tabla', icon: '⚏' }
];

export default function ElementsTab({ onAddElement }: ElementsTabProps) {
  const handleElementClick = (type: ElementType) => {
    const element = createDefaultElement(type, { x: 50, y: 50 });
    onAddElement(element);
  };

  return (
    <div className="elements-tab">
      <div className="elements-tab__list">
        {ELEMENT_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            className="element-item"
            onClick={() => handleElementClick(type)}
            title={`Agregar ${label}`}
          >
            <span className="element-item__icon">{icon}</span>
            <span className="element-item__label">{label}</span>
          </button>
        ))}
      </div>
      <div className="elements-tab__hint">
        Haz clic en un elemento para agregarlo al canvas
      </div>
    </div>
  );
}
