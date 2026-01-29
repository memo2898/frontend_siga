import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { ModulosCategorias } from '../moduloscategorias.types';
import './ModulosCategoriasForm.css';

interface ModulosCategoriasFormProps {
  initialData?: ModulosCategorias | null;
  onSubmit: (data: { modulo_id: number; categoria_id: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  modulosOptions: Array<{ value: number; label: string }>;
  categoriasOptions: Array<{ value: number; label: string }>;
}

export function ModulosCategoriasForm({ initialData, onSubmit, onCancel, loading, modulosOptions, categoriasOptions }: ModulosCategoriasFormProps) {
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
      modulo_id: result.body.modulo_id,
      categoria_id: result.body.categoria_id,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* SelectX - Modulo Id */}
        <SelectX
          name="modulo_id"
          label="Modulo Id"
          placeholder="Ingrese modulo id"
          helperText="Campo modulo_id"
          options={ modulosOptions }
          defaultValue={ initialData?.modulo_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* SelectX - Categoria Id */}
        <SelectX
          name="categoria_id"
          label="Categoria Id"
          placeholder="Ingrese categoria id"
          helperText="Campo categoria_id"
          options={ categoriasOptions }
          defaultValue={ initialData?.categoria_id }
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