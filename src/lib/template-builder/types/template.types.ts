/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos base para el sistema de templates

export type ElementType = 'TEXT' | 'INPUT' | 'RADIO' | 'DIVISOR' | 'IMAGE' | 'FIRMA' | 'TABLA';

export type PositionMode = 'static' | 'absolute' | 'inline';

export type PageFormat = 'A4' | 'Letter' | 'Legal' | 'Custom';

export type Orientation = 'portrait' | 'landscape';

export type CaptureMode = 'mouse' | 'touch' | 'hardware';

export type InputType = 'text' | 'email' | 'number' | 'tel' | 'date';

export type ImageFit = 'contain' | 'cover' | 'fill';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type FontStyle = 'normal' | 'italic' | 'oblique';

// Estructura de posición
export interface Position {
  x: number;
  y: number;
}

// Estructura de tamaño de página
export interface PageSize {
  format: PageFormat;
  width: number;  // en mm
  height: number; // en mm
  orientation: Orientation;
}

// Estilos comunes para elementos
export interface CommonStyles {
  width?: number;
  height?: number;
  margin?: string;
  padding?: string;
  color?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  textAlign?: TextAlign;
  floatDirection?: 'left' | 'right' | 'none';
}

// Propiedades específicas de elemento TEXT
export interface TextProperties {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// Propiedades específicas de elemento INPUT
export interface InputProperties {
  placeholder?: string;
  inputType?: InputType;
  required?: boolean;
}

// Propiedades específicas de elemento RADIO
export interface RadioOption {
  id: string;
  label: string;
  value: string;
}

export interface RadioProperties {
  options: RadioOption[];
  defaultValue?: string;
  name: string;
}

// Propiedades específicas de elemento IMAGE
export interface ImageProperties {
  url?: string;
  alt?: string;
  fit?: ImageFit;
  align?: 'left' | 'center' | 'right';
  floatDirection?: 'left' | 'right' | 'none';
}

// Propiedades específicas de elemento DIVISOR
export interface DivisorProperties {
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineColor?: string;
  lineWidth?: number;
}

// Propiedades específicas de elemento FIRMA
export interface SignatureProperties {
  variableName: string;
  captureMode?: CaptureMode;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
}

// Propiedades específicas de elemento TABLA
export interface TableColumn {
  id: string;
  header: string;
  field: string;
  width?: number;
}

export interface TableProperties {
  linkedVariable?: string;
  columns: TableColumn[];
  borderColor?: string;
  borderWidth?: number;
  headerBg?: string;
  headerTextColor?: string;
  striped?: boolean;
  stripedColor?: string;
  cellPadding?: number;
  fontSize?: number;
}

// Union type para todas las propiedades específicas
export type ElementSpecificProperties =
  | TextProperties
  | InputProperties
  | RadioProperties
  | ImageProperties
  | DivisorProperties
  | SignatureProperties
  | TableProperties;

// Elemento del template
export interface TemplateElement {
  id: string;
  type: ElementType;
  content?: string;
  position: Position;
  positionMode: PositionMode;
  styles: CommonStyles;
  properties?: ElementSpecificProperties;
  order: number;
}

// Página del template
export interface TemplatePage {
  id: string;
  elements: TemplateElement[];
}

// Template completo
export interface Template {
  id: string;
  name: string;
  pageSize: PageSize;
  pages: TemplatePage[];
}

// Schema de variables para el Template Builder
export type VariableType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array' | 'signature';

export interface VariableSchema {
  type: VariableType;
  label: string;
  example?: any;
  properties?: Record<string, VariableSchema>; // Para type: 'object'
  itemSchema?: Record<string, VariableSchema>; // Para type: 'array'
}

export interface VariableSchemaMap {
  [key: string]: VariableSchema;
}

// Nueva estructura de grupos de variables (arrays de objetos)
export interface VariableGroup {
  groupLabel: string;
  schema: Record<string, VariableSchema>;
}

export interface VariableGroupsMap {
  [groupKey: string]: VariableGroup;
}

// Props del Template Builder
export interface TemplateBuilderProps {
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
  initialPageSize?: Partial<PageSize>;
  initialTemplate?: Template;
  onSave?: (template: Template, hbsTemplate: string) => void;
  onChange?: (template: Template) => void;
}

// Props del Template Visualizer
export interface TemplateVisualizerProps {
  template: string; // Template HBS como string
  data: Record<string, any>;
  onComplete?: (finalData: Record<string, any>) => void;
  onPrint?: () => void;
  mode?: 'preview' | 'interactive';
}

// Estados del Visualizer
export type VisualizerMode = 'preview' | 'awaiting_signature' | 'ready_to_print';

export interface SignatureField {
  id: string;
  label: string;
  variableName: string;
  captured: boolean;
  data?: string; // base64
}

export interface VisualizerState {
  mode: VisualizerMode;
  signatures: SignatureField[];
  signatureModalOpen: boolean;
  currentSignatureField: string | null;
}
