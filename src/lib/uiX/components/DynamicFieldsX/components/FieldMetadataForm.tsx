/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - FieldMetadataForm Component
// ============================================

import React, { useState, useEffect } from "react";
import {
  type FieldMetadataFormProps,
  type FieldDefinition,
  type FieldComponent,
  type InputType,
  type OptionsType,
  generateId,
} from "../types";
import { type ValidationRule, type SelectXOption } from "../../../types";

const COMPONENT_OPTIONS: { value: FieldComponent; label: string }[] = [
  { value: "Input", label: "Input (texto, número, email)" },
  { value: "Select", label: "Select (lista desplegable)" },
  { value: "Checkbox", label: "Checkbox (sí/no)" },
  { value: "Date", label: "Fecha" },
  { value: "Textarea", label: "Textarea (texto largo)" },
  { value: "File", label: "Archivo" },
];

const INPUT_TYPE_OPTIONS: { value: InputType; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "email", label: "Email" },
  { value: "password", label: "Contraseña" },
];

const VALIDATION_OPTIONS = [
  { type: "required", label: "Requerido", hasValue: false },
  { type: "email", label: "Email válido", hasValue: false },
  { type: "minLength", label: "Longitud mínima", hasValue: true },
  { type: "maxLength", label: "Longitud máxima", hasValue: true },
  { type: "min", label: "Valor mínimo", hasValue: true },
  { type: "max", label: "Valor máximo", hasValue: true },
  { type: "pattern", label: "Patrón (regex)", hasValue: true },
];

export const FieldMetadataForm: React.FC<FieldMetadataFormProps> = ({
  field,
  onSave,
  onCancel,
}) => {
  // Estado del formulario
  const [component, setComponent] = useState<FieldComponent>(field?.component || "Input");
  const [name, setName] = useState(field?.name || "");
  const [label, setLabel] = useState(field?.label || "");
  const [placeholder, setPlaceholder] = useState(field?.placeholder || "");
  const [helperText, setHelperText] = useState(field?.helperText || "");
  const [inputType, setInputType] = useState<InputType>(field?.type || "text");
  
  // Para Select
  const [optionsType, setOptionsType] = useState<OptionsType>(field?.optionsType || "inline");
  const [options, setOptions] = useState<SelectXOption[]>(field?.options || []);
  const [optionsRef, setOptionsRef] = useState(field?.optionsRef || "");
  const [allowFreeText, setAllowFreeText] = useState(field?.allowFreeText || false);
  
  // Para File
  const [accept, setAccept] = useState(field?.accept || "");
  const [multiple, setMultiple] = useState(field?.multiple || false);
  const [maxSize, setMaxSize] = useState<string>(field?.maxSize?.toString() || "");
  const [maxFiles, setMaxFiles] = useState<string>(field?.maxFiles?.toString() || "");
  
  // Validaciones
  const [validations, setValidations] = useState<Record<string, { enabled: boolean; value?: string }>>({});

  // Inicializar validaciones desde field existente
  useEffect(() => {
    if (field?.rules?.validations) {
      const initialValidations: Record<string, { enabled: boolean; value?: string }> = {};
      field.rules.validations.forEach((v) => {
        initialValidations[v.type] = {
          enabled: true,
          value: v.value?.toString(),
        };
      });
      // Error: Calling setState synchronously within an effect can trigger cascading render Effects are intended to synchronize state between React and external systems such as manually updating th DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following: Update external systems with the latest state from React. Subscribe for updates from some external system, calling setState in a callback function when external state change.
      setValidations(initialValidations);
    }
  }, [field]);

  // Generar name a partir del label
  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (!field) {
      // Solo auto-generar si es nuevo campo
      const generatedName = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
      setName(generatedName);
    }
  };

  // Manejar cambio de validación
  const handleValidationChange = (type: string, enabled: boolean, value?: string) => {
    setValidations((prev) => ({
      ...prev,
      [type]: { enabled, value },
    }));
  };

  // Agregar opción inline
  const addOption = () => {
    setOptions([...options, { value: "", label: "" }]);
  };

  // Actualizar opción
  const updateOption = (index: number, field: "value" | "label", value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  // Eliminar opción
  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Guardar campo
  const handleSave = () => {
    // Construir validaciones
    const fieldValidations: ValidationRule[] = [];
    Object.entries(validations).forEach(([type, config]) => {
      if (config.enabled) {
        const rule: ValidationRule = { type: type as any };
        if (config.value) {
          rule.value = isNaN(Number(config.value)) ? config.value : Number(config.value);
        }
        fieldValidations.push(rule);
      }
    });

    // Construir campo
    const newField: FieldDefinition = {
      id: field?.id || generateId(),
      component,
      name,
      label,
      placeholder: placeholder || undefined,
      helperText: helperText || undefined,
    };

    // Agregar props específicas según componente
    if (component === "Input") {
      newField.type = inputType;
    }

    if (component === "Select") {
      newField.optionsType = optionsType;
      if (optionsType === "inline") {
        newField.options = options.filter((o) => o.value && o.label);
      } else {
        newField.optionsRef = optionsRef;
      }
      newField.allowFreeText = allowFreeText;
    }

    if (component === "File") {
      if (accept) newField.accept = accept;
      newField.multiple = multiple;
      if (maxSize) newField.maxSize = Number(maxSize);
      if (maxFiles) newField.maxFiles = Number(maxFiles);
    }

    // Agregar validaciones si hay
    if (fieldValidations.length > 0) {
      newField.rules = { validations: fieldValidations };
    }

    onSave(newField);
  };

  const isValid = name.trim() !== "" && label.trim() !== "";

  return (
    <div className="field-form-container">
      <div className="field-form-header">
        <span className="field-form-title">
          {field ? "Editar Campo" : "Agregar Campo"}
        </span>
        <button type="button" className="field-form-close" onClick={onCancel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="field-form-body">
        {/* Tipo de componente */}
        <div className="field-form-row full">
          <div className="field-form-group">
            <label className="field-form-label">Tipo de campo</label>
            <select
              className="field-form-select"
              value={component}
              onChange={(e) => setComponent(e.target.value as FieldComponent)}
            >
              {COMPONENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Label y Name */}
        <div className="field-form-row">
          <div className="field-form-group">
            <label className="field-form-label">Etiqueta *</label>
            <input
              type="text"
              className="field-form-input"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Ej: Correo Electrónico"
            />
          </div>
          <div className="field-form-group">
            <label className="field-form-label">Nombre (ID) *</label>
            <input
              type="text"
              className="field-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: correo_electronico"
            />
          </div>
        </div>

        {/* Placeholder y Helper */}
        <div className="field-form-row">
          <div className="field-form-group">
            <label className="field-form-label">Placeholder</label>
            <input
              type="text"
              className="field-form-input"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Texto de ejemplo"
            />
          </div>
          <div className="field-form-group">
            <label className="field-form-label">Texto de ayuda</label>
            <input
              type="text"
              className="field-form-input"
              value={helperText}
              onChange={(e) => setHelperText(e.target.value)}
              placeholder="Descripción adicional"
            />
          </div>
        </div>

        {/* Opciones específicas para Input */}
        {component === "Input" && (
          <div className="field-form-row">
            <div className="field-form-group">
              <label className="field-form-label">Tipo de input</label>
              <select
                className="field-form-select"
                value={inputType}
                onChange={(e) => setInputType(e.target.value as InputType)}
              >
                {INPUT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Opciones específicas para Select */}
        {component === "Select" && (
          <>
            <div className="field-form-row">
              <div className="field-form-group">
                <label className="field-form-label">Tipo de opciones</label>
                <select
                  className="field-form-select"
                  value={optionsType}
                  onChange={(e) => setOptionsType(e.target.value as OptionsType)}
                >
                  <option value="inline">Inline (definir aquí)</option>
                  <option value="reference">Referencia externa</option>
                </select>
              </div>
              <div className="field-form-group">
                <div className="field-form-checkbox-row" style={{ marginTop: 24 }}>
                  <input
                    type="checkbox"
                    id="allowFreeText"
                    className="field-form-checkbox"
                    checked={allowFreeText}
                    onChange={(e) => setAllowFreeText(e.target.checked)}
                  />
                  <label htmlFor="allowFreeText" className="field-form-checkbox-label">
                    Permitir texto libre
                  </label>
                </div>
              </div>
            </div>

            {optionsType === "inline" ? (
              <div className="options-editor">
                <div className="options-editor-header">
                  <span className="options-editor-title">Opciones</span>
                  <button type="button" className="options-editor-add" onClick={addOption}>
                    + Agregar
                  </button>
                </div>
                <div className="options-editor-list">
                  {options.map((opt, index) => (
                    <div key={index} className="options-editor-item">
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) => updateOption(index, "value", e.target.value)}
                        placeholder="Valor"
                      />
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => updateOption(index, "label", e.target.value)}
                        placeholder="Etiqueta"
                      />
                      <button
                        type="button"
                        className="options-editor-remove"
                        onClick={() => removeOption(index)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {options.length === 0 && (
                    <div style={{ fontSize: 13, color: "#9ca3af", padding: "8px 0" }}>
                      No hay opciones. Haz click en "+ Agregar" para crear una.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="field-form-group">
                <label className="field-form-label">Nombre de referencia</label>
                <input
                  type="text"
                  className="field-form-input"
                  value={optionsRef}
                  onChange={(e) => setOptionsRef(e.target.value)}
                  placeholder="Ej: marcas, departamentos"
                />
                <small style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                  Asegúrese de pasar esta referencia en optionsResolvers
                </small>
              </div>
            )}
          </>
        )}

        {/* Opciones específicas para File */}
        {component === "File" && (
          <>
            <div className="field-form-row">
              <div className="field-form-group">
                <label className="field-form-label">Tipos aceptados</label>
                <input
                  type="text"
                  className="field-form-input"
                  value={accept}
                  onChange={(e) => setAccept(e.target.value)}
                  placeholder="Ej: .pdf,.jpg,image/*"
                />
              </div>
              <div className="field-form-group">
                <label className="field-form-label">Tamaño máximo (bytes)</label>
                <input
                  type="number"
                  className="field-form-input"
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  placeholder="Ej: 5242880 (5MB)"
                />
              </div>
            </div>
            <div className="field-form-row">
              <div className="field-form-group">
                <div className="field-form-checkbox-row">
                  <input
                    type="checkbox"
                    id="multiple"
                    className="field-form-checkbox"
                    checked={multiple}
                    onChange={(e) => setMultiple(e.target.checked)}
                  />
                  <label htmlFor="multiple" className="field-form-checkbox-label">
                    Permitir múltiples archivos
                  </label>
                </div>
              </div>
              {multiple && (
                <div className="field-form-group">
                  <label className="field-form-label">Máximo de archivos</label>
                  <input
                    type="number"
                    className="field-form-input"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(e.target.value)}
                    placeholder="Ej: 5"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Validaciones (no para Checkbox ni File) */}
        {!["Checkbox", "File"].includes(component) && (
          <div className="validations-picker">
            <span className="validations-picker-title">Validaciones</span>
            <div className="validations-picker-grid">
              {VALIDATION_OPTIONS.map((v) => {
                const isEnabled = validations[v.type]?.enabled || false;
                const value = validations[v.type]?.value || "";
                
                // Filtrar validaciones según tipo de componente
                if (component === "Select" && ["minLength", "maxLength", "min", "max", "pattern", "email"].includes(v.type)) {
                  return null;
                }
                if (component === "Textarea" && ["min", "max", "email"].includes(v.type)) {
                  return null;
                }
                if (component === "Date" && ["minLength", "maxLength", "email", "pattern"].includes(v.type)) {
                  return null;
                }
                if (inputType !== "email" && v.type === "email") {
                  return null;
                }
                if (inputType !== "number" && ["min", "max"].includes(v.type)) {
                  return null;
                }
                if (inputType === "number" && ["minLength", "maxLength", "pattern"].includes(v.type)) {
                  return null;
                }

                return (
                  <div
                    key={v.type}
                    className={`validation-item ${isEnabled ? "active" : ""}`}
                  >
                    <div className="validation-item-header">
                      <input
                        type="checkbox"
                        className="validation-item-checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          handleValidationChange(v.type, e.target.checked, value)
                        }
                      />
                      <span className="validation-item-label">{v.label}</span>
                    </div>
                    {v.hasValue && isEnabled && (
                      <input
                        type="text"
                        className="validation-item-input"
                        value={value}
                        onChange={(e) =>
                          handleValidationChange(v.type, true, e.target.value)
                        }
                        placeholder="Valor"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="field-form-actions">
          <button type="button" className="field-form-btn cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="field-form-btn save"
            onClick={handleSave}
            disabled={!isValid}
          >
            {field ? "Guardar cambios" : "Agregar campo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldMetadataForm;