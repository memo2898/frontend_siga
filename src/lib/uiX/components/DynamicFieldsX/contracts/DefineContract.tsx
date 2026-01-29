// ============================================
// uiX - DefineContract Component
// ============================================

import React, { useState } from "react";
import { type FieldDefinition } from "../types";
import { FieldCard, FieldMetadataForm } from "../components";

interface DefineContractProps {
  value: FieldDefinition[];
  onChange: (value: FieldDefinition[]) => void;
  disabled?: boolean;
}

export const DefineContract: React.FC<DefineContractProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Asegurar que value siempre sea un array
  const fields = value ?? [];

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Agregar nuevo campo
  const handleAddField = (field: FieldDefinition) => {
    onChange([...fields, field]);
    setShowForm(false);
  };

  // Editar campo existente
  const handleEditField = (field: FieldDefinition) => {
    if (editingIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingIndex] = field;
      onChange(updatedFields);
      setEditingIndex(null);
    }
  };

  // Eliminar campo
  const handleDeleteField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  // Abrir edición
  const openEdit = (index: number) => {
    setEditingIndex(index);
    setShowForm(false);
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

  return (
    <div className="dynamic-fields-list">
      {/* Lista de campos definidos */}
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          {editingIndex === index ? (
            <FieldMetadataForm
              field={field}
              onSave={handleEditField}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <FieldCard
              field={field}
              index={index}
              onEdit={() => openEdit(index)}
              onDelete={() => handleDeleteField(index)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedIndex === index}
            />
          )}
        </React.Fragment>
      ))}

      {/* Formulario para agregar nuevo campo */}
      {showForm && (
        <FieldMetadataForm
          onSave={handleAddField}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Botón agregar campo */}
      {!showForm && editingIndex === null && !disabled && (
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

export default DefineContract;