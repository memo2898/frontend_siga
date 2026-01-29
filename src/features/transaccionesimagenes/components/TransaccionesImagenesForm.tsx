import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { TransaccionesImagenes } from '../transaccionesimagenes.types';
import './TransaccionesImagenesForm.css';

interface TransaccionesImagenesFormProps {
  initialData?: TransaccionesImagenes | null;
  onSubmit: (data: { transaccion_id: number; activo_id: number; momento: string; tipo: any; url: string; nombre_archivo: string; descripcion: string; orden: number }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  transaccionesOptions: Array<{ value: number; label: string }>;
  activosOptions: Array<{ value: number; label: string }>;
}

export function TransaccionesImagenesForm({ initialData, onSubmit, onCancel, loading, transaccionesOptions, activosOptions }: TransaccionesImagenesFormProps) {
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
      transaccion_id: result.body.transaccion_id,
      activo_id: result.body.activo_id,
      momento: result.body.momento,
      tipo: result.body.tipo,
      url: result.body.url,
      nombre_archivo: result.body.nombre_archivo,
      descripcion: result.body.descripcion,
      orden: result.body.orden,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* SelectX - Transaccion Id */}
        <SelectX
          name="transaccion_id"
          label="Transaccion Id"
          placeholder="Ingrese transaccion id"
          helperText="Campo transaccion_id"
          options={ transaccionesOptions }
          defaultValue={ initialData?.transaccion_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

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

        {/* InputX - Momento */}
        <InputX
          type="text"
          name="momento"
          label="Momento"
          placeholder="Ingrese momento"
          helperText="Campo momento"
          defaultValue={ initialData?.momento }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
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