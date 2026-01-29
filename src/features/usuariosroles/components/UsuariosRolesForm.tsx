import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { UsuariosRoles } from '../usuariosroles.types';
import './UsuariosRolesForm.css';

interface UsuariosRolesFormProps {
  initialData?: UsuariosRoles | null;
  onSubmit: (data: { usuario_id: number; rol_id: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  usuariosOptions: Array<{ value: number; label: string }>;
  rolesOptions: Array<{ value: number; label: string }>;
}

export function UsuariosRolesForm({ initialData, onSubmit, onCancel, loading, usuariosOptions, rolesOptions }: UsuariosRolesFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  const handleSubmit = (result: FormSubmitResult) => {
    if (!result.general_validation) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({
      usuario_id: result.body.usuario_id,
      rol_id: result.body.rol_id,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* SelectX - Usuario Id */}
        <SelectX
          name="usuario_id"
          label="Usuario Id"
          placeholder="Ingrese usuario id"
          helperText="Campo usuario_id"
          options={ usuariosOptions }
          defaultValue={ initialData?.usuario_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* SelectX - Rol Id */}
        <SelectX
          name="rol_id"
          label="Rol Id"
          placeholder="Ingrese rol id"
          helperText="Campo rol_id"
          options={ rolesOptions }
          defaultValue={ initialData?.rol_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
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