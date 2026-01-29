/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ============================================
// uiX - ExtendContract Component
// ============================================

import React, { useState } from "react";
import { type FieldDefinition, type SimpleField } from "../types";
import { type SelectXOption } from "../../../types";
import { FollowContract } from "./FollowContract";
import { FieldCard, SimpleFieldForm } from "../components";

interface ExtendContractProps {
  schema: FieldDefinition[];
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  extraFields: SimpleField[];
  onExtraFieldsChange: (fields: SimpleField[]) => void;
  optionsResolvers?: Record<string, SelectXOption[]>;
  disabled?: boolean;
}

export const ExtendContract: React.FC<ExtendContractProps> = ({
  schema,
  value,
  onChange,
  extraFields,
  onExtraFieldsChange,
  optionsResolvers = {},
  disabled = false,
}) => {
  // Asegurar que siempre sean arrays/objetos válidos
  const schemaFields = schema ?? [];
  const extras = extraFields ?? [];
  const currentValue = value ?? {};

  const [showForm, setShowForm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Agregar campo extra
  const handleAddExtraField = (field: SimpleField) => {
    onExtraFieldsChange([...extras, field]);
    setShowForm(false);
  };

  // Eliminar campo extra
  const handleDeleteExtraField = (index: number) => {
    onExtraFieldsChange(extras.filter((_, i) => i !== index));
  };

  // Actualizar valor de campo extra
  const handleExtraFieldValueChange = (index: number, newValue: any) => {
    const newFields = [...extras];
    newFields[index] = { ...newFields[index], value: newValue };
    onExtraFieldsChange(newFields);
  };

  // Drag & Drop para extras
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newFields = [...extras];
    const [draggedField] = newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);
    onExtraFieldsChange(newFields);
    setDraggedIndex(null);
  };

  // Renderizar input para campo extra
  const renderExtraFieldInput = (field: SimpleField, index: number) => {
    switch (field.type) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={field.value || false}
            onChange={(e) => handleExtraFieldValueChange(index, e.target.checked)}
            disabled={disabled}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={field.value || ""}
            onChange={(e) => handleExtraFieldValueChange(index, e.target.value)}
            placeholder="Valor"
            disabled={disabled}
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => handleExtraFieldValueChange(index, e.target.value)}
            placeholder="Valor"
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="dynamic-fields-container">
      {/* Campos del schema */}
      {schemaFields.length > 0 && (
        <div className="dynamic-fields-section">
          <div className="dynamic-fields-section-title">Campos requeridos</div>
          <FollowContract
            schema={schemaFields}
            value={currentValue}
            onChange={onChange}
            optionsResolvers={optionsResolvers}
            disabled={disabled}
          />
        </div>
      )}

      {/* Campos extras */}
      <div className="dynamic-fields-section">
        <div className="dynamic-fields-section-title">Campos adicionales</div>

        <div className="dynamic-fields-list">
          {extras.map((field, index) => (
            <div
              key={field.id}
              className={`simple-field-card ${draggedIndex === index ? "dragging" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {/* Drag handle */}
              <div className="field-card-drag">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5" />
                  <circle cx="15" cy="6" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </div>

              <div className="field-card-content">
                <span className="simple-field-label">{field.label}:</span>
                <div className="simple-field-value">
                  {renderExtraFieldInput(field, index)}
                </div>
              </div>

              {!disabled && (
                <div className="field-card-actions">
                  <button
                    type="button"
                    className="field-card-action delete"
                    onClick={() => handleDeleteExtraField(index)}
                    title="Eliminar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Formulario para agregar campo extra */}
          {showForm && (
            <SimpleFieldForm
              onSave={handleAddExtraField}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Botón agregar */}
          {!showForm && !disabled && (
            <button
              type="button"
              className="dynamic-fields-add-btn"
              onClick={() => setShowForm(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar campo extra
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendContract;