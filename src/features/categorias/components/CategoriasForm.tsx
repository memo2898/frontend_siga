import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Categorias } from '../categorias.types';
import './CategoriasForm.css';

interface CategoriasFormProps {
  initialData?: Categorias | null;
  onSubmit: (data: { nombre: string; descripcion: string; tipo_control: string; campos_activo: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CategoriasForm({ initialData, onSubmit, onCancel, loading }: CategoriasFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  // Función para normalizar campos_activo a array
  const normalizeCamposActivo = (value: any): FieldDefinition[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Estado para DynamicFieldsX
  const [campos_activoState, setCamposActivoState] = useState<FieldDefinition[]>(
    normalizeCamposActivo(initialData?.campos_activo)
  );

  const handleSubmit = (result: FormSubmitResult) => {
    if (!result.general_validation) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({
      nombre: result.body.nombre,
      descripcion: result.body.descripcion,
      tipo_control: result.body.tipo_control,
      campos_activo: result.body.campos_activo,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* InputX - Nombre */}
        <InputX
          type="text"
          name="nombre"
          label="Nombre"
          placeholder="Ingrese nombre"
          helperText="Nombre de la categoría"
          defaultValue={ initialData?.nombre }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Descripcion */}
        <InputX
          type="text"
          name="descripcion"
          label="Descripcion"
          placeholder="Ingrese descripcion"
          helperText="Descripción de la categoría"
          defaultValue={ initialData?.descripcion }
        />

        {/* InputX - Tipo Control */}
        <InputX
          type="text"
          name="tipo_control"
          label="Tipo Control"
          placeholder="Ingrese tipo control"
          helperText="Campo tipo_control"
          defaultValue={ initialData?.tipo_control }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Campos Activo */}
        <DynamicFieldsX
          name="campos_activo"
          label="Campos Activo"
          helperText="Estructura de campos personalizados para los activos de esta categoría"
          contract="define"
          value={ campos_activoState }
          onChange={setCamposActivoState}
        />

      </div>

      {/* Mensaje de error - solo aparece después de submit fallido */}
      {showError && (
        <div className="form-error-message">
          <span></span>
          <span>Por favor, corrija los errores marcados antes de continuar.</span>
        </div>
      )}

      {/* Botones */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          data-submitx
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </FormX>
  );
}