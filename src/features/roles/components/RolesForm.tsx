import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Roles } from '../roles.types';
import './RolesForm.css';

interface RolesFormProps {
  initialData?: Roles | null;
  onSubmit: (data: { nombre: string; descripcion: string; permisos: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function RolesForm({ initialData, onSubmit, onCancel, loading }: RolesFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  // Función para normalizar permisos a array
  const normalizePermisos = (value: any): FieldDefinition[] => {
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
  const [permisosState, setPermisosState] = useState<FieldDefinition[]>(
    normalizePermisos(initialData?.permisos)
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
      permisos: result.body.permisos,
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
          helperText="Campo nombre"
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
          helperText="Campo descripcion"
          defaultValue={ initialData?.descripcion }
        />

        {/* DynamicFieldsX - Permisos */}
        <DynamicFieldsX
          name="permisos"
          label="Permisos"
          helperText="Campo permisos"
          contract="none"
          value={ permisosState }
          onChange={setPermisosState}
        />

      </div>

      {/* Mensaje de error - solo aparece después de submit fallido */}
      {showError && (
        <div className="form-error-message">
          <span>⚠️</span>
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