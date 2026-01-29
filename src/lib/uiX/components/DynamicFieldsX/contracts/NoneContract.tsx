// ============================================
// uiX - NoneContract Component
// ============================================

import React, { useState } from "react";
import { type SimpleField } from "../types";
import { SimpleFieldForm } from "../components";

interface NoneContractProps {
  value: SimpleField[];
  onChange: (value: SimpleField[]) => void;
  disabled?: boolean;
}

export const NoneContract: React.FC<NoneContractProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Asegurar que value siempre sea un array
  const fields = value ?? [];

  const [showForm, setShowForm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Agregar campo
  const handleAddField = (field: SimpleField) => {
    onChange([...fields, field]);
    setShowForm(false);
  };

  // Eliminar campo
  const handleDeleteField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  // Actualizar valor
  const handleValueChange = (index: number, newValue: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], value: newValue };
    onChange(updatedFields);
  };

  // Drag & Drop
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

    const reorderedFields = [...fields];
    const [draggedField] = reorderedFields.splice(draggedIndex, 1);
    reorderedFields.splice(dropIndex, 0, draggedField);
    onChange(reorderedFields);
    setDraggedIndex(null);
  };

  // Renderizar input según tipo
  const renderFieldInput = (field: SimpleField, index: number) => {
    switch (field.type) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={field.value || false}
            onChange={(e) => handleValueChange(index, e.target.checked)}
            disabled={disabled}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={field.value || ""}
            onChange={(e) => handleValueChange(index, e.target.value)}
            placeholder="Valor"
            disabled={disabled}
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => handleValueChange(index, e.target.value)}
            placeholder="Valor"
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="dynamic-fields-list">
      {fields.map((field, index) => (
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
              {renderFieldInput(field, index)}
            </div>
          </div>

          {!disabled && (
            <div className="field-card-actions">
              <button
                type="button"
                className="field-card-action delete"
                onClick={() => handleDeleteField(index)}
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

      {/* Formulario para agregar campo */}
      {showForm && (
        <SimpleFieldForm
          onSave={handleAddField}
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
          Agregar campo
        </button>
      )}
    </div>
  );
};

export default NoneContract;