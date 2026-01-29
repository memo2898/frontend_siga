import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { TiposDocumentos } from '../tiposdocumentos.types';
import './TiposDocumentosForm.css';

interface TiposDocumentosFormProps {
  initialData?: TiposDocumentos | null;
  onSubmit: (data: { nombre: string; codigo: string; descripcion: string; formato_validacion: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TiposDocumentosForm({ initialData, onSubmit, onCancel, loading }: TiposDocumentosFormProps) {
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
      codigo: result.body.codigo,
      descripcion: result.body.descripcion,
      formato_validacion: result.body.formato_validacion,
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

        {/* InputX - Codigo */}
        <InputX
          type="text"
          name="codigo"
          label="Codigo"
          placeholder="Ingrese codigo"
          helperText="Campo codigo"
          defaultValue={ initialData?.codigo }
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

        {/* InputX - Formato Validacion */}
        <InputX
          type="text"
          name="formato_validacion"
          label="Formato Validacion"
          placeholder="Ingrese formato validacion"
          helperText="Campo formato_validacion"
          defaultValue={ initialData?.formato_validacion }
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