/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// uiX - SelectX Component (FIXED)
// ============================================

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useFormXContext } from "../FormX/FormX.context";
import {
  type InputRules,
  type ValidateOn,
  type FieldValidationResult,
  type FieldRegistration,
  type SelectXOption,
} from "../../types";
import { validateField, normalizedIncludes } from "../../utils";
import "./SelectX.css";

export interface SelectXProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectXOption[];
  value?: string | number | null; // CAMBIADO de defaultValue a value
  defaultValue?: string | number | null;
  rules?: InputRules;
  validateOn?: ValidateOn;
  helperText?: string;
  disabled?: boolean;
  allowFreeText?: boolean;
  noResultsText?: string;
  className?: string;
  onChange?: (value: string | number | null, option: SelectXOption | null) => void;
  onBlur?: () => void;
}

export const SelectX: React.FC<SelectXProps> = ({
  name,
  label,
  placeholder = "Seleccionar...",
  options,
  value, // NUEVO: para modo controlado
  defaultValue, // Mantener para compatibilidad
  rules = {},
  validateOn: inputValidateOn,
  helperText,
  disabled = false,
  allowFreeText = false,
  noResultsText = "No se encontraron resultados",
  className,
  onChange,
  onBlur,
}) => {
  const formContext = useFormXContext();
  
  // Determinar el valor inicial (priorizar value sobre defaultValue)
  const initialValue = value !== undefined ? value : defaultValue;
  
  // Inicializar con el valor inicial
  const [searchText, setSearchText] = useState(() => {
    if (initialValue !== undefined && initialValue !== null) {
      const initialOption = options.find(opt => opt.value === initialValue);
      return initialOption ? initialOption.label : "";
    }
    return "";
  });
  
  const [selectedOption, setSelectedOption] = useState<SelectXOption | null>(() => {
    if (initialValue !== undefined && initialValue !== null) {
      return options.find(opt => opt.value === initialValue) || null;
    }
    return null;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar con value cuando cambia (para modo controlado)
  useEffect(() => {
    if (value !== undefined) {
      if (value !== null) {
        const valueOption = options.find(opt => opt.value === value);
        if (valueOption) {
          setSelectedOption(valueOption);
          setSearchText(valueOption.label);
        } else {
          setSelectedOption(null);
          setSearchText("");
        }
      } else {
        setSelectedOption(null);
        setSearchText("");
      }
    }
  }, [value, options]);

  // Determine validateOn
  const effectiveValidateOn = inputValidateOn ?? formContext?.validateOn ?? "blur";

  // Check if required
  const isRequired = rules.validations?.some((v) => v.type === "required") || false;

  // Get current value for form
  const getCurrentValue = useCallback((): string | number | null => {
    if (selectedOption) {
      return selectedOption.value;
    }
    if (allowFreeText && searchText.trim()) {
      return searchText.trim();
    }
    return null;
  }, [selectedOption, allowFreeText, searchText]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchText.trim()) {
      return options;
    }
    return options.filter((opt) => normalizedIncludes(opt.label, searchText));
  }, [options, searchText]);

  // Validate
  const validateCurrentValue = useCallback((): FieldValidationResult => {
    const currentValue = getCurrentValue();
    
    if (!rules.validations || rules.validations.length === 0) {
      return { name, value: currentValue, isValid: true, errors: [] };
    }

    return validateField(name, currentValue, rules.validations);
  }, [name, getCurrentValue, rules.validations]);

  // Handle validation trigger
  const triggerValidation = useCallback(() => {
    const result = validateCurrentValue();
    setErrors(result.isValid ? [] : result.errors);
  }, [validateCurrentValue]);

  // Open dropdown
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [disabled]);

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // Handle option select
  const handleSelect = useCallback((option: SelectXOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    setSearchText(option.label);
    closeDropdown();
    setErrors([]);
    
    onChange?.(option.value, option);

    // Validate on change if configured
    if (effectiveValidateOn === "change") {
      setTouched(true);
      if (rules.validations && rules.validations.length > 0) {
        const result = validateField(name, option.value, rules.validations);
        setErrors(result.isValid ? [] : result.errors);
      }
    }
  }, [closeDropdown, onChange, effectiveValidateOn, name, rules.validations]);

  // Handle clear
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchText("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
    
    onChange?.(null, null);

    if (effectiveValidateOn === "change") {
      setTouched(true);
      if (rules.validations && rules.validations.length > 0) {
        const result = validateField(name, null, rules.validations);
        setErrors(result.isValid ? [] : result.errors);
      }
    }
  }, [onChange, effectiveValidateOn, name, rules.validations]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    setSelectedOption(null);
    setHighlightedIndex(-1);
    
    if (!isOpen) {
      openDropdown();
    }

    if (allowFreeText) {
      onChange?.(inputValue || null, null);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    openDropdown();
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay para permitir que onMouseDown se ejecute primero
    setTimeout(() => {
      setTouched(true);

      // If not allowFreeText and no selection, clear the search
      if (!allowFreeText && !selectedOption) {
        setSearchText("");
      }

      onBlur?.();

      // Validate on blur if configured
      if (effectiveValidateOn === "blur") {
        triggerValidation();
      }
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;

      case "Enter":
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          const indexToSelect = highlightedIndex >= 0 ? highlightedIndex : 0;
          handleSelect(filteredOptions[indexToSelect]);
        }
        break;

      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;

      case "Tab":
        closeDropdown();
        break;
    }
  };

  // Handle arrow click
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
      inputRef.current?.focus();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
        
        // Clear search if no selection and not allowFreeText
        if (!allowFreeText && !selectedOption) {
          setSearchText("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown, allowFreeText, selectedOption]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Register with FormX context
  useEffect(() => {
    if (!formContext) return;

    const registration: FieldRegistration = {
      name,
      getValue: getCurrentValue,
      validate: validateCurrentValue,
      setError: (errs) => setErrors(errs),
      clearError: () => setErrors([]),
    };

    formContext.registerField(registration);

    return () => {
      formContext.unregisterField(name);
    };
  }, [formContext, name, getCurrentValue, validateCurrentValue]);

  // Update registration when value changes
  useEffect(() => {
    if (!formContext) return;

    const registration: FieldRegistration = {
      name,
      getValue: getCurrentValue,
      validate: validateCurrentValue,
      setError: (errs) => setErrors(errs),
      clearError: () => setErrors([]),
    };

    formContext.registerField(registration);
  }, [selectedOption, searchText, formContext, name, getCurrentValue, validateCurrentValue]);

  // Determine state
  const hasError = errors.length > 0;
  const hasValue = selectedOption !== null || (allowFreeText && searchText.trim() !== "");

  const inputClassName = [
    "selectx-input",
    hasError && "error",
    isOpen && "open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="selectx-container" ref={containerRef}>
      {label && (
        <label
          htmlFor={name}
          className={`selectx-label ${isRequired ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <div className="selectx-input-wrapper">
        <input
          ref={inputRef}
          id={name}
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassName}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />

        <div className="selectx-icons">
          {hasValue && !disabled && (
            <button
              type="button"
              className="selectx-clear"
              onMouseDown={handleClear}
              tabIndex={-1}
              aria-label="Limpiar selección"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <div
            className={`selectx-arrow ${isOpen ? "open" : ""}`}
            onMouseDown={handleArrowClick}
            aria-label="Abrir lista"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="selectx-dropdown"
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={[
                    "selectx-option",
                    index === highlightedIndex && "highlighted",
                    selectedOption?.value === option.value && "selected",
                    option.disabled && "disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevenir que el input pierda el foco
                    handleSelect(option);
                  }}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                  aria-disabled={option.disabled}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="selectx-no-results">{noResultsText}</div>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <div className="selectx-error" id={`${name}-error`} role="alert">
          <svg
            className="selectx-error-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <ul className="selectx-error-list">
            {errors.map((error, index) => (
              <li key={index} className="selectx-error-item">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasError && helperText && (
        <span className="selectx-helper">{helperText}</span>
      )}
    </div>
  );
};

export default SelectX;