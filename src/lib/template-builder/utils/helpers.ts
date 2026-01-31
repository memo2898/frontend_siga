import type { PageSize, PageFormat, ElementType, TemplateElement, TemplatePage } from '../types/template.types';

/**
 * Genera un ID único
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Obtiene las dimensiones por defecto de una página según su formato
 */
export function getPageDimensions(format: PageFormat, orientation: 'portrait' | 'landscape' = 'portrait'): { width: number; height: number } {
  const dimensions = {
    A4: { width: 210, height: 297 },
    Letter: { width: 215.9, height: 279.4 },
    Legal: { width: 215.9, height: 355.6 },
    Custom: { width: 210, height: 297 }
  };

  const size = dimensions[format];

  if (orientation === 'landscape') {
    return { width: size.height, height: size.width };
  }

  return size;
}

/**
 * Crea un PageSize por defecto
 */
export function createDefaultPageSize(): PageSize {
  return {
    format: 'A4',
    width: 210,
    height: 297,
    orientation: 'portrait'
  };
}

/**
 * Crea un TemplateElement por defecto según su tipo
 */
export function createDefaultElement(type: ElementType, position: { x: number; y: number }): TemplateElement {
  const baseElement: TemplateElement = {
    id: generateId(type.toLowerCase()),
    type,
    position,
    positionMode: 'static',
    styles: {
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#000000'
    },
    order: 0
  };

  switch (type) {
    case 'TEXT':
      return {
        ...baseElement,
        content: 'Texto de ejemplo',
        properties: {
          bold: false,
          italic: false,
          underline: false
        }
      };

    case 'INPUT':
      return {
        ...baseElement,
        styles: {
          ...baseElement.styles,
          width: 200,
          height: 30
        },
        properties: {
          placeholder: 'Ingrese texto',
          inputType: 'text',
          required: false
        }
      };

    case 'RADIO':
      return {
        ...baseElement,
        properties: {
          name: baseElement.id,
          options: [
            { id: generateId('option'), label: 'Opción 1', value: 'option1' },
            { id: generateId('option'), label: 'Opción 2', value: 'option2' }
          ],
          defaultValue: 'option1'
        }
      };

    case 'DIVISOR':
      return {
        ...baseElement,
        styles: {
          ...baseElement.styles,
          width: 500
        },
        properties: {
          lineWidth: 1,
          lineColor: '#000000',
          lineStyle: 'solid'
        }
      };

    case 'IMAGE':
      return {
        ...baseElement,
        styles: {
          ...baseElement.styles,
          width: 200,
          height: 200
        },
        properties: {
          url: '',
          alt: 'Imagen',
          fit: 'contain'
        }
      };

    case 'FIRMA':
      return {
        ...baseElement,
        styles: {
          ...baseElement.styles,
          width: 200,
          height: 80,
          border: '1px solid #000'
        },
        properties: {
          variableName: 'firma_cliente',
          captureMode: 'mouse',
          strokeColor: '#000000',
          strokeWidth: 2,
          backgroundColor: '#ffffff'
        }
      };

    case 'TABLA':
      return {
        ...baseElement,
        styles: {
          ...baseElement.styles,
          width: 500
        },
        properties: {
          linkedVariable: '',
          columns: [
            { id: generateId('col'), header: 'Columna 1', field: 'campo1', width: 150 },
            { id: generateId('col'), header: 'Columna 2', field: 'campo2', width: 150 }
          ],
          borderColor: '#000000',
          borderWidth: 1,
          headerBg: '#f0f0f0',
          headerTextColor: '#000000',
          striped: false,
          stripedColor: '#f9f9f9',
          cellPadding: 8,
          fontSize: 14
        }
      };

    default:
      return baseElement;
  }
}

/**
 * Crea una página vacía
 */
export function createEmptyPage(): TemplatePage {
  return {
    id: generateId('page'),
    elements: []
  };
}

/**
 * Clona profundamente un elemento
 */
export function cloneElement(element: TemplateElement): TemplateElement {
  return JSON.parse(JSON.stringify(element));
}

/**
 * Valida si una posición está dentro de los límites de la página
 */
export function isPositionInBounds(
  position: { x: number; y: number },
  pageSize: PageSize,
  elementSize: { width: number; height: number }
): boolean {
  const maxX = pageSize.width - elementSize.width;
  const maxY = pageSize.height - elementSize.height;

  return position.x >= 0 && position.x <= maxX && position.y >= 0 && position.y <= maxY;
}

/**
 * Ajusta una posición para que esté dentro de los límites
 */
export function constrainPosition(
  position: { x: number; y: number },
  pageSize: PageSize,
  elementSize: { width: number; height: number }
): { x: number; y: number } {
  const maxX = pageSize.width - elementSize.width;
  const maxY = pageSize.height - elementSize.height;

  return {
    x: Math.max(0, Math.min(position.x, maxX)),
    y: Math.max(0, Math.min(position.y, maxY))
  };
}

/**
 * Convierte mm a píxeles (asumiendo 96 DPI)
 */
export function mmToPixels(mm: number): number {
  return (mm * 96) / 25.4;
}

/**
 * Convierte píxeles a mm (asumiendo 96 DPI)
 */
export function pixelsToMm(pixels: number): number {
  return (pixels * 25.4) / 96;
}
