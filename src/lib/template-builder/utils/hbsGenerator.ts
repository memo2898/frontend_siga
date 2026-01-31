import type { Template, TemplateElement, TemplatePage } from '../types/template.types';

/**
 * Genera un template Handlebars a partir de la estructura del Template
 */
export function generateHandlebarsTemplate(template: Template): string {
  const { pages, pageSize } = template;

  const styles = generateStyles(pageSize);
  const bodyContent = pages.map((page, index) => generatePage(page, index, pageSize)).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <style>
${styles}
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

/**
 * Genera los estilos CSS del template
 */
function generateStyles(pageSize: Template['pageSize']): string {
  return `    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }

    .page {
      width: ${pageSize.width}mm;
      height: ${pageSize.height}mm;
      background-color: white;
      margin: 20px auto;
      padding: 20mm;
      position: relative;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .element-static {
      position: relative;
      display: block;
      margin-bottom: 10px;
    }

    .element-absolute {
      position: absolute;
    }

    .element-text {
      line-height: 1.5;
    }

    .element-input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .element-radio {
      display: flex;
      gap: 15px;
    }

    .element-radio label {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .element-divisor {
      border: none;
      border-top: 1px solid #000;
      margin: 10px 0;
    }

    .element-image img {
      max-width: 100%;
      height: auto;
    }

    .element-signature {
      border-bottom: 1px solid #000;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .element-signature img {
      max-width: 100%;
      max-height: 100%;
    }

    .element-table {
      width: 100%;
      border-collapse: collapse;
    }

    .element-table th,
    .element-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .element-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    @media print {
      body {
        background-color: white;
      }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }`;
}

/**
 * Genera el HTML de una página
 */
function generatePage(page: TemplatePage, index: number, pageSize: Template['pageSize']): string {
  const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
  const elementsHtml = sortedElements.map(element => generateElement(element)).join('\n    ');

  return `  <div class="page" id="page-${index + 1}">
    ${elementsHtml}
  </div>`;
}

/**
 * Genera el HTML de un elemento individual
 */
function generateElement(element: TemplateElement): string {
  const positionClass = element.positionMode === 'absolute' ? 'element-absolute' : 'element-static';
  const inlineStyles = generateInlineStyles(element);

  switch (element.type) {
    case 'TEXT':
      return generateTextElement(element, positionClass, inlineStyles);
    case 'INPUT':
      return generateInputElement(element, positionClass, inlineStyles);
    case 'RADIO':
      return generateRadioElement(element, positionClass, inlineStyles);
    case 'DIVISOR':
      return generateDivisorElement(element, positionClass, inlineStyles);
    case 'IMAGE':
      return generateImageElement(element, positionClass, inlineStyles);
    case 'FIRMA':
      return generateSignatureElement(element, positionClass, inlineStyles);
    case 'TABLA':
      return generateTableElement(element, positionClass, inlineStyles);
    default:
      return '';
  }
}

/**
 * Genera estilos inline para un elemento
 */
function generateInlineStyles(element: TemplateElement): string {
  const styles: string[] = [];
  const { position, positionMode, styles: elementStyles } = element;

  if (positionMode === 'absolute') {
    styles.push(`left: ${position.x}px`);
    styles.push(`top: ${position.y}px`);
  }

  if (elementStyles.width) styles.push(`width: ${elementStyles.width}px`);
  if (elementStyles.height) styles.push(`height: ${elementStyles.height}px`);
  if (elementStyles.margin) styles.push(`margin: ${elementStyles.margin}`);
  if (elementStyles.padding) styles.push(`padding: ${elementStyles.padding}`);
  if (elementStyles.color) styles.push(`color: ${elementStyles.color}`);
  if (elementStyles.backgroundColor) styles.push(`background-color: ${elementStyles.backgroundColor}`);
  if (elementStyles.border) styles.push(`border: ${elementStyles.border}`);
  if (elementStyles.borderRadius) styles.push(`border-radius: ${elementStyles.borderRadius}`);
  if (elementStyles.fontSize) styles.push(`font-size: ${elementStyles.fontSize}px`);
  if (elementStyles.fontFamily) styles.push(`font-family: ${elementStyles.fontFamily}`);
  if (elementStyles.fontWeight) styles.push(`font-weight: ${elementStyles.fontWeight}`);
  if (elementStyles.textAlign) styles.push(`text-align: ${elementStyles.textAlign}`);

  return styles.join('; ');
}

/**
 * Genera elemento TEXT
 */
function generateTextElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const content = element.content || '';
  const props = element.properties as any;

  const additionalStyles: string[] = [];
  if (props?.bold) additionalStyles.push('font-weight: bold');
  if (props?.italic) additionalStyles.push('font-style: italic');
  if (props?.underline) additionalStyles.push('text-decoration: underline');

  const finalStyles = [inlineStyles, ...additionalStyles].filter(Boolean).join('; ');

  return `<div class="${positionClass} element-text" id="${element.id}" style="${finalStyles}">
      ${content}
    </div>`;
}

/**
 * Genera elemento INPUT
 */
function generateInputElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const props = element.properties as any;
  const placeholder = props?.placeholder || '';
  const inputType = props?.inputType || 'text';
  const required = props?.required ? 'required' : '';

  return `<input
      type="${inputType}"
      class="${positionClass} element-input"
      id="${element.id}"
      placeholder="${placeholder}"
      ${required}
      style="${inlineStyles}"
    />`;
}

/**
 * Genera elemento RADIO
 */
function generateRadioElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const props = element.properties as any;
  const options = props?.options || [];
  const name = props?.name || element.id;
  const defaultValue = props?.defaultValue || '';

  const optionsHtml = options.map((option: any) => {
    const checked = option.value === defaultValue ? 'checked' : '';
    return `<label>
        <input type="radio" name="${name}" value="${option.value}" ${checked} />
        ${option.label}
      </label>`;
  }).join('\n      ');

  return `<div class="${positionClass} element-radio" id="${element.id}" style="${inlineStyles}">
      ${optionsHtml}
    </div>`;
}

/**
 * Genera elemento DIVISOR
 */
function generateDivisorElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  return `<hr class="${positionClass} element-divisor" id="${element.id}" style="${inlineStyles}" />`;
}

/**
 * Genera elemento IMAGE
 */
function generateImageElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const props = element.properties as any;
  const url = props?.url || '';
  const alt = props?.alt || '';
  const fit = props?.fit || 'contain';

  const imageStyles = `object-fit: ${fit}; ${inlineStyles}`;

  return `<div class="${positionClass} element-image" id="${element.id}">
      <img src="${url}" alt="${alt}" style="${imageStyles}" />
    </div>`;
}

/**
 * Genera elemento FIRMA
 */
function generateSignatureElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const props = element.properties as any;
  const variableName = props?.variableName || 'firma';

  return `<div class="${positionClass} element-signature" id="${element.id}" style="${inlineStyles}">
      {{#if ${variableName}}}
        <img src="{{${variableName}}}" alt="Firma" />
      {{/if}}
    </div>`;
}

/**
 * Genera elemento TABLA
 */
function generateTableElement(element: TemplateElement, positionClass: string, inlineStyles: string): string {
  const props = element.properties as any;
  const linkedVariable = props?.linkedVariable || '';
  const columns = props?.columns || [];

  const headerHtml = columns.map((col: any) => `<th>${col.header}</th>`).join('');
  const rowHtml = columns.map((col: any) => `<td>{{${col.field}}}</td>`).join('');

  if (linkedVariable) {
    return `<table class="${positionClass} element-table" id="${element.id}" style="${inlineStyles}">
      <thead>
        <tr>${headerHtml}</tr>
      </thead>
      <tbody>
        {{#each ${linkedVariable}}}
        <tr>${rowHtml}</tr>
        {{/each}}
      </tbody>
    </table>`;
  } else {
    return `<table class="${positionClass} element-table" id="${element.id}" style="${inlineStyles}">
      <thead>
        <tr>${headerHtml}</tr>
      </thead>
      <tbody>
        <tr>${rowHtml}</tr>
      </tbody>
    </table>`;
  }
}
