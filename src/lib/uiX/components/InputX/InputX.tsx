// ============================================
// uiX - InputX Component (FIXED)
// ============================================

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
} from "react";
import { useFormXContext } from "../FormX/FormX.context";
import {
  type InputRules,
  type ValidateOn,
  type FieldValidationResult,
  type FieldRegistration,
} from "../../types";
import {
  validateField,
  shouldBlockKey,
  applyRestrictionsToValue,
  applyFormatting,
  getRawValue,
} from "../../utils";
import "./InputX.css";

export interface InputXProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onBlur"> {
  name: string;
  label?: string;
  rules?: InputRules;
  validateOn?: ValidateOn;
  helperText?: string;
  showSuccessState?: boolean;
  onChange?: (value: string, rawValue: string) => void;
  onBlur?: (value: string, rawValue: string) => void;
}

export const InputX: React.FC<InputXProps> = ({
  name,
  label,
  rules = {},
  validateOn: inputValidateOn,
  helperText,
  showSuccessState = false,
  onChange,
  onBlur,
  className,
  required,
  disabled,
  ...inputProps
}) => {
  const formContext = useFormXContext();
  
  // Extraer defaultValue de inputProps antes del spread
  const { defaultValue, ...restInputProps } = inputProps;
  
  const [value, setValue] = useState<string>(() => 
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with defaultValue prop when it changes
  if (defaultValue !== prevDefaultValue) {
    const defaultVal = defaultValue !== undefined ? String(defaultValue) : "";
    setValue(defaultVal);
    setPrevDefaultValue(defaultValue);
  }

  // Determine which validateOn to use (input > form > default)
  const effectiveValidateOn =
    inputValidateOn ?? formContext?.validateOn ?? "blur";

  // Check if field is required (from rules or prop)
  const isRequired =
    required ||
    rules.validations?.some((v) => v.type === "required") ||
    false;

  // Get raw value (without formatting)
  const getRawValueFromCurrent = useCallback(
    (val: string): string => {
      if (rules.formatting && rules.formatting.length > 0) {
        return getRawValue(val, rules.formatting);
      }
      return val;
    },
    [rules.formatting]
  );

  // Validate current value
  const validateCurrentValue = useCallback((): FieldValidationResult => {
    const rawValue = getRawValueFromCurrent(value);
    
    if (!rules.validations || rules.validations.length === 0) {
      return { name, value: rawValue, isValid: true, errors: [] };
    }

    return validateField(name, rawValue, rules.validations);
  }, [name, value, rules.validations, getRawValueFromCurrent]);

  // Handle keydown for restrictions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!rules.restrictions || rules.restrictions.length === 0) return;

    // Allow Ctrl/Cmd combinations
    if (e.ctrlKey || e.metaKey) return;

    if (shouldBlockKey(e.key, value, rules.restrictions)) {
      e.preventDefault();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Apply restrictions to pasted/typed content
    if (rules.restrictions && rules.restrictions.length > 0) {
      newValue = applyRestrictionsToValue(newValue, rules.restrictions);
    }

    // Apply formatting
    if (rules.formatting && rules.formatting.length > 0) {
      newValue = applyFormatting(newValue, rules.formatting);
    }

    setValue(newValue);

    const rawValue = getRawValueFromCurrent(newValue);
    onChange?.(newValue, rawValue);

    // Trigger validation if validateOn is "change"
    if (effectiveValidateOn === "change") {
      setTouched(true);
      const result = validateField(
        name,
        rawValue,
        rules.validations || []
      );
      setErrors(result.isValid ? [] : result.errors);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setTouched(true);

    const rawValue = getRawValueFromCurrent(value);
    onBlur?.(value, rawValue);

    // Trigger validation if validateOn is "blur"
    if (effectiveValidateOn === "blur") {
      const result = validateField(
        name,
        rawValue,
        rules.validations || []
      );
      setErrors(result.isValid ? [] : result.errors);
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!rules.restrictions || rules.restrictions.length === 0) return;

    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = applyRestrictionsToValue(pastedText, rules.restrictions);

    // Get cursor position
    const input = e.currentTarget;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    // Insert cleaned text at cursor position
    const newValue = value.slice(0, start) + cleanedText + value.slice(end);

    // Apply formatting
    const formattedValue =
      rules.formatting && rules.formatting.length > 0
        ? applyFormatting(newValue, rules.formatting)
        : newValue;

    setValue(formattedValue);

    const rawValue = getRawValueFromCurrent(formattedValue);
    onChange?.(formattedValue, rawValue);
  };

  // Register with FormX context
  useEffect(() => {
    if (!formContext) return;

    const registration: FieldRegistration = {
      name,
      getValue: () => getRawValueFromCurrent(value),
      validate: validateCurrentValue,
      setError: (errs) => setErrors(errs),
      clearError: () => setErrors([]),
    };

    formContext.registerField(registration);

    return () => {
      formContext.unregisterField(name);
    };
  }, [formContext, name, value, validateCurrentValue, getRawValueFromCurrent]);

  // Update registration when value changes
  useEffect(() => {
    if (!formContext) return;

    const registration: FieldRegistration = {
      name,
      getValue: () => getRawValueFromCurrent(value),
      validate: validateCurrentValue,
      setError: (errs) => setErrors(errs),
      clearError: () => setErrors([]),
    };

    formContext.registerField(registration);
  }, [value, formContext, name, validateCurrentValue, getRawValueFromCurrent]);

  // Determine input state classes
  const hasError = errors.length > 0;
  const showSuccess = showSuccessState && touched && !hasError && value !== "";

  const inputClassName = [
    "inputx-field",
    hasError && "error",
    showSuccess && "success",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="inputx-container">
      {label && (
        <label
          htmlFor={name}
          className={`inputx-label ${isRequired ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <div className="inputx-wrapper">
        <input
          ref={inputRef}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          className={inputClassName}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...restInputProps}
        />
      </div>

      {hasError && (
        <div className="inputx-error" id={`${name}-error`} role="alert">
          <svg
            className="inputx-error-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <ul className="inputx-error-list">
            {errors.map((error, index) => (
              <li key={index} className="inputx-error-item">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasError && helperText && (
        <span className="inputx-helper">{helperText}</span>
      )}
    </div>
  );
};

export default InputX;