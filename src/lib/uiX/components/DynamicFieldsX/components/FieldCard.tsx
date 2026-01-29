// ============================================
// uiX - FieldCard Component
// ============================================

import React, { useState } from "react";
import { type FieldCardProps, type FieldDefinition, type SimpleField } from "../types";

export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  isSimple = false,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(e, index);
  };

  // Para campos completos (FieldDefinition)
  const renderFullField = (f: FieldDefinition) => {
    const validations = f.rules?.validations || [];
    
    return (
      <>
        <div className="field-card-content">
          <div className="field-card-header">
            <span className="field-card-name">{f.name}</span>
            <span className="field-card-type">{f.component}</span>
          </div>
          <div className="field-card-label">{f.label}</div>
          {validations.length > 0 && (
            <div className="field-card-validations">
              {validations.map((v, i) => (
                <span key={i} className="field-card-validation-tag">
                  {v.type}
                  {v.value !== undefined && `: ${v.value}`}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="field-card-actions">
          {onEdit && (
            <button
              type="button"
              className="field-card-action"
              onClick={onEdit}
              title="Editar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="field-card-action delete"
            onClick={onDelete}
            title="Eliminar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  // Para campos simples (SimpleField)
  const renderSimpleField = (f: SimpleField) => {
    return (
      <>
        <div className="field-card-content">
          <div className="field-card-header">
            <span className="field-card-name">{f.label || f.name}</span>
            <span className="field-card-type">{f.type}</span>
          </div>
        </div>
        <div className="field-card-actions">
          <button
            type="button"
            className="field-card-action delete"
            onClick={onDelete}
            title="Eliminar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  const cardClassName = [
    "field-card",
    isDragging && "dragging",
    dragOver && "drag-over",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClassName}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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

      {isSimple
        ? renderSimpleField(field as SimpleField)
        : renderFullField(field as FieldDefinition)}
    </div>
  );
};

export default FieldCard;