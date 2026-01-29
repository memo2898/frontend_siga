/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - Core Types
// ============================================

// Validation function type for custom validations
export type CustomValidatorFunction = (value: string) => boolean | string;

// Validation types - EXTENDED
export type ValidationType = 
  | "required"
  | "email"
  | "minLength"
  | "maxLength"
  | "min"
  | "max"
  | "pattern"
  | "url"
  | "phone"
  | "custom"; // 🆕 ADDED

export interface ValidationRule {
  type: ValidationType;
  value?: string | number | RegExp | CustomValidatorFunction; // 🆕 EXTENDED
  message?: string;
}

// Restriction types
export type RestrictionType =
  | "onlyNumbers"
  | "onlyLetters"
  | "onlyAlphanumeric"
  | "noSpaces"
  | "maxChars";

export interface RestrictionRule {
  type: RestrictionType;
  value?: number;
}

// Formatting types
export type FormattingType =
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "trim"
  | "phone"
  | "currency"
  | "cedula"
  | "creditCard";

export interface FormattingRule {
  type: FormattingType;
  format?: string;
}

// Combined rules for inputs
export interface InputRules {
  validations?: ValidationRule[];
  restrictions?: RestrictionRule[];
  formatting?: FormattingRule[];
}

// Validation event trigger
export type ValidateOn = "change" | "blur" | "submit";

// Field validation result
export interface FieldValidationResult {
  name: string;
  value: any;
  isValid: boolean;
  errors: string[];
}

// Form submit result
export interface FormSubmitResult {
  general_validation: boolean;
  body: Record<string, any>;
  validations_results: FieldValidationResult[];
}

// Field registration for FormX context
export interface FieldRegistration {
  name: string;
  getValue: () => any;
  validate: () => FieldValidationResult;
  setError: (errors: string[]) => void;
  clearError: () => void;
}

// FormX ref methods
export interface FormXRef {
  submit: () => void;
  reset: () => void;
  validate: () => FormSubmitResult;
  getValues: () => Record<string, any>;
}

// SelectX option type
export interface SelectXOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}