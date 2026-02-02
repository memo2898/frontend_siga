import { useEffect } from 'react';
import { InputX, DynamicFieldsX, type FieldDefinition } from '../../../../lib/uiX';
import type { Activos } from '../../../activos/activos.types';
import type { Categorias } from '../../../categorias/categorias.types';
import './Components.css';

export interface NuevoActivoFormData {
  // Campos fijos
  marca: string;
  modelo: string;
  cantidad: number;
  codigo_inventario_local: string;
  unidad_medida: string;
  // Campos dinámicos según la categoría
  atributos: Record<string, unknown>;
}

interface NuevoActivoFormProps {
  categoriaSeleccionada: Categorias | null;
  onAgregarActivo: (activo: Partial<Activos>, categoriaId: number) => void;
  onCancelar: () => void;
  // Para persistir estado entre cambios de categoría
  formData: NuevoActivoFormData;
  onFormDataChange: (data: NuevoActivoFormData) => void;
  errors: string[];
  onErrorsChange: (errors: string[]) => void;
}

export const INITIAL_FORM_DATA: NuevoActivoFormData = {
  marca: '',
  modelo: '',
  cantidad: 1,
  codigo_inventario_local: '',
  unidad_medida: 'UNIDAD',
  atributos: {},
};

export function NuevoActivoForm({
  categoriaSeleccionada,
  onAgregarActivo,
  onCancelar,
  formData,
  onFormDataChange,
  errors,
  onErrorsChange,
}: NuevoActivoFormProps) {
  // Determinar tipo de control
  const tipoControl = categoriaSeleccionada?.tipo_control || 'UNITARIO';
  const esUnitario = tipoControl === 'UNITARIO';

  // Obtener el schema de la categoría
  const getCamposSchema = (): FieldDefinition[] => {
    if (!categoriaSeleccionada?.campos_activo) return [];

    // campos_activo ya es un array de FieldDefinition
    const campos = categoriaSeleccionada.campos_activo;
    if (Array.isArray(campos)) {
      return campos as unknown as FieldDefinition[];
    }

    // Si por alguna razón viene como string JSON
    if (typeof campos === 'string') {
      try {
        return JSON.parse(campos);
      } catch {
        return [];
      }
    }

    return [];
  };

  const schema = getCamposSchema();
  const tieneSchema = schema.length > 0;

  // Si es unitario, asegurar cantidad=1 y unidad='UNIDAD'
  useEffect(() => {
    if (esUnitario && (formData.cantidad !== 1 || formData.unidad_medida !== 'UNIDAD')) {
      onFormDataChange({
        ...formData,
        cantidad: 1,
        unidad_medida: 'UNIDAD',
      });
    }
  }, [esUnitario, formData, onFormDataChange]);

  // Actualizar campo fijo
  const handleFieldChange = (field: keyof NuevoActivoFormData, value: unknown) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
    onErrorsChange([]);
  };

  // Actualizar campos dinámicos
  const handleAtributosChange = (atributos: Record<string, unknown>) => {
    onFormDataChange({
      ...formData,
      atributos,
    });
    onErrorsChange([]);
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.marca.trim()) {
      newErrors.push('La marca es requerida');
    }
    if (!formData.modelo.trim()) {
      newErrors.push('El modelo es requerido');
    }

    // Solo validar cantidad si NO es unitario
    if (!esUnitario && formData.cantidad < 1) {
      newErrors.push('La cantidad debe ser al menos 1');
    }

    // Validar campos requeridos del schema
    schema.forEach((field) => {
      const isRequired = field.rules?.validations?.some((v) => v.type === 'required');
      if (isRequired) {
        const value = formData.atributos[field.name];
        if (value === undefined || value === null || value === '') {
          newErrors.push(`${field.label} es requerido`);
        }
      }
    });

    onErrorsChange(newErrors);
    return newErrors.length === 0;
  };

  // Agregar activo
  const handleAgregar = () => {
    if (!categoriaSeleccionada?.id) return;
    if (!validarFormulario()) return;

    const nuevoActivo: Partial<Activos> = {
      marca: formData.marca,
      modelo: formData.modelo,
      cantidad: esUnitario ? 1 : formData.cantidad,
      codigo_inventario_local: formData.codigo_inventario_local || undefined,
      unidad_medida: esUnitario ? 'UNIDAD' : formData.unidad_medida,
      atributos: formData.atributos,
      categoria_id: categoriaSeleccionada.id,
    };

    onAgregarActivo(nuevoActivo, categoriaSeleccionada.id);

    // Resetear formulario
    onFormDataChange(INITIAL_FORM_DATA);
  };

  if (!categoriaSeleccionada) {
    return (
      <div className="nuevo-activo-form">
        <div className="nuevo-activo-form-placeholder">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <p>Selecciona una categoria para agregar un nuevo activo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nuevo-activo-form">
      <div className="nuevo-activo-form-header">
        <span className="nuevo-activo-form-title">
          Nuevo activo en: <strong>{categoriaSeleccionada.nombre}</strong>
        </span>
        <span className="nuevo-activo-form-tipo-control">
          {esUnitario ? 'Control Unitario' : 'Control por Cantidad'}
        </span>
      </div>

      <div className="nuevo-activo-form-content">
        {/* Campos fijos */}
        <div className="nuevo-activo-form-section">
          <h4 className="nuevo-activo-form-section-title">Datos generales</h4>
          <div className="nuevo-activo-form-grid">
            <InputX
              name="marca"
              label="Marca"
              placeholder="Ej: Samsung, Dell, HP..."
              defaultValue={formData.marca}
              onChange={(value) => handleFieldChange('marca', value)}
              rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
            />
            <InputX
              name="modelo"
              label="Modelo"
              placeholder="Ej: Galaxy S23, XPS 15..."
              defaultValue={formData.modelo}
              onChange={(value) => handleFieldChange('modelo', value)}
              rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
            />
            <InputX
              name="codigo_inventario_local"
              label="Codigo de inventario (opcional)"
              placeholder="Ej: INV-2026-001"
              defaultValue={formData.codigo_inventario_local}
              onChange={(value) => handleFieldChange('codigo_inventario_local', value)}
            />

            {/* Solo mostrar cantidad y unidad si NO es unitario */}
            {!esUnitario && (
              <>
                <InputX
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  defaultValue={String(formData.cantidad)}
                  onChange={(value) => handleFieldChange('cantidad', Number(value) || 1)}
                  rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                />
                <InputX
                  name="unidad_medida"
                  label="Unidad de medida"
                  placeholder="Ej: KG, LITRO, METRO..."
                  defaultValue={formData.unidad_medida}
                  onChange={(value) => handleFieldChange('unidad_medida', value)}
                  rules={{ validations: [{ type: 'required', message: 'Requerido' }] }}
                />
              </>
            )}
          </div>
        </div>

        {/* Campos dinamicos de la categoria */}
        {tieneSchema && (
          <div className="nuevo-activo-form-section">
            <h4 className="nuevo-activo-form-section-title">
              Atributos de {categoriaSeleccionada.nombre}
            </h4>
            <DynamicFieldsX
              name="atributos"
              contract="follow"
              schema={schema}
              value={formData.atributos}
              onChange={handleAtributosChange}
            />
          </div>
        )}

        {/* Errores */}
        {errors.length > 0 && (
          <div className="nuevo-activo-form-errors">
            {errors.map((error, index) => (
              <p key={index} className="nuevo-activo-form-error">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="nuevo-activo-form-actions">
          <button
            type="button"
            className="nuevo-activo-btn nuevo-activo-btn--secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="nuevo-activo-btn nuevo-activo-btn--primary"
            onClick={handleAgregar}
          >
            + Agregar activo
          </button>
        </div>
      </div>
    </div>
  );
}
