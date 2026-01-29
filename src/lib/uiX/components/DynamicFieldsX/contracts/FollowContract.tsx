/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - FollowContract Component
// ============================================

import React from "react";
import { type FieldDefinition } from "../types";
import { type SelectXOption } from "../../../types";
import { InputX } from "../../InputX";
import { SelectX } from "../../SelectX";

interface FollowContractProps {
  schema: FieldDefinition[];
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  optionsResolvers?: Record<string, SelectXOption[]>;
  disabled?: boolean;
}

export const FollowContract: React.FC<FollowContractProps> = ({
  schema,
  value,
  onChange,
  optionsResolvers = {},
  disabled = false,
}) => {
  // Asegurar que siempre sean valores válidos
  const schemaFields = schema ?? [];
  const currentValue = value ?? {};

  // Actualizar valor de un campo
  const handleFieldChange = (name: string, fieldValue: any) => {
    onChange({
      ...currentValue,
      [name]: fieldValue,
    });
  };

  // Obtener opciones para un Select
  const getSelectOptions = (field: FieldDefinition): SelectXOption[] => {
    if (field.optionsType === "inline" && field.options) {
      return field.options;
    }
    if (field.optionsType === "reference" && field.optionsRef) {
      return optionsResolvers[field.optionsRef] || [];
    }
    return [];
  };

  // Renderizar campo según su tipo
  const renderField = (field: FieldDefinition) => {
    const fieldValue = currentValue[field.name];

    switch (field.component) {
      case "Input":
        return (
          <InputX
            key={field.id}
            name={field.name}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder}
            helperText={field.helperText}
            disabled={disabled}
            rules={field.rules}
            onChange={(val) => handleFieldChange(field.name, val)}
          />
        );

      case "Select":
        return (
          <SelectX
            key={field.id}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            helperText={field.helperText}
            options={getSelectOptions(field)}
            allowFreeText={field.allowFreeText}
            disabled={disabled}
            rules={field.rules}
            onChange={(val) => handleFieldChange(field.name, val)}
          />
        );

      case "Checkbox":
        return (
          <div key={field.id} className="field-form-group">
            <div className="field-form-checkbox-row">
              <input
                type="checkbox"
                id={field.name}
                className="field-form-checkbox"
                checked={fieldValue || false}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={disabled}
              />
              <label htmlFor={field.name} className="field-form-checkbox-label">
                {field.label}
              </label>
            </div>
            {field.helperText && (
              <small style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {field.helperText}
              </small>
            )}
          </div>
        );

      case "Date":
        return (
          <div key={field.id} className="field-form-group">
            <label className="field-form-label">
              {field.label}
              {field.rules?.validations?.some((v) => v.type === "required") && " *"}
            </label>
            <input
              type="date"
              className="field-form-input"
              value={fieldValue || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={disabled}
            />
            {field.helperText && (
              <small style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {field.helperText}
              </small>
            )}
          </div>
        );

      case "Textarea":
        return (
          <div key={field.id} className="field-form-group">
            <label className="field-form-label">
              {field.label}
              {field.rules?.validations?.some((v) => v.type === "required") && " *"}
            </label>
            <textarea
              className="field-form-input"
              value={fieldValue || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              rows={4}
              style={{ resize: "vertical", minHeight: 80 }}
            />
            {field.helperText && (
              <small style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {field.helperText}
              </small>
            )}
          </div>
        );

      case "File":
        // Por ahora renderizamos un input file básico
        // Cuando tengamos InputFileX lo usamos
        return (
          <div key={field.id} className="field-form-group">
            <label className="field-form-label">
              {field.label}
              {field.rules?.validations?.some((v) => v.type === "required") && " *"}
            </label>
            <input
              type="file"
              className="field-form-input"
              accept={field.accept}
              multiple={field.multiple}
              disabled={disabled}
              onChange={(e) => {
                const files = e.target.files;
                handleFieldChange(field.name, files ? Array.from(files) : []);
              }}
            />
            {field.helperText && (
              <small style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {field.helperText}
              </small>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-fields-list">
      {schemaFields.map((field) => (
        <div key={field.id} style={{ marginBottom: 16 }}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default FollowContract;