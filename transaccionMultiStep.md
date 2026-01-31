# 📋 TransaccionMultiStep - Componente de Gestión de Transacciones

## 📖 Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Contextos de Uso](#contextos-de-uso)
4. [Flujos de Transacciones](#flujos-de-transacciones)
5. [Estructura de Pasos](#estructura-de-pasos)
6. [Tipos de Transacciones](#tipos-de-transacciones)
7. [Componentes y Archivos](#componentes-y-archivos)
8. [Validaciones y Reglas de Negocio](#validaciones-y-reglas-de-negocio)
9. [Integración con Backend](#integración-con-backend)
10. [Casos de Uso](#casos-de-uso)

---

## 🎯 Visión General

El componente `TransaccionMultiStep` es el **componente central** del sistema SIGA para gestionar todas las transacciones de entrada y salida de activos. Es un wizard multi-paso adaptativo que se contextualiza según:

- El rol del usuario (Admin vs Operador de Módulo)
- El tipo de transacción (Entrada vs Salida)
- El subtipo específico (Ingreso CB, Asignación, Préstamo, etc.)
- El módulo desde donde se ejecuta

### Principios de Diseño

✅ **Un solo componente para todo** - Evita duplicación de código  
✅ **Adaptativo por contexto** - Se ajusta según quien lo use y desde dónde  
✅ **Steps condicionales** - Solo muestra pasos relevantes para cada flujo  
✅ **Validaciones inteligentes** - Valida en cada paso antes de avanzar  
✅ **Evidencia documental** - Captura firmas digitales y fotos  
✅ **Generación automática de documentos** - PDFs, actas, emails

---

## 🏗️ Arquitectura del Sistema

### Flujo de Autenticación y Navegación

```
Login
  │
  ├─► Selector de Rol
  │    │
  │    ├─► ADMIN
  │    │    │
  │    │    └─► Panel Admin
  │    │         ├─► Dashboard Global
  │    │         ├─► Inventario Completo
  │    │         ├─► Gestión de Módulos
  │    │         ├─► Usuarios y Roles
  │    │         └─► Transacciones Globales
  │    │              └─► TransaccionMultiStep (contexto: GLOBAL)
  │    │
  │    └─► OPERADOR (Gabriel, Andy, etc.)
  │         │
  │         └─► Workspace de Módulos
  │              │
  │              ├─► Menu Dinámico
  │              │    ├─► 📱 Gestión de Flotas
  │              │    ├─► 📽️ Gestión de Proyectores
  │              │    └─► 💻 Gestión de Equipos
  │              │
  │              └─► Click en Módulo
  │                   │
  │                   └─► TransaccionMultiStep (contexto: MODULO)
```

### Niveles de Operación

#### **NIVEL 1: Administración Global**
- **Usuarios:** Administradores y Super Usuarios
- **Alcance:** TODO el inventario
- **Permisos:** Sin restricciones
- **Categorías:** Todas disponibles
- **Interfaz:** `/admin`

#### **NIVEL 2: Gestores de Módulos**
- **Usuarios:** Operadores asignados (Gabriel, Andy)
- **Alcance:** Solo activos de sus categorías asignadas
- **Permisos:** Definidos por configuración del módulo
- **Categorías:** Solo las del módulo
- **Interfaz:** `/workspace/modulo/:moduloId`

---

## 🎭 Contextos de Uso

### Contexto 1: Admin Global

```typescript
<TransaccionMultiStep 
  contexto={{
    tipo: 'GLOBAL',
    usuario: adminUser,
    categorias: todas_las_categorias,
    restricciones: null,
    permisos: ['*'] // todos
  }}
/>
```

**Características:**
- Ve TODAS las categorías
- Puede operar con TODOS los activos
- Sin filtros de módulo
- Acceso completo a reportes

### Contexto 2: Operador de Módulo

```typescript
<TransaccionMultiStep 
  contexto={{
    tipo: 'MODULO',
    usuario: gabrielUser,
    moduloId: 5,
    moduloNombre: 'Gestión de Flotas',
    categorias: [12], // Solo "Dispositivos Móviles"
    restricciones: {
      solo_categorias: [12],
      solo_almacenes: [1, 3],
      operaciones_permitidas: ['entrada', 'asignacion']
    },
    permisos: modulo.configuracion.permisos,
    templates: modulo.templates
  }}
/>
```

**Características:**
- Solo ve categorías de su módulo
- Solo puede operar con activos de esas categorías
- Operaciones limitadas según permisos del módulo
- Templates de documentos personalizados

### Contexto 3: Devolución (Referencia a Transacción)

```typescript
<TransaccionMultiStep 
  contexto={{
    tipo: 'DEVOLUCION',
    transaccionOrigenId: 123,
    prefill: {
      activo: activo_asignado,
      persona: quien_lo_tiene,
      categoria: categoria_del_activo,
      fecha_salida: '2024-01-15'
    }
  }}
/>
```

**Características:**
- Pre-llena datos de la transacción original
- Solo permite confirmar estado de devolución
- Activo y persona ya definidos

---

## 🔄 Flujos de Transacciones

### Tipos Principales

```
TRANSACCIONES
├── ENTRADA
│   ├── Ingreso desde Control de Bienes
│   ├── Adquisición Directa (sin CB)
│   ├── Transferencia Interna
│   ├── Devolución de Asignación
│   ├── Devolución de Préstamo
│   └── Ajuste de Inventario
│
├── SALIDA
│   ├── Asignación
│   ├── Préstamo
│   ├── Descargo
│   ├── Transferencia Externa
│   └── Devolución a Proveedor
│
└── DEVOLUCION (Tipo especial)
    ├── Referencia a transacción origen
    └── Actualiza estado de activo
```

---

## 📝 Estructura de Pasos

### 🔹 FLUJO DE ENTRADA

#### **PASO 1: Tipo de Transacción**

**Objetivo:** Seleccionar tipo y subtipo de entrada

**Elementos:**
- Radio buttons para tipo (Entrada/Salida)
- Radio buttons para subtipo según tipo seleccionado

**Subtipos de Entrada:**
- ✅ Ingreso desde Control de Bienes (requiere acta CB)
- ✅ Adquisición Directa (sin Control de Bienes)
- ✅ Transferencia Interna
- ✅ Devolución de Asignación
- ✅ Devolución de Préstamo
- ✅ Ajuste de Inventario

**Validaciones:**
- Tipo de transacción obligatorio
- Subtipo obligatorio

**Siguiente paso:** Paso 2

---

#### **PASO 2: Selección/Registro de Activos**

**Objetivo:** Registrar nuevo activo o seleccionar existente para devolución

##### **Variante A: Ingreso desde Control de Bienes**

**Campos obligatorios:**
- Acta de Control de Bienes
- Fecha de acta
- Código de Control de Bienes
- Categoría (filtrada según contexto)
- Marca
- Modelo

**Campos opcionales:**
- Número de serie
- Placa patrimonial
- Valor unitario
- Proveedor
- Número de factura
- Campos dinámicos según `categorias.campos_activo`

**Características especiales:**
- Para activos UNITARIOS: cantidad = 1 (fijo)
- Para activos CANTIDAD: campo de cantidad editable
- Botón "[+ Agregar otro activo]" para entrada múltiple

##### **Variante B: Adquisición Directa (SIN Control de Bienes)**

**Campos obligatorios:**
- Categoría (filtrada según contexto)
- Marca
- Modelo
- Cantidad y unidad de medida

**Campos opcionales:**
- Proveedor
- Número de factura
- Fecha de compra
- Valor unitario

**Características especiales:**
- NO requiere código de Control de Bienes
- Código SIGA se genera automáticamente
- Ideal para consumibles y artículos de bajo valor
- Sin validación de acta CB

##### **Variante C: Devolución de Asignación/Préstamo**

**Funcionalidad:**
- Buscador de activos actualmente asignados/prestados
- Muestra información de la transacción original
- Pre-selecciona persona que lo tiene

**Información mostrada:**
- Código del activo
- Descripción
- Persona asignada
- Fecha de salida
- Código de transacción original
- Días en posesión (para préstamos)

**Validaciones:**
- Solo muestra activos en estado ASIGNADO o PRESTADO
- Filtrado por categorías del módulo (si aplica)

**Siguiente paso:** Paso 3

---

#### **PASO 3: Evidencia Fotográfica (OPCIONAL)**

**Objetivo:** Documentar el estado del activo al momento de entrada

**Tipos de fotos sugeridas:**
- 📷 Foto General
- 📷 Número de Serie / Placa Patrimonial
- 📷 Daños o Detalles Especiales

**Funcionalidades:**
- Subir desde archivo
- Tomar con cámara (dispositivos móviles)
- Agregar descripción a cada foto
- Múltiples fotos por activo

**Características:**
-  Este paso es completamente OPCIONAL
- Botón "Omitir" permite saltar al siguiente paso
- Las fotos se guardan en `transacciones_imagenes` con `momento = 'DESPUES'`

**Validaciones:**
- Ninguna (paso opcional)

**Siguiente paso:** Paso 4

---

#### **PASO 4: Datos del Solicitante/Entrega**

**Objetivo:** Identificar quién entrega o devuelve el activo

##### **Si es Devolución:**
- Persona pre-llenada (quien tenía el activo)
- Solo permite confirmar o agregar observaciones

##### **Si es Ingreso Nuevo:**

**Búsqueda de persona:**
- Buscador por nombre, cédula, departamento
- Lista de personas recientes
- Opción "Registrar nueva persona"

**Campos de persona:**
- Nombre completo
- Tipo de documento
- Número de documento
- Departamento
- Cargo
- Email
- Teléfono

**Campo adicional:**
- Observaciones de la transacción

**Validaciones:**
- Persona obligatoria
- Email válido (si se proporciona)
- Teléfono válido (si se proporciona)

**Siguiente paso:** Paso 5

---

#### **PASO 5: Firma Digital**

**Objetivo:** Capturar firma del responsable

**Elementos:**
- Canvas de firma digital
- Texto de compromiso/aceptación
- Botones: Limpiar, Confirmar
- Fecha y hora automáticas

**Texto mostrado:**
```
Yo, [Nombre de la Persona], confirmo que:
• Recibí el activo en buen estado
• La información proporcionada es correcta
• Me comprometo al cuidado del equipo
```

**Validaciones:**
- Firma obligatoria (canvas no puede estar vacío)
- Debe haber trazos de firma antes de continuar

**Siguiente paso:** Paso 6

---

#### **PASO 6: Confirmación e Impresión**

**Objetivo:** Mostrar resumen y generar documentos

**Información mostrada:**
- ✅ Código de transacción generado
- 📋 Resumen completo de la transacción
- 📦 Lista de activos ingresados
- 👤 Datos de la persona
- 📸 Cantidad de fotos adjuntas (si aplica)
- ✍️ Confirmación de firma digital

**Acciones disponibles:**
- 🖨️ Imprimir Acta de Entrada
- 📄 Descargar PDF
- ✉️ Enviar por Email
- 📱 Enviar SMS de confirmación
- ✓ Finalizar
- + Nueva Entrada

**Generación automática:**
- PDF del acta usando template del módulo
- Email de confirmación a la persona
- Notificación al administrador del módulo

**Siguiente paso:** Cierra el wizard o reinicia para nueva transacción

---

### 🔹 FLUJO DE SALIDA

#### **PASO 1: Tipo de Transacción**

**Objetivo:** Seleccionar tipo y subtipo de salida

**Subtipos de Salida:**
- ✅ Asignación (entrega permanente/semi-permanente)
- ✅ Préstamo (con fecha de devolución)
- ✅ Descargo (baja definitiva)
- ✅ Transferencia Externa
- ✅ Devolución a Proveedor

**Validaciones:**
- Tipo de transacción obligatorio
- Subtipo obligatorio
- Validar permisos del módulo (si aplica)

**Siguiente paso:** Paso 2

---

#### **PASO 2: Selección de Activos**

**Objetivo:** Seleccionar activos disponibles para salida

**Filtros disponibles:**
- Por categoría (filtrado según módulo)
- Por almacén
- Por estado (DISPONIBLE)
- Búsqueda por código o descripción

**Información mostrada por activo:**
- Código inventario
- Descripción (marca, modelo)
- Número de serie
- Estado actual
- Ubicación/Almacén
- Valor (si aplica)

##### **Para activos UNITARIOS:**
- Checkbox de selección
- Cantidad fija = 1

##### **Para activos CANTIDAD:**
- Checkbox de selección
- Campo numérico para cantidad a salir
- Muestra stock disponible
- Calcula stock restante
- Alerta si queda por debajo del mínimo

**Validaciones:**
- Al menos 1 activo seleccionado
- Para CANTIDAD: cantidad solicitada ≤ cantidad disponible
- Activo debe estar en estado DISPONIBLE
- Activo debe pertenecer a categorías permitidas

**Siguiente paso:** Paso 3

---

#### **PASO 3: Evidencia Fotográfica ANTES (OPCIONAL)**

**Objetivo:** Documentar el estado del activo ANTES de entregarlo

**Tipos de fotos sugeridas:**
- 📷 Vista General
- 📷 Pantalla/Display
- 📷 Accesorios Incluidos
- 📷 Número de Serie visible

**Funcionalidades adicionales:**
- ✓ Checklist de accesorios
  - Cargador
  - Cable USB
  - Audífonos
  - Funda/Estuche
  - Manual
  - Otros (personalizable)

**Características:**
-  Este paso es completamente OPCIONAL
- Útil para comparar estado al momento de devolución
- Las fotos se guardan en `transacciones_imagenes` con `momento = 'ANTES'`

**Validaciones:**
- Ninguna (paso opcional)

**Siguiente paso:** Paso 4

---

#### **PASO 4: Datos del Receptor**

**Objetivo:** Identificar a quién se entrega el activo

**Búsqueda de persona:**
- Buscador inteligente
- Muestra personas que han solicitado recientemente
- Opción "Registrar nueva persona"

**Campos de persona:**
- Nombre completo
- Tipo de documento
- Número de documento
- Departamento
- Cargo
- Email
- Teléfono

##### **Si es PRÉSTAMO:**

**Campos adicionales:**
- 📅 Fecha de devolución esperada (obligatorio)
- Cálculo automático de días de préstamo

##### **Si es DESCARGO:**

**Campos adicionales obligatorios:**
-  Motivo del descargo (enum)
  - Daño Irreparable
  - Obsolescencia
  - Donación
  - Venta
  - Robo
  - Pérdida
  - Otro
- Detalles del descargo
- Número de documento de aprobación (resolución, acta)

##### **Si es TRANSFERENCIA EXTERNA:**

**Campos adicionales:**
- Institución destino
- Persona responsable en destino
- Documento de autorización

**Campo común:**
- Observaciones adicionales

**Validaciones:**
- Persona obligatoria
- Email válido
- Para PRÉSTAMO: fecha de devolución > fecha actual
- Para DESCARGO: motivo y documento de aprobación obligatorios

**Siguiente paso:** Paso 5

---

#### **PASO 5: Firma Digital del Receptor**

**Objetivo:** Capturar firma de quien recibe el activo

**Elementos:**
- Canvas de firma digital
- Texto de compromiso personalizado según tipo
- Resumen de lo que recibe
- Botones: Limpiar, Confirmar
- Fecha y hora automáticas

**Texto mostrado (Asignación/Préstamo):**
```
Yo, [Nombre], confirmo que:
• Recibo en buen estado
• [Lista de activos y accesorios]
• Me comprometo a su cuidado
• [Si es préstamo] Devolveré el [fecha]
```

**Texto mostrado (Descargo):**
```
Yo, [Nombre], certifico que:
• El activo se encuentra en estado: [motivo]
• Los detalles descritos son correctos
• Autorizo el descargo según [documento]
```

**Validaciones:**
- Firma obligatoria
- Canvas no puede estar vacío

**Siguiente paso:** Paso 6

---

#### **PASO 6: Confirmación e Impresión**

**Objetivo:** Mostrar resumen y generar documentos

**Información mostrada:**
- ✅ Código de transacción generado
- 📋 Tipo de salida
- 📦 Activos entregados (con accesorios)
- 👤 Receptor
- 📅 Fecha (y fecha devolución si es préstamo)
- 📸 Evidencias fotográficas (si aplica)
- ✍️ Confirmación de firma digital

**Acciones disponibles:**
- 🖨️ Imprimir Acta de Entrega
- 📄 Descargar PDF
- ✉️ Enviar a receptor por Email
- 📱 Enviar SMS recordatorio (especialmente para préstamos)
- ✓ Finalizar
- + Nueva Salida

**Para PRÉSTAMOS:**
- 📅 Agregar recordatorio automático 2 días antes de vencimiento

**Generación automática:**
- PDF del acta usando template del módulo
- Email de confirmación al receptor
- SMS recordatorio de fecha de devolución
- Notificación al gestor del módulo

**Siguiente paso:** Cierra el wizard o reinicia para nueva transacción

---

## 📊 Tipos de Transacciones

### Enum: `tipo_transaccion`

```sql
CREATE TYPE tipo_transaccion AS ENUM ('ENTRADA', 'SALIDA', 'DEVOLUCION');
```

### Enum: `tipo_entrada`

```sql
CREATE TYPE tipo_entrada AS ENUM (
    'INGRESO_CONTROL_BIENES',    -- Con acta CB obligatoria
    'ADQUISICION_DIRECTA',        -- Sin Control de Bienes
    'TRANSFERENCIA_INTERNA',      -- Entre departamentos/sedes
    'DEVOLUCION_ASIGNACION',      -- Retorno de asignación
    'DEVOLUCION_PRESTAMO',        -- Retorno de préstamo
    'AJUSTE_INVENTARIO'           -- Correcciones
);
```

### Enum: `tipo_salida`

```sql
CREATE TYPE tipo_salida AS ENUM (
    'ASIGNACION',                 -- Entrega permanente
    'PRESTAMO',                   -- Temporal con devolución
    'DESCARGO',                   -- Baja definitiva
    'TRANSFERENCIA_EXTERNA',      -- A otra institución
    'DEVOLUCION_PROVEEDOR'        -- Por defecto/garantía
);
```

### Enum: `motivo_descargo`

```sql
CREATE TYPE motivo_descargo AS ENUM (
    'DAÑO_IRREPARABLE',
    'OBSOLESCENCIA',
    'DONACION',
    'VENTA',
    'ROBO',
    'PERDIDA',
    'OTRO'
);
```

---

## 🗂️ Componentes y Archivos

### Estructura de Directorios

```
/components
  /transacciones
    TransaccionMultiStep.tsx          # Componente principal (orchestrator)
    TransaccionContext.tsx            # Context API para compartir estado
    
    /steps
      /entrada
        Step1_TipoTransaccion.tsx     # Tipo y subtipo
        Step2_RegistroActivos.tsx     # Registro o selección
        Step3_EvidenciaFoto.tsx       # Fotos opcionales
        Step4_DatosPersona.tsx        # Solicitante/entrega
        Step5_FirmaDigital.tsx        # Firma del responsable
        Step6_Confirmacion.tsx        # Resumen y documentos
      
      /salida
        Step1_TipoTransaccion.tsx     # Tipo y subtipo
        Step2_SeleccionActivos.tsx    # Activos disponibles
        Step3_EvidenciaFoto.tsx       # Fotos estado actual
        Step4_DatosReceptor.tsx       # A quién se entrega
        Step5_FirmaDigital.tsx        # Firma del receptor
        Step6_Confirmacion.tsx        # Resumen y documentos
    
    /shared
      
      SelectorPersona.tsx             # Búsqueda de personas
     
      ResumenTransaccion.tsx          # Componente de resumen
      ChecklistAccesorios.tsx         # Lista de accesorios
    
    /hooks
      useTransaccionState.ts          # Estado del wizard
      useStepValidation.ts            # Validaciones por paso
      useActivosDisponibles.ts        # Query de activos
      usePersonaBusqueda.ts           # Búsqueda de personas
      useGenerarDocumento.ts          # Generación de PDFs
    
    /utils
      validaciones.ts                 # Funciones de validación
      generadores.ts                  # Generadores de códigos
      formatters.ts                   # Formateadores de datos

/pages
  /admin
    /transacciones
      nueva.tsx                       # Transacción global admin
  
  /workspace
    /modulo
      [moduloId]
        /transacciones
          nueva.tsx                   # Transacción desde módulo
```
## USAR los componentes del uiX que estan en lib
uiX
├── Example.tsx
├── Example2.tsx
├── components
│   ├── DynamicFieldsX
│   │   ├── DynamicFieldsX.css
│   │   ├── DynamicFieldsX.tsx
│   │   ├── components
│   │   │   ├── FieldCard.tsx
│   │   │   ├── FieldMetadataForm.tsx
│   │   │   ├── SimpleFieldForm.tsx
│   │   │   └── index.ts
│   │   ├── contracts
│   │   │   ├── DefineContract.tsx
│   │   │   ├── ExtendContract.tsx
│   │   │   ├── FollowContract.tsx
│   │   │   ├── NoneContract.tsx
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── readme.md
│   │   └── types.ts
│   ├── FormX
│   │   ├── FormX.context.ts
│   │   ├── FormX.tsx
│   │   └── index.ts
│   ├── InputFileX
│   │   ├── InputFileX.css
│   │   ├── InputFileX.tsx
│   │   └── index.ts
│   ├── InputX
│   │   ├── InputX.css
│   │   ├── InputX.tsx
│   │   └── index.ts
│   ├── ModalX
│   │   ├── ModalX.css
│   │   ├── ModalX.tsx
│   │   ├── index.ts
│   │   ├── modal.context.tsx
│   │   └── types.ts
│   ├── SelectX
│   │   ├── SelectX.css
│   │   ├── SelectX.tsx
│   │   └── index.ts
│   └── ToastX
│       ├── ToastContainer.tsx
│       ├── ToastRenderer.tsx
│       ├── ToastX.tsx
│       ├── index.ts
│       ├── toast.css
│       ├── toastx.manager.ts
│       └── types.ts
├── index.ts
├── readme.md
├── types.ts
└── utils
    ├── formatting.ts
    ├── index.ts
    ├── normalize.ts
    ├── restrictions.ts
    └── validators.ts

## Usar los el template builder que esta en lib

### Props del Componente Principal

```typescript
interface TransaccionMultiStepProps {
  contexto: {
    tipo: 'GLOBAL' | 'MODULO' | 'DEVOLUCION';
    usuario: Usuario;
    moduloId?: number;
    moduloNombre?: string;
    categorias: number[];
    restricciones?: {
      solo_categorias?: number[];
      solo_almacenes?: number[];
      operaciones_permitidas?: string[];
    };
    permisos: string[];
    templates?: {
      entrega_id?: number;
      recibo_id?: number;
      descargo_id?: number;
    };
    transaccionOrigenId?: number;
    prefill?: Partial<TransaccionData>;
  };
  onComplete?: (transaccion: Transaccion) => void;
  onCancel?: () => void;
}
```

### State del Context

```typescript
interface TransaccionState {
  // Paso 1
  tipo: 'ENTRADA' | 'SALIDA';
  subtipo: TipoEntrada | TipoSalida | null;
  
  // Paso 2
  activos: ActivoSeleccionado[];
  datosActivo?: {
    actaControlBienes?: string;
    fechaActa?: Date;
    codigoCB?: string;
    valorUnitario?: number;
    proveedor?: string;
    factura?: string;
  };
  
  // Paso 3
  fotos: Foto[];
  accesorios?: string[];
  
  // Paso 4
  persona: Persona | null;
  fechaDevolucion?: Date;
  motivoDescargo?: MotivoDescargo;
  detallesDescargo?: string;
  documentoAprobacion?: string;
  observaciones?: string;
  
  // Paso 5
  firmaBase64?: string;
  fechaFirma?: Date;
  
  // Meta
  pasoActual: number;
  errores: Record<string, string>;
  cargando: boolean;
}
```

---

## ✅ Validaciones y Reglas de Negocio

### Validaciones por Tipo de Control

#### **Activos UNITARIOS:**
```typescript
// En tabla activos
cantidad = 1 (siempre)

// En transacciones_activos
cantidad = 1 (siempre)

// Trigger valida:
IF tipo_control = 'UNITARIO' AND cantidad != 1 THEN
  RAISE EXCEPTION
```

#### **Activos CANTIDAD:**
```typescript
// En tabla activos
cantidad >= 0

// En transacciones_activos
cantidad > 0 AND cantidad <= stock_disponible

// Trigger valida stock suficiente
```

### Validaciones por Tipo de Entrada

#### **INGRESO_CONTROL_BIENES:**
- ✅ Acta CB obligatoria
- ✅ Código CB obligatorio y único
- ✅ Fecha de acta obligatoria
-  Valor unitario recomendado

#### **ADQUISICION_DIRECTA:**
- ✅ NO requiere código CB
- ✅ Código SIGA auto-generado
-  Proveedor y factura opcionales
- ℹ️ Ideal para consumibles

### Validaciones por Tipo de Salida

#### **ASIGNACION:**
- ✅ Persona obligatoria
- ✅ Firma obligatoria
- ✅ Activo debe estar DISPONIBLE

#### **PRESTAMO:**
- ✅ Persona obligatoria
- ✅ Fecha de devolución obligatoria
- ✅ Fecha devolución > fecha actual
- ✅ Firma obligatoria
- ✅ Activo debe estar DISPONIBLE

#### **DESCARGO:**
- ✅ Motivo obligatorio
- ✅ Detalles obligatorios
- ✅ Documento de aprobación obligatorio
- ✅ Persona que autoriza obligatoria
- ✅ Firma obligatoria

### Validaciones de Permisos

```typescript
// Middleware de autorización
function validarPermisos(usuario, moduloId, operacion) {
  if (usuario.rol === 'ADMIN') {
    return true; // Admin puede todo
  }
  
  // Verificar acceso al módulo
  const tieneAcceso = usuario.modulos.includes(moduloId);
  if (!tieneAcceso) {
    throw new Error('No tienes acceso a este módulo');
  }
  
  // Verificar permiso específico
  const modulo = await getModulo(moduloId);
  const tienePermiso = modulo.permisos[operacion];
  
  if (!tienePermiso) {
    throw new Error(`No tienes permiso para: ${operacion}`);
  }
  
  return true;
}
```

### Validaciones de Stock

```typescript
// Antes de permitir salida de activos CANTIDAD
function validarStock(activoId, cantidadSolicitada) {
  const activo = await getActivo(activoId);
  
  if (activo.categoria.tipo_control === 'CANTIDAD') {
    if (cantidadSolicitada > activo.cantidad) {
      throw new Error(
        `Stock insuficiente. Disponible: ${activo.cantidad}, 
         Solicitado: ${cantidadSolicitada}`
      );
    }
    
    const stockRestante = activo.cantidad - cantidadSolicitada;
    if (stockRestante < activo.cantidad_minima) {
      // Advertencia (no bloquea)
      warnings.push(
        `ALERTA: Stock quedará en ${stockRestante}, 
         por debajo del mínimo (${activo.cantidad_minima})`
      );
    }
  }
}
```

---

## 🔌 Integración con Backend

### Endpoints Necesarios

#### **POST /api/transacciones**

Crear nueva transacción

```typescript
Request Body:
{
  tipo: 'ENTRADA' | 'SALIDA',
  tipo_entrada?: TipoEntrada,
  tipo_salida?: TipoSalida,
  modulo_id?: number,
  persona_id: number,
  usuario_id: number,
  
  // Datos específicos
  acta_control_bienes?: string,
  fecha_acta_control_bienes?: Date,
  fecha_devolucion_esperada?: Date,
  motivo_descargo?: MotivoDescargo,
  comentario_descargo?: string,
  documento_aprobacion_descargo?: string,
  
  observaciones?: string,
  
  // Activos
  activos: [
    {
      activo_id: number,
      cantidad: number,
      estado_anterior?: string,
      estado_salida?: string
    }
  ],
  
  // Firma
  firma_base64: string,
  
  // Nuevos activos (si es entrada)
  nuevos_activos?: [
    {
      codigo_inventario_control_bienes?: string,
      marca: string,
      modelo: string,
      categoria_id: number,
      cantidad: number,
      unidad_medida?: string,
      atributos?: object,
      valor_unitario?: number,
      // ... otros campos
    }
  ]
}

Response:
{
  success: true,
  data: {
    transaccion_id: number,
    codigo: string,
    activos_creados?: number[],
    pdf_url: string
  }
}
```

#### **POST /api/transacciones/:id/fotos**

Subir fotos de evidencia

```typescript
Request: FormData
- fotos: File[]
- momento: 'ANTES' | 'DESPUES'
- tipo: TipoImagen
- descripciones: string[]
- activo_id?: number

Response:
{
  success: true,
  data: {
    imagenes: [
      {
        id: number,
        url: string,
        tipo: string
      }
    ]
  }
}
```

#### **GET /api/activos/disponibles**

Obtener activos disponibles para salida

```typescript
Query Params:
- modulo_id?: number
- categoria_id?: number[]
- almacen_id?: number
- estado: 'DISPONIBLE'
- search?: string

Response:
{
  success: true,
  data: [
    {
      id: number,
      codigo_inventario_local: string,
      codigo_inventario_control_bienes: string,
      marca: string,
      modelo: string,
      categoria: {
        id: number,
        nombre: string,
        tipo_control: 'UNITARIO' | 'CANTIDAD'
      },
      cantidad: number,
      unidad_medida?: string,
      almacen: {...},
      valor_unitario?: number,
      imagenes: [...]
    }
  ]
}
```

#### **GET /api/transacciones/activas**

Obtener transacciones activas (para devoluciones)

```typescript
Query Params:
- modulo_id?: number
- persona_id?: number
- tipo: 'SALIDA'
- estado: 'ACTIVA'

Response:
{
  success: true,
  data: [
    {
      id: number,
      codigo: string,
      tipo_salida: 'ASIGNACION' | 'PRESTAMO',
      fecha: Date,
      persona: {...},
      activos: [...],
      fecha_devolucion_esperada?: Date,
      dias_activa: number
    }
  ]
}
```

#### **POST /api/transacciones/:id/generar-pdf**

Generar PDF del acta

```typescript
Request Body:
{
  template_id?: number,
  tipo: 'entrega' | 'recibo' | 'descargo'
}

Response:
{
  success: true,
  data: {
    pdf_url: string,
    pdf_base64?: string
  }
}
```

---

## 📚 Casos de Uso

### Caso 1: Gabriel - Entrada de Celulares desde Control de Bienes

**Contexto:**
- Usuario: Gabriel (Operador)
- Módulo: Gestión de Flotas
- Acción: Ingresar nuevos celulares

**Flujo:**
1. Gabriel se loguea y selecciona rol "Operador"
2. En su menú ve "📱 Gestión de Flotas"
3. Click en módulo → Se abre el workspace
4. Click en "+ Nueva Entrada"
5. `TransaccionMultiStep` se abre con contexto de módulo

**Pasos en el wizard:**
- **Paso 1:** Selecciona "Entrada" → "Ingreso desde Control de Bienes"
- **Paso 2:** Llena datos:
  - Acta CB: CB-2026-001
  - Código CB: CB-2026-5678
  - Categoría: Dispositivos Móviles (única opción)
  - Marca: Samsung
  - Modelo: Galaxy S23
  - IMEI, Color, Capacidad (campos dinámicos)
  - Valor: RD$ 45,000
- **Paso 3:** Toma 2 fotos (general y del serial)
- **Paso 4:** Busca "Almacén Central" como receptor
- **Paso 5:** Firma digital del encargado de almacén
- **Paso 6:** Imprime acta y guarda

**Resultado:**
- Activo creado con código SIGA-2026-045
- Transacción TRX-2026-00123
- PDF generado
- Email enviado al encargado de almacén

---

### Caso 2: Gabriel - Asignación de Celular a Empleado

**Contexto:**
- Módulo: Gestión de Flotas
- Acción: Asignar celular a María García

**Pasos:**
- **Paso 1:** Selecciona "Salida" → "Asignación"
- **Paso 2:** Busca y selecciona celular CEL-2024-001 (disponible)
- **Paso 3:** Toma 3 fotos del estado actual + checklist accesorios
- **Paso 4:** Busca "María García", confirma datos
- **Paso 5:** María firma digitalmente
- **Paso 6:** Imprime acta de entrega, envía email a María

**Resultado:**
- Activo cambia a estado ASIGNADO
- Transacción TRX-2026-00124
- María recibe email con PDF del acta
- SMS recordatorio de responsabilidad

---

### Caso 3: Andy - Préstamo de Proyector

**Contexto:**
- Módulo: Gestión de Proyectores
- Acción: Prestar proyector por 1 semana

**Pasos:**
- **Paso 1:** Selecciona "Salida" → "Préstamo"
- **Paso 2:** Selecciona proyector PROY-2024-005
- **Paso 3:** Fotos + checklist (proyector, cable HDMI, control remoto)
- **Paso 4:** 
  - Persona: Carlos López
  - Fecha devolución: 07/02/2026 (7 días)
- **Paso 5:** Carlos firma
- **Paso 6:** Genera acta, programa recordatorio automático

**Resultado:**
- Proyector en estado PRESTADO
- Recordatorio automático 5/02/2026 (2 días antes)
- SMS a Carlos el día del vencimiento

---

### Caso 4: Admin - Descargo de Laptop Dañada

**Contexto:**
- Usuario: Admin
- Acción: Dar de baja laptop irreparable

**Pasos:**
- **Paso 1:** Selecciona "Salida" → "Descargo"
- **Paso 2:** Selecciona LAPTOP-2023-012
- **Paso 3:** Fotos del daño (pantalla rota, derrame de líquido)
- **Paso 4:**
  - Motivo: Daño Irreparable
  - Detalles: "Derrame de café, placa madre dañada, reparación > 80% del valor"
  - Documento: RES-2026-003 (resolución de Comité de Descargo)
  - Persona: Comisión de Descargo
- **Paso 5:** Firma del presidente de la comisión
- **Paso 6:** Genera acta de baja, notifica a Control de Bienes

**Resultado:**
- Laptop pasa a estado DESCARGADO
- Notificación automática a Control de Bienes
- Acta de baja para archivo
- Actualización de inventario valorado

---

### Caso 5: Gabriel - Devolución de Celular

**Contexto:**
- Juan Pérez devuelve celular que tenía asignado
- Acción: Registrar devolución

**Flujo:**
1. Gabriel busca en transacciones activas
2. Encuentra: "Juan Pérez - Samsung Galaxy S23"
3. Click "Registrar Devolución"
4. `TransaccionMultiStep` se abre en modo DEVOLUCION

**Pasos:**
- **Paso 1:** [Omitido - ya sabe que es devolución]
- **Paso 2:** Pre-llenado: Activo CEL-2024-001, Juan Pérez
- **Paso 3:** Fotos del estado al devolver (inspección)
- **Paso 4:** Confirma datos, indica estado: DISPONIBLE
- **Paso 5:** Juan firma confirmando devolución
- **Paso 6:** Genera acta de devolución

**Resultado:**
- Activo vuelve a estado DISPONIBLE
- Transacción original (asignación) pasa a COMPLETADA
- Nueva transacción de tipo DEVOLUCION creada
- Comparación de fotos ANTES (asignación) vs DESPUÉS (devolución)

---

### Caso 6: Gabriel - Entrada de Consumibles (Adquisición Directa)

**Contexto:**
- Módulo: Gestión de Suministros
- Acción: Registrar compra de 100 bolígrafos (no pasan por CB)

**Pasos:**
- **Paso 1:** "Entrada" → "Adquisición Directa"
- **Paso 2:**
  - Categoría: Consumibles de Oficina
  - Marca: Bic
  - Modelo: Cristal Azul
  - Cantidad: 100
  - Unidad: UNIDAD
  - Proveedor: Papelería XYZ
  - Factura: FAC-2024-001
  - Valor unitario: RD$ 15
- **Paso 3:** Omite fotos
- **Paso 4:** Recibido por Almacén
- **Paso 5:** Firma del encargado
- **Paso 6:** Genera entrada

**Resultado:**
- Activo creado con código SIGA-2026-150
- SIN código de Control de Bienes
- Stock: 100 unidades
- Valor total: RD$ 1,500

---

## 🎨 Consideraciones de UX/UI

### Indicadores de Progreso

```
Paso 1/6 ●━━━━━━━━━━━━━━━━━ 16%
Tipo      Activos  Fotos  Persona  Firma  Confirmar
```

### Estados de Validación

```
✅ Campo válido
 Advertencia (puede continuar)
❌ Error (bloquea avance)
ℹ️ Información adicional
```

### Auto-guardado

```
💾 Guardado automáticamente a las 10:45 AM
⏳ Guardando...
```

### Botones Contextuales

```
[← Atrás]  [💾 Guardar Borrador]  [Siguiente →]

[Último paso]
[← Atrás]  [🖨️ Imprimir y Guardar]  [✓ Finalizar]
```

### Mensajes de Confirmación

```
¿Estás seguro de cancelar?
Se perderán los datos ingresados.

[Continuar editando]  [Sí, cancelar]
```

---

## 🚀 Próximos Pasos de Implementación

### Fase 1: Componente Base
- [ ] Crear estructura de carpetas
- [ ] Implementar TransaccionContext
- [ ] Crear componente wrapper principal
- [ ] Implementar navegación entre pasos

### Fase 2: Steps de Entrada
- [ ] Step 1: Tipo de transacción
- [ ] Step 2: Registro de activos (3 variantes)
- [ ] Step 3: Upload de fotos
- [ ] Step 4: Selector de persona
- [ ] Step 5: Canvas de firma
- [ ] Step 6: Resumen y PDF

### Fase 3: Steps de Salida
- [ ] Step 1: Tipo de salida
- [ ] Step 2: Selección de activos
- [ ] Step 3: Fotos y checklist
- [ ] Step 4: Receptor y detalles
- [ ] Step 5: Firma digital
- [ ] Step 6: Confirmación

### Fase 4: Integraciones
- [ ] Endpoints de backend
- [ ] Generación de PDFs
- [ ] Envío de emails
- [ ] Envío de SMS
- [ ] Upload de imágenes

### Fase 5: Validaciones
- [ ] Validaciones por tipo de control
- [ ] Validaciones de stock
- [ ] Validaciones de permisos
- [ ] Triggers de base de datos

### Fase 6: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests por caso de uso
- [ ] Testing de permisos

---

## 📝 Notas Adicionales

### Diferencias Clave: Adquisición Directa vs Ingreso CB

| Característica | Ingreso CB | Adquisición Directa |
|----------------|------------|---------------------|
| Acta CB | ✅ Obligatoria | ❌ No aplica |
| Código CB | ✅ Obligatorio | ❌ No tiene |
| Código SIGA | ✅ Auto-generado | ✅ Auto-generado |
| Valor |  Recomendado |  Opcional |
| Uso típico | Activos patrimoniales | Consumibles de bajo valor |

### Flujo de Estados de Activos

```
DISPONIBLE
    ↓ (Asignación/Préstamo)
ASIGNADO / PRESTADO
    ↓ (Devolución)
DISPONIBLE o MANTENIMIENTO
    ↓ (Si requiere reparación)
MANTENIMIENTO
    ↓ (Reparado)
DISPONIBLE
    ↓ (Descargo)
DESCARGADO (final)
```

### Flujo de Estados de Transacciones

```
ACTIVA
    ↓ (Préstamo/Asignación en curso)
ACTIVA
    ↓ (Se registra devolución)
COMPLETADA

ACTIVA
    ↓ (Error, se anula)
CANCELADA
```

---

## 📞 Soporte y Contacto

Para dudas sobre la implementación de este componente, contactar:

- **Arquitecto de Sistema:** [nombre]
- **Lead Frontend:** [nombre]
- **Lead Backend:** [nombre]

---

**Última actualización:** Enero 30, 2026
**Versión del documento:** 1.0.0