import { useRef, useEffect, useCallback, useState } from 'react';
import type { VariableGroupsMap } from '../../../types/template.types';
import './VariableEditor.css';

interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

export interface VariableEditorProps {
  value: string;
  onChange: (value: string) => void;
  variableGroups?: VariableGroupsMap;
  rows?: number;
  placeholder?: string;
}

export default function VariableEditor({
  value,
  onChange,
  variableGroups,
  rows = 4,
  placeholder = ''
}: VariableEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [currentPrefix, setCurrentPrefix] = useState('');

  // Obtener todas las variables válidas del schema
  const getValidVariables = useCallback((): Set<string> => {
    const validVars = new Set<string>();

    if (!variableGroups) return validVars;

    Object.entries(variableGroups).forEach(([groupKey, group]) => {
      validVars.add(groupKey);
      Object.keys(group.schema).forEach(fieldKey => {
        validVars.add(fieldKey);
        validVars.add(`${groupKey}.${fieldKey}`);
      });
    });

    return validVars;
  }, [variableGroups]);

  // Verificar si una variable es válida
  const isValidVariable = useCallback((variable: string): boolean => {
    const validVars = getValidVariables();
    const cleanVar = variable.trim();

    if (cleanVar.startsWith('#each ') || cleanVar.startsWith('/each')) {
      const groupName = cleanVar.replace('#each ', '').replace('/each', '').trim();
      return validVars.has(groupName) || groupName === '';
    }

    return validVars.has(cleanVar);
  }, [getValidVariables]);

  // Construir opciones de autocompletado basadas en el prefijo
  const buildAutocompleteOptions = useCallback((prefix: string): AutocompleteOption[] => {
    if (!variableGroups) return [];

    const options: AutocompleteOption[] = [];
    const lowerPrefix = prefix.toLowerCase();

    // Si el prefijo contiene un punto, buscar en el grupo específico
    if (prefix.includes('.')) {
      const [groupKey, fieldPrefix] = prefix.split('.');
      const group = variableGroups[groupKey];

      if (group) {
        Object.entries(group.schema).forEach(([fieldKey, fieldSchema]) => {
          if (fieldKey.toLowerCase().startsWith(fieldPrefix.toLowerCase())) {
            options.push({
              value: `${groupKey}.${fieldKey}`,
              label: fieldKey,
              description: fieldSchema.label
            });
          }
        });
      }
    } else {
      // Buscar en grupos y campos
      Object.entries(variableGroups).forEach(([groupKey, group]) => {
        // Agregar el grupo si coincide
        if (groupKey.toLowerCase().startsWith(lowerPrefix)) {
          options.push({
            value: groupKey,
            label: groupKey,
            description: `${group.groupLabel} (grupo)`
          });
        }

        // Agregar campos del grupo que coincidan
        Object.entries(group.schema).forEach(([fieldKey, fieldSchema]) => {
          if (fieldKey.toLowerCase().startsWith(lowerPrefix)) {
            options.push({
              value: fieldKey,
              label: fieldKey,
              description: `${fieldSchema.label} (${group.groupLabel})`
            });
          }
        });
      });
    }

    return options.slice(0, 8); // Limitar a 8 opciones
  }, [variableGroups]);

  // Renderizar el texto con resaltado de variables
  const renderHighlightedText = useCallback((text: string): string => {
    if (!text) return '';

    const regex = /(\{\{[^}]*\}\})/g;

    return text.replace(regex, (match) => {
      const varName = match.slice(2, -2);
      const isValid = isValidVariable(varName);

      const className = isValid
        ? 'variable-highlight variable-highlight--valid'
        : 'variable-highlight variable-highlight--invalid';

      const escapedMatch = match
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `<span class="${className}">${escapedMatch}</span>`;
    })
    .replace(/\n/g, '<br>')
    + '<br>';
  }, [isValidVariable]);

  // Calcular posición del cursor para el dropdown
  const calculateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { top: 0, left: 0 };

    // Crear un elemento temporal para medir la posición
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(textarea);

    mirror.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: ${style.fontFamily};
      font-size: ${style.fontSize};
      line-height: ${style.lineHeight};
      padding: ${style.padding};
      width: ${textarea.offsetWidth}px;
    `;

    const textBeforeCursor = value.substring(0, textarea.selectionStart);
    mirror.textContent = textBeforeCursor;

    const marker = document.createElement('span');
    marker.textContent = '|';
    mirror.appendChild(marker);

    document.body.appendChild(mirror);

    const markerRect = marker.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    document.body.removeChild(mirror);

    return {
      top: markerRect.top - textareaRect.top + textarea.offsetTop + 20,
      left: Math.min(markerRect.left - textareaRect.left + textarea.offsetLeft, textarea.offsetWidth - 200)
    };
  };

  // Detectar y manejar autocompletado
  const checkForAutocomplete = (text: string, cursorPos: number) => {
    const beforeCursor = text.substring(0, cursorPos);
    const match = beforeCursor.match(/\{\{([^}\s]*)$/);

    if (match) {
      const prefix = match[1];
      setCurrentPrefix(prefix);

      const options = buildAutocompleteOptions(prefix);

      if (options.length > 0) {
        setAutocompleteOptions(options);
        setSelectedIndex(0);
        setAutocompletePosition(calculateCursorPosition());
        setShowAutocomplete(true);
      } else {
        setShowAutocomplete(false);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  // Insertar la opción seleccionada
  const insertOption = (option: AutocompleteOption) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeCursor = value.substring(0, cursorPos);
    const afterCursor = value.substring(cursorPos);

    // Encontrar donde empieza la variable actual
    const match = beforeCursor.match(/\{\{([^}\s]*)$/);
    if (!match) return;

    const startPos = cursorPos - match[1].length;
    const newText = beforeCursor.substring(0, startPos) + option.value + afterCursor;

    onChange(newText);
    setShowAutocomplete(false);

    // Posicionar cursor después del valor insertado
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const newCursorPos = startPos + option.value.length;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    });
  };

  // Manejar input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const newValue = textarea.value;
    const cursorPos = textarea.selectionStart;

    const beforeCursor = newValue.substring(0, cursorPos);

    // Auto-completar {{}}
    if (beforeCursor.endsWith('{{')) {
      const afterCursor = newValue.substring(cursorPos);

      if (!afterCursor.startsWith('}}')) {
        const newText = beforeCursor + '}}' + afterCursor;
        onChange(newText);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = cursorPos;
            textareaRef.current.selectionEnd = cursorPos;
            checkForAutocomplete(newText, cursorPos);
          }
        });
        return;
      }
    }

    onChange(newValue);

    // Verificar autocompletado después del cambio
    requestAnimationFrame(() => {
      checkForAutocomplete(newValue, cursorPos);
    });
  };

  // Manejar teclas especiales
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % autocompleteOptions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + autocompleteOptions.length) % autocompleteOptions.length);
        break;
      case 'Enter':
      case 'Tab':
        if (autocompleteOptions.length > 0) {
          e.preventDefault();
          insertOption(autocompleteOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
    }
  };

  // Sincronizar scroll
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    setShowAutocomplete(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actualizar highlight
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = renderHighlightedText(value);
    }
  }, [value, renderHighlightedText]);

  return (
    <div className="variable-editor">
      <div
        ref={highlightRef}
        className="variable-editor__highlight"
        aria-hidden="true"
      />
      <textarea
        ref={textareaRef}
        className="variable-editor__textarea"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        rows={rows}
        placeholder={placeholder}
        spellCheck={false}
      />

      {/* Dropdown de autocompletado */}
      {showAutocomplete && autocompleteOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="variable-editor__dropdown"
          style={{ top: autocompletePosition.top, left: autocompletePosition.left }}
        >
          {autocompleteOptions.map((option, index) => (
            <div
              key={option.value}
              className={`variable-editor__option ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => insertOption(option)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="variable-editor__option-label">{option.label}</span>
              {option.description && (
                <span className="variable-editor__option-desc">{option.description}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
