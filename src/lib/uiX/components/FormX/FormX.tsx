/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// uiX - FormX Component
// ============================================

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { FormXContext, type FormXContextValue } from "./FormX.context";
import {
  type ValidateOn,
  type FormSubmitResult,
  type FieldRegistration,
  type FormXRef,
} from "../../types";

export interface FormXProps {
  children: ReactNode;
  onSubmit?: (result: FormSubmitResult) => void;
  validateOn?: ValidateOn;
  className?: string;
  style?: React.CSSProperties;
}

export const FormX = forwardRef<FormXRef, FormXProps>(
  ({ children, onSubmit, validateOn = "blur", className, style }, ref) => {
    // Store registered fields
    const fieldsRef = useRef<Map<string, FieldRegistration>>(new Map());
    
    // Form container ref for detecting data-submitx elements
    const formContainerRef = useRef<HTMLDivElement>(null);

    // Register a field
    const registerField = useCallback((field: FieldRegistration) => {
      fieldsRef.current.set(field.name, field);
    }, []);

    // Unregister a field
    const unregisterField = useCallback((name: string) => {
      fieldsRef.current.delete(name);
    }, []);

    // Notify change (for validateOn="change")
    const notifyChange = useCallback(
      (name: string) => {
        if (validateOn === "change") {
          const field = fieldsRef.current.get(name);
          if (field) {
            const result = field.validate();
            if (!result.isValid) {
              field.setError(result.errors);
            } else {
              field.clearError();
            }
          }
        }
      },
      [validateOn]
    );

    // Notify blur (for validateOn="blur")
    const notifyBlur = useCallback(
      (name: string) => {
        if (validateOn === "blur") {
          const field = fieldsRef.current.get(name);
          if (field) {
            const result = field.validate();
            if (!result.isValid) {
              field.setError(result.errors);
            } else {
              field.clearError();
            }
          }
        }
      },
      [validateOn]
    );

    // Get all values
    const getValues = useCallback((): Record<string, any> => {
      const values: Record<string, any> = {};
      fieldsRef.current.forEach((field, name) => {
        values[name] = field.getValue();
      });
      return values;
    }, []);

    // Validate all fields and get result
    const validate = useCallback((): FormSubmitResult => {
      const body: Record<string, any> = {};
      const validations_results: FormSubmitResult["validations_results"] = [];
      let general_validation = true;

      fieldsRef.current.forEach((field, name) => {
        const value = field.getValue();
        body[name] = value;

        const validationResult = field.validate();
        validations_results.push(validationResult);

        if (!validationResult.isValid) {
          general_validation = false;
          field.setError(validationResult.errors);
        } else {
          field.clearError();
        }
      });

      return {
        general_validation,
        body,
        validations_results,
      };
    }, []);

    // Submit handler
    const handleSubmit = useCallback(() => {
      const result = validate();
      onSubmit?.(result);
    }, [validate, onSubmit]);

    // Reset form
    const reset = useCallback(() => {
      fieldsRef.current.forEach((field) => {
        field.clearError();
      });
    }, []);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        submit: handleSubmit,
        reset,
        validate,
        getValues,
      }),
      [handleSubmit, reset, validate, getValues]
    );

    // Setup click handlers for data-submitx elements
    useEffect(() => {
      const container = formContainerRef.current;
      if (!container) return;

      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const submitElement = target.closest("[data-submitx]");
        
        if (submitElement && container.contains(submitElement)) {
          event.preventDefault();
          handleSubmit();
        }
      };

      container.addEventListener("click", handleClick);

      return () => {
        container.removeEventListener("click", handleClick);
      };
    }, [handleSubmit]);

    // Context value
    const contextValue: FormXContextValue = {
      registerField,
      unregisterField,
      validateOn,
      notifyChange,
      notifyBlur,
    };

    return (
      <FormXContext.Provider value={contextValue}>
        <div ref={formContainerRef} className={className} style={style}>
          {children}
        </div>
      </FormXContext.Provider>
    );
  }
);

FormX.displayName = "FormX";

export default FormX;