import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Almacenes } from '../almacenes.types';
import './AlmacenesForm.css';

interface AlmacenesFormProps {
  initialData?: Almacenes | null;
  onSubmit: (data: { nombre: string; sede_id: number; ubicacion: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  sedesOptions: Array<{ value: number; label: string }>;
}

export function AlmacenesForm({ initialData, onSubmit, onCancel, loading, sedesOptions }: AlmacenesFormProps) {
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
      sede_id: result.body.sede_id,
      ubicacion: result.body.ubicacion,
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

        {/* SelectX - Sede Id */}
        <SelectX
          name="sede_id"
          label="Sede Id"
          placeholder="Ingrese sede id"
          helperText="Campo sede_id"
          options={ sedesOptions }
          defaultValue={ initialData?.sede_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Ubicacion */}
        <InputX
          type="text"
          name="ubicacion"
          label="Ubicacion"
          placeholder="Ingrese ubicacion"
          helperText="Campo ubicacion"
          defaultValue={ initialData?.ubicacion }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
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