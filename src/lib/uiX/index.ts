// ============================================
// uiX - Main Index
// ============================================

// Types
export type {
  ValidationType,
  ValidationRule,
  RestrictionType,
  RestrictionRule,
  FormattingType,
  FormattingRule,
  InputRules,
  ValidateOn,
  FieldValidationResult,
  FormSubmitResult,
  FormXRef,
  SelectXOption,
} from "./types";

// DynamicFieldsX Types
export type {
  FieldDefinition,
  SimpleField,
  FieldComponent,
  InputType,
  OptionsType,
  ContractType,
  DynamicFieldsXProps,
} from "./components/DynamicFieldsX";

// Components
export { FormX, type FormXProps, useFormX } from "./components/FormX";
export { InputX, type InputXProps } from "./components/InputX";
export { SelectX, type SelectXProps } from "./components/SelectX";
export { InputFileX } from "./components/InputFileX";
export { DynamicFieldsX } from "./components/DynamicFieldsX";
export { StepperX, useStepperContext } from "./components/StepperX";

// StepperX Types
export type {
  StepDefinition,
  StepStatus,
  StepperXProps,
  StepperXRef,
  StepperContextValue,
} from "./components/StepperX";

// Utils (for advanced usage)
export {
  validateField,
  isEmpty,
  shouldBlockKey,
  applyRestrictionsToValue,
  applyFormatting,
  getRawValue,
  normalizeText,
  normalizedIncludes,
  normalizedStartsWith,
} from "./utils";