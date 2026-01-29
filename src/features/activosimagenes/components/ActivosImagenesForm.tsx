import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { ActivosImagenes } from '../activosimagenes.types';
import './ActivosImagenesForm.css';

interface ActivosImagenesFormProps {
  initialData?: ActivosImagenes | null;
  onSubmit: (data: { activo_id: number; tipo: any; url: string; nombre_archivo: string; descripcion: string; es_principal: boolean; orden: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  activosOptions: Array<{ value: number; label: string }>;
}

export function ActivosImagenesForm({ initialData, onSubmit, onCancel, loading, activosOptions }: ActivosImagenesFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  // Función para normalizar tipo a array
  const normalizeTipo = (value: any): FieldDefinition[] => {
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
  const [tipoState, setTipoState] = useState<FieldDefinition[]>(
    normalizeTipo(initialData?.tipo)
  );

  const handleSubmit = (result: FormSubmitResult) => {
    if (!result.general_validation) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({
      activo_id: result.body.activo_id,
      tipo: result.body.tipo,
      url: result.body.url,
      nombre_archivo: result.body.nombre_archivo,
      descripcion: result.body.descripcion,
      es_principal: result.body.es_principal,
      orden: result.body.orden,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* SelectX - Activo Id */}
        <SelectX
          name="activo_id"
          label="Activo Id"
          placeholder="Ingrese activo id"
          helperText="Campo activo_id"
          options={ activosOptions }
          defaultValue={ initialData?.activo_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Tipo */}
        <DynamicFieldsX
          name="tipo"
          label="Tipo"
          helperText="Campo tipo"
          contract="none"
          value={ tipoState }
          onChange={setTipoState}
        />

        {/* InputX - Url */}
        <InputX
          type="text"
          name="url"
          label="Url"
          placeholder="Ingrese url"
          helperText="Campo url"
          defaultValue={ initialData?.url }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Nombre Archivo */}
        <InputX
          type="text"
          name="nombre_archivo"
          label="Nombre Archivo"
          placeholder="Ingrese nombre archivo"
          helperText="Campo nombre_archivo"
          defaultValue={ initialData?.nombre_archivo }
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

        {/* InputX - Es Principal */}
        <InputX
          type="text"
          name="es_principal"
          label="Es Principal"
          placeholder="Ingrese es principal"
          helperText="Campo es_principal"
          defaultValue={ initialData?.es_principal }
        />

        {/* InputX - Orden */}
        <InputX
          type="number"
          name="orden"
          label="Orden"
          placeholder="Ingrese orden"
          helperText="Campo orden"
          defaultValue={ initialData?.orden }
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