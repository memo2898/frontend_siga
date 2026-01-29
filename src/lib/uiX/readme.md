# uiX - Librería de Componentes React con Validación Declarativa

> Mini librería de componentes de formulario para React con validaciones, restricciones y formateo automático.

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Instalación](#instalación)
- [Arquitectura](#arquitectura)
- [Componentes Completados](#componentes-completados)
- [Componentes Pendientes](#componentes-pendientes)
- [API Reference](#api-reference)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Decisiones de Diseño](#decisiones-de-diseño)

---

## 🎯 Visión General

**uiX** es una librería de componentes React diseñada para simplificar la creación de formularios con:

- ✅ **Validaciones declarativas** - Define reglas en un objeto simple
- ✅ **Restricciones de input** - Controla qué puede escribir el usuario
- ✅ **Formateo automático** - Transforma el valor mientras escribe
- ✅ **Validación configurable** - Por form o por campo (`blur`, `change`, `submit`)
- ✅ **Submit flexible** - Usa `data-submitx` en cualquier elemento o `ref.submit()` desde afuera

---

## 📦 Instalación

```bash
# Copiar la carpeta uiX a tu proyecto
cp -r uiX /tu-proyecto/src/

# Asegúrate de tener React 18+
npm install react react-dom
```

---

## 🏗️ Arquitectura

```
uiX/
├── index.ts                    # Export principal
├── types.ts                    # Tipos TypeScript
├── README.md                   # Esta documentación
├── Example.tsx                 # Ejemplo de uso
│
├── components/
│   ├── FormX/                  # ✅ COMPLETADO
│   │   ├── FormX.tsx           # Componente principal
│   │   ├── FormX.context.ts    # Context para comunicación con inputs
│   │   └── index.ts
│   │
│   ├── InputX/                 # ✅ COMPLETADO
│   │   ├── InputX.tsx          # Input con validación
│   │   ├── InputX.css          # Estilos
│   │   └── index.ts
│   │
│   ├── SelectX/                # 🔲 PENDIENTE
│   │   └── ...
│   │
│   ├── InputFileX/             # 🔲 PENDIENTE
│   │   └── ...
│   │
│   └── DynamicFieldX/          # 🔲 PENDIENTE
│       └── ...
│
└── utils/
    ├── index.ts
    ├── validators.ts           # Funciones de validación
    ├── restrictions.ts         # Funciones de restricción
    └── formatting.ts           # Funciones de formateo
```

---

## ✅ Componentes Completados

### 1. FormX

Contenedor de formulario que maneja el estado y validación de todos los campos hijos.

```tsx
import { FormX, FormXRef, FormSubmitResult } from 'uiX';

const formRef = useRef<FormXRef>(null);

<FormX 
  ref={formRef}
  onSubmit={(result: FormSubmitResult) => console.log(result)}
  validateOn="blur"  // 'blur' | 'change' | 'submit'
>
  {/* InputX, SelectX, etc. */}
  <button data-submitx>Enviar</button>
</FormX>

// Métodos disponibles via ref:
formRef.current.submit();      // Disparar submit
formRef.current.reset();       // Limpiar errores
formRef.current.validate();    // Validar sin submit
formRef.current.getValues();   // Obtener valores
```

#### Resultado del Submit

```typescript
interface FormSubmitResult {
  general_validation: boolean;      // true si TODOS los campos son válidos
  body: Record<string, any>;        // { campo1: valor1, campo2: valor2, ... }
  validations_results: [
    {
      name: string;
      value: any;
      isValid: boolean;
      errors: string[];
    }
  ];
}
```

### 2. InputX

Input con validación, restricciones y formateo declarativo.

```tsx
import { InputX } from 'uiX';

<InputX
  name="email"
  label="Correo Electrónico"
  type="email"
  placeholder="ejemplo@correo.com"
  validateOn="blur"           // Sobreescribe el del FormX
  helperText="Texto de ayuda"
  showSuccessState={true}     // Muestra borde verde si válido
  rules={{
    validations: [...],
    restrictions: [...],
    formatting: [...]
  }}
  onChange={(value, rawValue) => {}}
  onBlur={(value, rawValue) => {}}
/>
```

---

## 🔲 Componentes Pendientes

### 3. SelectX (Por hacer)

**Descripción:** Input select con autocompletado. Combina un input de texto con una lista desplegable filtrable.

**Características esperadas:**
- Búsqueda/filtrado mientras escribe
- Navegación con teclado (↑ ↓ Enter Escape)
- Opciones estáticas o dinámicas (async)
- Soporte para objetos complejos (value/label)
- Creación de nuevas opciones (opcional)
- Multi-select (opcional)
- Integración con FormX y sistema de `rules`

**API propuesta:**
```tsx
<SelectX
  name="pais"
  label="País"
  options={[
    { value: "DO", label: "República Dominicana" },
    { value: "US", label: "Estados Unidos" },
  ]}
  // O función async
  loadOptions={async (search) => await fetchPaises(search)}
  placeholder="Buscar país..."
  allowCreate={false}        // Permitir crear nuevas opciones
  multiple={false}           // Multi-select
  rules={{
    validations: [{ type: "required" }]
  }}
/>
```

---

### 4. InputFileX (Por hacer)

**Descripción:** Input para archivos con soporte de drag & drop.

**Características esperadas:**
- Drag & drop zone
- Click para seleccionar
- Preview de imágenes
- Múltiples archivos
- Validación de tipo y tamaño
- Progress de upload (si aplica)
- Integración con FormX

**API propuesta:**
```tsx
<InputFileX
  name="documentos"
  label="Subir Documentos"
  accept=".pdf,.doc,.docx"    // Tipos permitidos
  multiple={true}
  maxSize={5 * 1024 * 1024}   // 5MB
  maxFiles={3}
  showPreview={true}          // Preview para imágenes
  dropzoneText="Arrastra archivos aquí o haz clic"
  rules={{
    validations: [
      { type: "required", message: "Debe subir al menos un archivo" },
      { type: "minFiles", value: 1 },
      { type: "maxFiles", value: 3 },
    ]
  }}
  onFilesChange={(files: File[]) => {}}
/>
```

---

### 5. DynamicFieldX (Por hacer)

**Descripción:** Componente para manejar campos dinámicos con soporte JSONB. Permite definir, seguir, extender o crear campos libres según el modo de contrato.

**Modos de contrato:**
1. **`strict`** - Solo campos predefinidos, no se pueden agregar nuevos
2. **`extend`** - Campos predefinidos + permite agregar nuevos
3. **`free`** - Sin esquema, campos totalmente libres

**Características esperadas:**
- Definición de esquema de campos (tipo, label, validaciones)
- Agregar/eliminar campos dinámicamente
- Reordenar campos (drag & drop)
- Soporte para tipos: text, number, date, select, boolean
- Salida en formato JSONB para PostgreSQL
- Integración con FormX

**API propuesta:**
```tsx
// Esquema de campos predefinidos
const schema = [
  { 
    key: "marca", 
    type: "text", 
    label: "Marca",
    rules: { validations: [{ type: "required" }] }
  },
  { 
    key: "modelo", 
    type: "text", 
    label: "Modelo" 
  },
  { 
    key: "año", 
    type: "number", 
    label: "Año",
    rules: { validations: [{ type: "min", value: 1900 }] }
  },
  { 
    key: "estado", 
    type: "select", 
    label: "Estado",
    options: [
      { value: "nuevo", label: "Nuevo" },
      { value: "usado", label: "Usado" }
    ]
  }
];

<DynamicFieldX
  name="especificaciones"
  label="Especificaciones del Activo"
  mode="extend"              // 'strict' | 'extend' | 'free'
  schema={schema}            // Campos predefinidos
  allowAddField={true}       // Permitir agregar campos (si mode lo permite)
  allowRemoveField={true}    // Permitir eliminar campos
  allowReorder={true}        // Permitir reordenar
  defaultValue={{            // Valor inicial JSONB
    marca: "Dell",
    modelo: "Latitude 5520"
  }}
  availableTypes={['text', 'number', 'date', 'select', 'boolean']}
/>

// Resultado en body:
{
  especificaciones: {
    marca: "Dell",
    modelo: "Latitude 5520",
    año: 2023,
    estado: "nuevo",
    custom_field_1: "valor personalizado"  // Si mode='extend' o 'free'
  }
}
```

---

## 📖 API Reference

### Validaciones Disponibles

| Tipo | Valor | Descripción |
|------|-------|-------------|
| `required` | - | Campo obligatorio |
| `email` | - | Formato de email válido |
| `minLength` | `number` | Longitud mínima de caracteres |
| `maxLength` | `number` | Longitud máxima de caracteres |
| `min` | `number` | Valor numérico mínimo |
| `max` | `number` | Valor numérico máximo |
| `pattern` | `RegExp \| string` | Patrón regex personalizado |
| `url` | - | Formato de URL válido |
| `phone` | - | Formato de teléfono válido |

```tsx
rules={{
  validations: [
    { type: "required", message: "Campo obligatorio" },
    { type: "email", message: "Email inválido" },
    { type: "minLength", value: 8, message: "Mínimo 8 caracteres" },
    { type: "pattern", value: /^[A-Z]/, message: "Debe iniciar con mayúscula" }
  ]
}}
```

### Restricciones Disponibles

| Tipo | Valor | Descripción |
|------|-------|-------------|
| `onlyNumbers` | - | Solo permite dígitos |
| `onlyLetters` | - | Solo permite letras (incluye acentos) |
| `onlyAlphanumeric` | - | Solo letras y números |
| `noSpaces` | - | No permite espacios |
| `maxChars` | `number` | Máximo de caracteres |

```tsx
rules={{
  restrictions: [
    { type: "onlyNumbers" },
    { type: "maxChars", value: 10 }
  ]
}}
```

### Formateo Disponible

| Tipo | Formato | Descripción |
|------|---------|-------------|
| `uppercase` | - | Convierte a MAYÚSCULAS |
| `lowercase` | - | Convierte a minúsculas |
| `capitalize` | - | Primera Letra De Cada Palabra |
| `trim` | - | Elimina espacios al inicio/final |
| `phone` | `string` | Formato teléfono: `(###) ###-####` |
| `currency` | - | Formato moneda: `$1,500.00` |
| `cedula` | - | Formato cédula RD: `001-1234567-8` |
| `creditCard` | - | Formato tarjeta: `1234 5678 9012 3456` |

```tsx
rules={{
  formatting: [
    { type: "phone", format: "(###) ###-####" },
    { type: "uppercase" }
  ]
}}
```

---

## 💡 Ejemplos de Uso

### Formulario Básico

```tsx
import { useRef } from 'react';
import { FormX, InputX, FormXRef, FormSubmitResult } from './uiX';

function MiFormulario() {
  const formRef = useRef<FormXRef>(null);

  const handleSubmit = (result: FormSubmitResult) => {
    if (result.general_validation) {
      console.log("Datos válidos:", result.body);
      // Enviar al API
    } else {
      console.log("Errores:", result.validations_results);
    }
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <InputX
        name="email"
        label="Correo"
        type="email"
        rules={{
          validations: [
            { type: "required" },
            { type: "email" }
          ],
          restrictions: [{ type: "noSpaces" }],
          formatting: [{ type: "lowercase" }]
        }}
      />

      <InputX
        name="telefono"
        label="Teléfono"
        rules={{
          validations: [{ type: "required" }],
          restrictions: [{ type: "onlyNumbers" }, { type: "maxChars", value: 10 }],
          formatting: [{ type: "phone" }]
        }}
      />

      <InputX
        name="cedula"
        label="Cédula"
        rules={{
          validations: [{ type: "required" }],
          restrictions: [{ type: "onlyNumbers" }, { type: "maxChars", value: 11 }],
          formatting: [{ type: "cedula" }]
        }}
      />

      <button data-submitx>Enviar</button>
    </FormX>
  );
}
```

### Submit desde Afuera

```tsx
function FormularioConBotonesExternos() {
  const formRef = useRef<FormXRef>(null);

  return (
    <div>
      <FormX ref={formRef} onSubmit={handleSubmit}>
        <InputX name="nombre" label="Nombre" />
      </FormX>

      {/* Botones fuera del FormX */}
      <div className="toolbar">
        <button onClick={() => formRef.current?.submit()}>
          Guardar
        </button>
        <button onClick={() => formRef.current?.reset()}>
          Limpiar
        </button>
        <button onClick={() => console.log(formRef.current?.getValues())}>
          Ver Valores
        </button>
      </div>
    </div>
  );
}
```

### Validación por Campo

```tsx
<FormX validateOn="blur">
  {/* Este usa blur (hereda del form) */}
  <InputX name="email" ... />
  
  {/* Este valida mientras escribe */}
  <InputX name="password" validateOn="change" ... />
  
  {/* Este solo valida al submit */}
  <InputX name="comentario" validateOn="submit" ... />
</FormX>
```

---

## 🎨 Decisiones de Diseño

### 1. `data-submitx` en lugar de `type="submit"`

**Razón:** El atributo `type` nativo solo funciona en `<button>` e `<input>`. Con `data-submitx` cualquier elemento puede disparar el submit:

```tsx
<button data-submitx>Enviar</button>
<div data-submitx>Click para enviar</div>
<span data-submitx>→</span>
```

### 2. Validación configurable (form + campo)

**Razón:** Flexibilidad total. El form define el default, pero cada campo puede sobreescribir:

```
Prioridad: InputX.validateOn → FormX.validateOn → "blur" (default)
```

### 3. `rawValue` separado de `value`

**Razón:** El valor mostrado puede tener formato (ej: `(809) 555-1234`), pero el valor enviado al API debe ser limpio (`8095551234`).

```tsx
onChange={(displayValue, rawValue) => {
  // displayValue: "(809) 555-1234"
  // rawValue: "8095551234"
}}
```

### 4. Resultado del submit con `general_validation`

**Razón:** Un solo callback `onSubmit` que siempre se ejecuta. Tú decides qué hacer:

```tsx
onSubmit={(result) => {
  if (result.general_validation) {
    api.save(result.body);
  } else {
    toast.error("Corrige los errores");
  }
}}
```

---

## 🚀 Roadmap

- [x] FormX - Contenedor con contexto
- [x] InputX - Input con validación/restricción/formateo
- [ ] SelectX - Combo input + select con autocompletado
- [ ] InputFileX - Drag & drop de archivos
- [ ] DynamicFieldX - Campos dinámicos JSONB
- [ ] TextareaX - Textarea con las mismas features
- [ ] CheckboxX / RadioX - Con integración al form
- [ ] Tests unitarios
- [ ] Storybook para documentación visual

---

## 📝 Notas de Desarrollo

### Bug Corregido: Validación onBlur no funcionaba

**Problema:** `setTouched(true)` es asíncrono, y `triggerValidation` verificaba `touched` antes de que se actualizara.

**Solución:** Validar directamente en `handleBlur` sin depender del estado:

```tsx
// ANTES (mal)
const handleBlur = () => {
  setTouched(true);
  triggerValidation("blur"); // touched aún es false
};

// DESPUÉS (bien)
const handleBlur = () => {
  setTouched(true);
  if (effectiveValidateOn === "blur") {
    const result = validateField(...);
    setErrors(result.errors);
  }
};
```

---

## 👤 Autor

Desarrollado para proyectos de la Alcaldía del Distrito Nacional (ADN).

---

*Última actualización: Enero 2026*