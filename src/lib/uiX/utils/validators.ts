/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - Validation Utilities
// ============================================

import { type ValidationRule, type FieldValidationResult, type CustomValidatorFunction } from "../types";

// Default messages in Spanish
const DEFAULT_MESSAGES: Record<string, string> = {
  required: "Este campo es obligatorio",
  email: "Ingrese un email válido",
  minLength: "Mínimo {value} caracteres",
  maxLength: "Máximo {value} caracteres",
  min: "El valor mínimo es {value}",
  max: "El valor máximo es {value}",
  pattern: "Formato inválido",
  url: "Ingrese una URL válida",
  phone: "Ingrese un teléfono válido",
  custom: "Validación fallida", // 🆕 ADDED
};

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL regex pattern
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Phone regex (flexible, allows various formats)
const PHONE_REGEX = /^[\d\s\-().+]{7,20}$/;

/**
 * Get default message for a validation type
 */
function getDefaultMessage(type: string, value?: string | number): string {
  const template = DEFAULT_MESSAGES[type] || "Validación fallida";
  return template.replace("{value}", String(value ?? ""));
}

/**
 * Validate a single rule against a value
 */
function validateRule(
  value: any,
  rule: ValidationRule,
): { isValid: boolean; error?: string } {
  const stringValue = String(value ?? "");
  const message =
    rule.message || getDefaultMessage(rule.type, rule.value as string | number);

  switch (rule.type) {
    case "required":
      if (value === undefined || value === null || stringValue.trim() === "") {
        return { isValid: false, error: message };
      }
      break;

    case "email":
      if (stringValue && !EMAIL_REGEX.test(stringValue)) {
        return { isValid: false, error: message };
      }
      break;

    case "minLength":
      if (stringValue && stringValue.length < (rule.value as number)) {
        return { isValid: false, error: message };
      }
      break;

    case "maxLength":
      if (stringValue && stringValue.length > (rule.value as number)) {
        return { isValid: false, error: message };
      }
      break;

    case "min":
      const numValueMin = parseFloat(stringValue);
      if (!isNaN(numValueMin) && numValueMin < (rule.value as number)) {
        return { isValid: false, error: message };
      }
      break;

    case "max":
      const numValueMax = parseFloat(stringValue);
      if (!isNaN(numValueMax) && numValueMax > (rule.value as number)) {
        return { isValid: false, error: message };
      }
      break;

    case "pattern":
      const regex =
        rule.value instanceof RegExp
          ? rule.value
          : new RegExp(rule.value as string);
      if (stringValue && !regex.test(stringValue)) {
        return { isValid: false, error: message };
      }
      break;

    case "url":
      if (stringValue && !URL_REGEX.test(stringValue)) {
        return { isValid: false, error: message };
      }
      break;

    case "phone":
      if (stringValue && !PHONE_REGEX.test(stringValue)) {
        return { isValid: false, error: message };
      }
      break;

    // 🆕 NEW CASE: Custom Validation
    case "custom":
      if (typeof rule.value === "function") {
        const validatorFn = rule.value as CustomValidatorFunction;
        const result = validatorFn(stringValue);

        if (result === false) {
          // If returns false, use the default message
          return { isValid: false, error: message };
        } else if (typeof result === "string") {
          // If returns string, it's the error message
          return { isValid: false, error: result };
        }
        // If returns true, validation passed
      }
      break;
  }

  return { isValid: true };
}

/**
 * Validate a value against multiple rules
 */
export function validateField(
  name: string,
  value: any,
  rules: ValidationRule[],
): FieldValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    const result = validateRule(value, rule);
    if (!result.isValid && result.error) {
      errors.push(result.error);
    }
  }

  return {
    name,
    value,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a value is empty (for conditional validation)
 */
export function isEmpty(value: any): boolean {
  return value === undefined || value === null || String(value).trim() === "";
}