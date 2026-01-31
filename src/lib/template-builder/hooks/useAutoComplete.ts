import { useState, useCallback, useEffect } from 'react';
import type { VariableSchemaMap } from '../types/template.types';

export interface AutoCompleteOption {
  value: string;
  label: string;
  description?: string;
}

export interface UseAutoCompleteReturn {
  isOpen: boolean;
  options: AutoCompleteOption[];
  selectedIndex: number;
  trigger: string;

  handleInput: (text: string, cursorPosition: number) => void;
  selectOption: (option: AutoCompleteOption) => string;
  close: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  selectCurrent: () => AutoCompleteOption | null;
}

/**
 * Hook para manejar autocompletado de variables Handlebars
 */
export function useAutoComplete(variableSchema?: VariableSchemaMap): UseAutoCompleteReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [trigger, setTrigger] = useState('');

  // Construir opciones basadas en el schema de variables
  const buildOptions = useCallback((prefix: string): AutoCompleteOption[] => {
    if (!variableSchema) return [];

    const results: AutoCompleteOption[] = [];

    const parts = prefix.split('.');
    let currentSchema = variableSchema;
    let currentPath = '';

    // Navegar por el schema según el path
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const variable = currentSchema[part];

      if (!variable) break;

      if (variable.type === 'object' && variable.properties) {
        currentSchema = variable.properties;
        currentPath += (currentPath ? '.' : '') + part;
      } else {
        break;
      }
    }

    // Obtener el último segmento para filtrar
    const filterText = parts[parts.length - 1].toLowerCase();

    // Agregar opciones del schema actual
    Object.entries(currentSchema).forEach(([key, value]) => {
      if (key.toLowerCase().includes(filterText)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;

        results.push({
          value: fullPath,
          label: fullPath,
          description: value.label || `Tipo: ${value.type}`
        });

        // Si es un objeto, agregar sus propiedades también
        if (value.type === 'object' && value.properties) {
          Object.keys(value.properties).forEach(propKey => {
            const propPath = `${fullPath}.${propKey}`;
            if (propPath.toLowerCase().includes(prefix.toLowerCase())) {
              results.push({
                value: propPath,
                label: propPath,
                description: value.properties![propKey].label || `Tipo: ${value.properties![propKey].type}`
              });
            }
          });
        }
      }
    });

    return results;
  }, [variableSchema]);

  // Detectar el trigger {{
  const handleInput = useCallback((text: string, cursorPosition: number) => {
    // Buscar {{ antes del cursor
    const beforeCursor = text.substring(0, cursorPosition);
    const match = beforeCursor.match(/\{\{([^}]*)$/);

    if (match) {
      const variablePrefix = match[1];
      setTrigger(variablePrefix);
      const newOptions = buildOptions(variablePrefix);
      setOptions(newOptions);
      setIsOpen(newOptions.length > 0);
      setSelectedIndex(0);
    } else {
      setIsOpen(false);
      setOptions([]);
      setTrigger('');
    }
  }, [buildOptions]);

  // Seleccionar una opción
  const selectOption = useCallback((option: AutoCompleteOption): string => {
    return `{{${option.value}}}`;
  }, []);

  // Cerrar el autocompletado
  const close = useCallback(() => {
    setIsOpen(false);
    setOptions([]);
    setSelectedIndex(0);
    setTrigger('');
  }, []);

  // Navegar hacia arriba
  const navigateUp = useCallback(() => {
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
  }, [options.length]);

  // Navegar hacia abajo
  const navigateDown = useCallback(() => {
    setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
  }, [options.length]);

  // Seleccionar opción actual
  const selectCurrent = useCallback((): AutoCompleteOption | null => {
    if (options.length === 0) return null;
    return options[selectedIndex] || null;
  }, [options, selectedIndex]);

  // Reset selected index cuando cambien las opciones
  useEffect(() => {
    setSelectedIndex(0);
  }, [options]);

  return {
    isOpen,
    options,
    selectedIndex,
    trigger,

    handleInput,
    selectOption,
    close,
    navigateUp,
    navigateDown,
    selectCurrent
  };
}
