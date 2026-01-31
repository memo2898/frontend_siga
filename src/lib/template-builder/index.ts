// Componentes principales
export { TemplateBuilder, TemplateVisualizer } from './components';

// Tipos
export type {
  TemplateBuilderProps,
  TemplateVisualizerProps
} from './components';

export type {
  Template,
  TemplateElement,
  TemplatePage,
  PageSize,
  ElementType,
  VariableSchemaMap,
  VariableSchema
} from './types/template.types';

// Utilidades
export {
  generateHandlebarsTemplate,
  compileTemplate,
  exportToPDF,
  exportElementToPDF,
  getPDFBlob
} from './utils';

// Hooks (opcional, por si el usuario quiere extender funcionalidad)
export {
  useTemplate,
  useAutoComplete,
  useSignature
} from './hooks';
