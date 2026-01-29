// ============================================
// uiX - FormX Context
// ============================================

import { createContext, useContext } from "react";
import { type ValidateOn, type FieldRegistration } from "../../types";

export interface FormXContextValue {
  // Registration
  registerField: (field: FieldRegistration) => void;
  unregisterField: (name: string) => void;
  
  // Validation settings
  validateOn: ValidateOn;
  
  // Trigger validation from input
  notifyChange: (name: string) => void;
  notifyBlur: (name: string) => void;
}

export const FormXContext = createContext<FormXContextValue | null>(null);

export function useFormXContext(): FormXContextValue | null {
  return useContext(FormXContext);
}

export function useFormX(): FormXContextValue {
  const context = useContext(FormXContext);
  
  if (!context) {
    throw new Error("InputX must be used within a FormX component");
  }
  
  return context;
}