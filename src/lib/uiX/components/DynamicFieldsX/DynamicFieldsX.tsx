/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - DynamicFieldsX Component
// ============================================

import React, { useEffect, useCallback } from "react";
import { useFormXContext } from "../FormX/FormX.context";
import {
  type DynamicFieldsXProps,
  type FieldDefinition,
  type SimpleField,
} from "./types";
import { type FieldRegistration, type FieldValidationResult } from "../../types";
import {
  DefineContract,
  FollowContract,
  ExtendContract,
  NoneContract,
} from "./contracts";
import "./DynamicFieldsX.css";


export type { DynamicFieldsXProps } from "./types";

export const DynamicFieldsX: React.FC<DynamicFieldsXProps> = ({
  name,
  contract,
  value,
  onChange,
  schema = [],
  extraFields = [],
  onExtraFieldsChange,
  optionsResolvers = {},
  disabled = false,
  className,
  label,
}) => {
  const formContext = useFormXContext();

  // Obtener el valor actual para el form
  const getCurrentValue = useCallback(() => {
    switch (contract) {
      case "define":
        return value as FieldDefinition[];
      
      case "follow":
        return value as Record<string, any>;
      
      case "extend":
        // Combinar datos del schema + extras
        const schemaData = value as Record<string, any>;
        const extrasData: Record<string, any> = {};
        extraFields.forEach((f) => {
          extrasData[f.name] = f.value;
        });
        return {
          ...schemaData,
          _extras: extrasData,
        };
      
      case "none":
        // Convertir array de SimpleField a objeto
        const freeData: Record<string, any> = {};
        (value as SimpleField[]).forEach((f) => {
          freeData[f.name] = f.value;
        });
        return freeData;
      
      default:
        return value;
    }
  }, [contract, value, extraFields]);

  // Validar campos (para follow y extend)
  const validateFields = useCallback((): FieldValidationResult => {
    // Por ahora retornamos válido
    // En una implementación completa, validaríamos cada campo según su schema
    const currentValue = getCurrentValue();
    
    // Para "follow" y "extend", verificar campos requeridos del schema
    if (contract === "follow" || contract === "extend") {
      const data = value as Record<string, any>;
      const errors: string[] = [];
      
      schema.forEach((field) => {
        const isRequired = field.rules?.validations?.some((v) => v.type === "required");
        if (isRequired) {
          const fieldValue = data[field.name];
          if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
            errors.push(`${field.label} es requerido`);
          }
        }
      });
      
      return {
        name,
        value: currentValue,
        isValid: errors.length === 0,
        errors,
      };
    }
    
    return {
      name,
      value: currentValue,
      isValid: true,
      errors: [],
    };
  }, [contract, value, schema, name, getCurrentValue]);

  // Registrar con FormX
  useEffect(() => {
    if (!formContext) return;

    const registration: FieldRegistration = {
      name,
      getValue: getCurrentValue,
      validate: validateFields,
      setError: () => {}, // Los errores se manejan internamente en cada input
      clearError: () => {},
    };

    formContext.registerField(registration);

    return () => {
      formContext.unregisterField(name);
    };
  }, [formContext, name, getCurrentValue, validateFields]);

  // Renderizar según contrato
  const renderContract = () => {
    switch (contract) {
      case "define":
        return (
          <DefineContract
            value={value as FieldDefinition[]}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case "follow":
        return (
          <FollowContract
            schema={schema}
            value={value as Record<string, any>}
            onChange={onChange}
            optionsResolvers={optionsResolvers}
            disabled={disabled}
          />
        );

      case "extend":
        return (
          <ExtendContract
            schema={schema}
            value={value as Record<string, any>}
            onChange={onChange}
            extraFields={extraFields}
            onExtraFieldsChange={onExtraFieldsChange || (() => {})}
            optionsResolvers={optionsResolvers}
            disabled={disabled}
          />
        );

      case "none":
        return (
          <NoneContract
            value={value as SimpleField[]}
            onChange={onChange}
            disabled={disabled}
          />
        );

      default:
        return (
          <div className="dynamic-fields-error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Contrato no válido: {contract}
          </div>
        );
    }
  };

  return (
    <div className={`dynamic-fields-container ${className || ""}`}>
      {label && <div className="dynamic-fields-label">{label}</div>}
      {renderContract()}
    </div>
  );
};

export default DynamicFieldsX;