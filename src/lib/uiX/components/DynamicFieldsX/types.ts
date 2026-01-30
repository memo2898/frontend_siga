/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - DynamicFieldsX Types
// ============================================

import { type InputRules, type SelectXOption } from "../../types";

// Tipos de componentes disponibles
export type FieldComponent = 
  | "Input"
  | "Select"
  | "Checkbox"
  | "Date"
  | "Textarea"
  | "File";

// Tipos de input para el componente Input
export type InputType = "text" | "number" | "email" | "password";

// Tipos de opciones para Select
export type OptionsType = "inline" | "reference";

// Definición de un campo (usado en contract="define" y como schema)
export interface FieldDefinition {
  id: string;
  component: FieldComponent;
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  type?: InputType;
  rules?: InputRules;

  // Para Select
  optionsType?: OptionsType;           // Tipo: inline o reference
  options?: string | SelectXOption[];  // Puede ser string (referencia) o array directo
  optionsRef?: string;                 // Nombre de la referencia en optionsResolvers
  allowFreeText?: boolean;

  // Para File
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}


// Campo simple (usado en contract="extend" y "none")
export interface SimpleField {
  id: string;
  name: string;
  label: string;
  input_type: "text" | "number" | "checkbox";  // input_type
  value: any;
}
// Contratos disponibles
export type ContractType = "define" | "follow" | "extend" | "none";

// Props del componente principal
export interface DynamicFieldsXProps {
  name: string;                  // Nombre para registrar en FormX
  contract: ContractType;
  
  // Para "define": schema que se está creando
  // Para "follow"/"extend": datos que se llenan
  // Para "none": campos libres
  value: FieldDefinition[] | Record<string, any> | SimpleField[];
  onChange: (value: any) => void;
  
  // Solo para "follow" y "extend": el schema a seguir
  schema?: FieldDefinition[];
  
  // Solo para "extend": campos adicionales
  extraFields?: SimpleField[];
  onExtraFieldsChange?: (fields: SimpleField[]) => void;
  
  // Resolver referencias de opciones para Select
  optionsResolvers?: Record<string, SelectXOption[]>;
  
  // Opcionales
  disabled?: boolean;
  className?: string;
  label?: string;
}

// Props para el formulario de metadata de campo
export interface FieldMetadataFormProps {
  field?: FieldDefinition;       // Si es edición
  onSave: (field: FieldDefinition) => void;
  onCancel: () => void;
}

// Props para el formulario de campo simple
export interface SimpleFieldFormProps {
  onSave: (field: SimpleField) => void;
  onCancel: () => void;
}

// Props para el card de campo
export interface FieldCardProps {
  field: FieldDefinition | SimpleField;
  index: number;
  onEdit?: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isDragging?: boolean;
  isSimple?: boolean;
}

// Utilidad para generar IDs únicos
export function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Formato simplificado de schema (para facilitar uso)
// ============================================

export interface SimpleSchemaField {
  nombre: string;
  etiqueta: string;
  tipo: "text" | "number" | "email" | "password" | "select" | "checkbox" | "date" | "textarea" | "file";
  requerido?: boolean;
  validacion?: string;  // Regex pattern
  placeholder?: string;
  ayuda?: string;       // Helper text
  opciones?: string[] | Array<{ valor: string; etiqueta: string }>;  // Para select
  // Para file
  aceptar?: string;     // MIME types
  multiple?: boolean;
  tamanoMaximo?: number;
}

/**
 * Transforma un schema en formato simplificado al formato FieldDefinition
 *
 * @example
 * const simpleSchema = [
 *   { nombre: "imei", etiqueta: "IMEI", tipo: "text", requerido: true, validacion: "^[0-9]{15}$" },
 *   { nombre: "color", etiqueta: "Color", tipo: "select", opciones: ["Negro", "Blanco"] }
 * ];
 * const schema = transformSchema(simpleSchema);
 */
export function transformSchema(simpleSchema: SimpleSchemaField[]): FieldDefinition[] {
  return simpleSchema.map((field, index) => {
    const id = `field_${index + 1}_${Date.now()}`;

    // Determinar componente según tipo
    let component: FieldComponent;
    let inputType: InputType | undefined;

    switch (field.tipo) {
      case "text":
        component = "Input";
        inputType = "text";
        break;
      case "number":
        component = "Input";
        inputType = "number";
        break;
      case "email":
        component = "Input";
        inputType = "email";
        break;
      case "password":
        component = "Input";
        inputType = "password";
        break;
      case "select":
        component = "Select";
        break;
      case "checkbox":
        component = "Checkbox";
        break;
      case "date":
        component = "Date";
        break;
      case "textarea":
        component = "Textarea";
        break;
      case "file":
        component = "File";
        break;
      default:
        component = "Input";
        inputType = "text";
    }

    // Construir validaciones
    const validations: any[] = [];
    if (field.requerido) {
      validations.push({ type: "required", message: `${field.etiqueta} es requerido` });
    }
    if (field.validacion) {
      validations.push({ type: "pattern", value: field.validacion, message: `Formato inválido para ${field.etiqueta}` });
    }

    // Construir campo
    const result: FieldDefinition = {
      id,
      component,
      name: field.nombre,
      label: field.etiqueta,
    };

    // Agregar type si es Input
    if (inputType) {
      result.type = inputType;
    }

    // Agregar placeholder y helperText
    if (field.placeholder) {
      result.placeholder = field.placeholder;
    }
    if (field.ayuda) {
      result.helperText = field.ayuda;
    }

    // Agregar validaciones si hay
    if (validations.length > 0) {
      result.rules = { validations };
    }

    // Agregar opciones para Select
    if (component === "Select" && field.opciones) {
      result.optionsType = "inline";
      // Transformar opciones
      if (Array.isArray(field.opciones)) {
        result.options = field.opciones.map((opt) => {
          if (typeof opt === "string") {
            // Opciones como strings: ["Negro", "Blanco"]
            const value = opt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
            return { value, label: opt };
          } else {
            // Opciones como objetos: [{ valor: "negro", etiqueta: "Negro" }]
            return { value: opt.valor, label: opt.etiqueta };
          }
        });
      }
    }

    // Agregar config para File
    if (component === "File") {
      if (field.aceptar) {
        result.accept = field.aceptar;
      }
      if (field.multiple !== undefined) {
        result.multiple = field.multiple;
      }
      if (field.tamanoMaximo) {
        result.maxSize = field.tamanoMaximo;
      }
    }

    return result;
  });
}