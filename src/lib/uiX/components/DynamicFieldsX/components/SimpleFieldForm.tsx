// ============================================
// uiX - SimpleFieldForm Component
// ============================================

import React, { useState } from "react";
import { type SimpleFieldFormProps, type SimpleField, generateId } from "../types";

const SIMPLE_TYPE_OPTIONS = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "checkbox", label: "Sí/No" },
];

export const SimpleFieldForm: React.FC<SimpleFieldFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [label, setLabel] = useState("");
  const [inputType, setInputType] = useState<"text" | "number" | "checkbox">("text");  // Variable de estado

  const handleLabelChange = (value: string) => {
    setLabel(value);
  };

  const handleSave = () => {
    const name = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    const newField: SimpleField = {
      id: generateId(),
      name,
      label,
      input_type: inputType,  // Propiedad del objeto: input_type
      value: inputType === "checkbox" ? false : "",  // Referencia a la variable: inputType
    };

    onSave(newField);
  };

  const isValid = label.trim() !== "";

  return (
    <div className="field-form-container">
      <div className="field-form-header">
        <span className="field-form-title">Agregar Campo Extra</span>
        <button type="button" className="field-form-close" onClick={onCancel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="field-form-body">
        <div className="field-form-row">
          <div className="field-form-group">
            <label className="field-form-label">Etiqueta *</label>
            <input
              type="text"
              className="field-form-input"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Ej: Incluye cargador"
            />
          </div>
          <div className="field-form-group">
            <label className="field-form-label">Tipo</label>
            <select
              className="field-form-select"
              value={inputType}  // Variable de estado
              onChange={(e) => setInputType(e.target.value as "text" | "number" | "checkbox")}  // Setter
            >
              {SIMPLE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleFieldForm;