import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Templates } from '../templates.types';
import './TemplatesForm.css';

interface TemplatesFormProps {
  initialData?: Templates | null;
  onSubmit: (data: { nombre: string; descripcion: string; tipo: any; contenido_hbs: string; variables_utilizadas: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TemplatesForm({ initialData, onSubmit, onCancel, loading }: TemplatesFormProps) {
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

  // Función para normalizar variables_utilizadas a array
  const normalizeVariablesUtilizadas = (value: any): FieldDefinition[] => {
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
  const [variables_utilizadasState, setVariablesUtilizadasState] = useState<FieldDefinition[]>(
    normalizeVariablesUtilizadas(initialData?.variables_utilizadas)
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
      tipo: result.body.tipo,
      contenido_hbs: result.body.contenido_hbs,
      variables_utilizadas: result.body.variables_utilizadas,
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

        {/* DynamicFieldsX - Tipo */}
        <DynamicFieldsX
          name="tipo"
          label="Tipo"
          helperText="Campo tipo"
          contract="none"
          value={ tipoState }
          onChange={setTipoState}
        />

        {/* InputX - Contenido Hbs */}
        <InputX
          type="text"
          name="contenido_hbs"
          label="Contenido Hbs"
          placeholder="Ingrese contenido hbs"
          helperText="Campo contenido_hbs"
          defaultValue={ initialData?.contenido_hbs }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Variables Utilizadas */}
        <DynamicFieldsX
          name="variables_utilizadas"
          label="Variables Utilizadas"
          helperText="Campo variables_utilizadas"
          contract="none"
          value={ variables_utilizadasState }
          onChange={setVariablesUtilizadasState}
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