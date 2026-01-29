import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Personas } from '../personas.types';
import './PersonasForm.css';

interface PersonasFormProps {
  initialData?: Personas | null;
  onSubmit: (data: { nombre: string; tipo_documento_id: number; numero_documento: string; cargo: string; telefono: string; correo: string; departamento_id: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  departamentosOptions: Array<{ value: number; label: string }>;
}

export function PersonasForm({ initialData, onSubmit, onCancel, loading, departamentosOptions }: PersonasFormProps) {
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
      tipo_documento_id: result.body.tipo_documento_id,
      numero_documento: result.body.numero_documento,
      cargo: result.body.cargo,
      telefono: result.body.telefono,
      correo: result.body.correo,
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

        {/* InputX - Tipo Documento Id */}
        <InputX
          type="number"
          name="tipo_documento_id"
          label="Tipo Documento Id"
          placeholder="Ingrese tipo documento id"
          helperText="Campo tipo_documento_id"
          defaultValue={ initialData?.tipo_documento_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Numero Documento */}
        <InputX
          type="text"
          name="numero_documento"
          label="Numero Documento"
          placeholder="Ingrese numero documento"
          helperText="Campo numero_documento"
          defaultValue={ initialData?.numero_documento }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Cargo */}
        <InputX
          type="text"
          name="cargo"
          label="Cargo"
          placeholder="Ingrese cargo"
          helperText="Campo cargo"
          defaultValue={ initialData?.cargo }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Telefono */}
        <InputX
          type="text"
          name="telefono"
          label="Telefono"
          placeholder="Ingrese telefono"
          helperText="Campo telefono"
          defaultValue={ initialData?.telefono }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Correo */}
        <InputX
          type="text"
          name="correo"
          label="Correo"
          placeholder="Ingrese correo"
          helperText="Campo correo"
          defaultValue={ initialData?.correo }
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