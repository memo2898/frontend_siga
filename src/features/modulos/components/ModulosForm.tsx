import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Modulos } from '../modulos.types';
import './ModulosForm.css';

interface ModulosFormProps {
  initialData?: Modulos | null;
  onSubmit: (data: { nombre: string; descripcion: string; permite_asignacion: boolean; permite_prestamo: boolean; permite_descargo: boolean; template_entrega_id: number; template_recibo_id: number; template_descargo_id: number; configuracion: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ModulosForm({ initialData, onSubmit, onCancel, loading }: ModulosFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  // Función para normalizar configuracion a array
  const normalizeConfiguracion = (value: any): FieldDefinition[] => {
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
  const [configuracionState, setConfiguracionState] = useState<FieldDefinition[]>(
    normalizeConfiguracion(initialData?.configuracion)
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
      permite_asignacion: result.body.permite_asignacion,
      permite_prestamo: result.body.permite_prestamo,
      permite_descargo: result.body.permite_descargo,
      template_entrega_id: result.body.template_entrega_id,
      template_recibo_id: result.body.template_recibo_id,
      template_descargo_id: result.body.template_descargo_id,
      configuracion: result.body.configuracion,
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

        {/* InputX - Permite Asignacion */}
        <InputX
          type="text"
          name="permite_asignacion"
          label="Permite Asignacion"
          placeholder="Ingrese permite asignacion"
          helperText="Campo permite_asignacion"
          defaultValue={ initialData?.permite_asignacion }
        />

        {/* InputX - Permite Prestamo */}
        <InputX
          type="text"
          name="permite_prestamo"
          label="Permite Prestamo"
          placeholder="Ingrese permite prestamo"
          helperText="Campo permite_prestamo"
          defaultValue={ initialData?.permite_prestamo }
        />

        {/* InputX - Permite Descargo */}
        <InputX
          type="text"
          name="permite_descargo"
          label="Permite Descargo"
          placeholder="Ingrese permite descargo"
          helperText="Campo permite_descargo"
          defaultValue={ initialData?.permite_descargo }
        />

        {/* InputX - Template Entrega Id */}
        <InputX
          type="number"
          name="template_entrega_id"
          label="Template Entrega Id"
          placeholder="Ingrese template entrega id"
          helperText="Campo template_entrega_id"
          defaultValue={ initialData?.template_entrega_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Template Recibo Id */}
        <InputX
          type="number"
          name="template_recibo_id"
          label="Template Recibo Id"
          placeholder="Ingrese template recibo id"
          helperText="Campo template_recibo_id"
          defaultValue={ initialData?.template_recibo_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Template Descargo Id */}
        <InputX
          type="number"
          name="template_descargo_id"
          label="Template Descargo Id"
          placeholder="Ingrese template descargo id"
          helperText="Campo template_descargo_id"
          defaultValue={ initialData?.template_descargo_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Configuracion */}
        <DynamicFieldsX
          name="configuracion"
          label="Configuracion"
          helperText="Campo configuracion"
          contract="none"
          value={ configuracionState }
          onChange={setConfiguracionState}
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