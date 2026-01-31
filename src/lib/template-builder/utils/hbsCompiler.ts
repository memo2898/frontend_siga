import Handlebars from 'handlebars';

/**
 * Compila un template Handlebars con los datos proporcionados
 */
export function compileTemplate(templateString: string, data: Record<string, any>): string {
  try {
    const template = Handlebars.compile(templateString);
    return template(data);
  } catch (error) {
    console.error('Error al compilar template Handlebars:', error);
    throw new Error(`Error al compilar template: ${error}`);
  }
}

/**
 * Valida si un string es un template Handlebars válido
 */
export function validateTemplate(templateString: string): { valid: boolean; error?: string } {
  try {
    Handlebars.compile(templateString);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Template inválido'
    };
  }
}

/**
 * Extrae las variables usadas en un template Handlebars
 */
export function extractVariables(templateString: string): string[] {
  const variablePattern = /\{\{([^#/][^}]*)\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(templateString)) !== null) {
    // Limpiar el nombre de la variable
    const varName = match[1].trim().split(/[\s.]|$/)[0];
    if (varName && varName !== 'if' && varName !== 'unless' && varName !== 'each') {
      variables.add(varName);
    }
  }

  return Array.from(variables);
}

/**
 * Registra helpers personalizados de Handlebars
 */
export function registerCustomHelpers(): void {
  // Helper para formatear fechas
  Handlebars.registerHelper('formatDate', (date: string, format: string) => {
    if (!date) return '';
    const d = new Date(date);
    if (format === 'short') {
      return d.toLocaleDateString('es-ES');
    }
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Helper para formatear números como moneda
  Handlebars.registerHelper('currency', (value: number) => {
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  });

  // Helper para formatear números
  Handlebars.registerHelper('number', (value: number, decimals = 2) => {
    if (typeof value !== 'number') return value;
    return value.toFixed(decimals);
  });

  // Helper para uppercase
  Handlebars.registerHelper('upper', (str: string) => {
    return str ? str.toUpperCase() : '';
  });

  // Helper para lowercase
  Handlebars.registerHelper('lower', (str: string) => {
    return str ? str.toLowerCase() : '';
  });

  // Helper para capitalizar primera letra
  Handlebars.registerHelper('capitalize', (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
}

// Registrar helpers automáticamente al importar el módulo
registerCustomHelpers();
