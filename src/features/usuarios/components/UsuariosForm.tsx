import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Usuarios } from '../usuarios.types';
import './UsuariosForm.css';

interface UsuariosFormProps {
  initialData?: Usuarios | null;
  onSubmit: (data: { nombre: string; email: string; password: string; departamento_id: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  departamentosOptions: Array<{ value: number; label: string }>;
}

export function UsuariosForm({ initialData, onSubmit, onCancel, loading, departamentosOptions }: UsuariosFormProps) {
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
      nombre: result.body.nombre,
      email: result.body.email,
      password: result.body.password,
      departamento_id: result.body.departamento_id,
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

        {/* InputX - Email */}
        <InputX
          type="text"
          name="email"
          label="Email"
          placeholder="Ingrese email"
          helperText="Campo email"
          defaultValue={ initialData?.email }
          rules={ {
            validations: [
              { type: 'email', message: '' },
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Password */}
        <InputX
          type="text"
          name="password"
          label="Password"
          placeholder="Ingrese password"
          helperText="Campo password"
          defaultValue={ initialData?.password }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* SelectX - Departamento Id */}
        <SelectX
          name="departamento_id"
          label="Departamento Id"
          placeholder="Ingrese departamento id"
          helperText="Campo departamento_id"
          options={ departamentosOptions }
          defaultValue={ initialData?.departamento_id }
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