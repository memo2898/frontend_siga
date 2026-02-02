import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { TransaccionesDetalle } from '../transaccionesdetalle.types';
import './TransaccionesDetalleForm.css';

interface TransaccionesDetalleFormProps {
  initialData?: TransaccionesDetalle | null;
  onSubmit: (data: { transaccion_id: number; activo_id: number; cantidad: number; estado_anterior: string; estado_salida: string; estado_retorno: string; observacion: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  transaccionesOptions: Array<{ value: number; label: string }>;
  activosOptions: Array<{ value: number; label: string }>;
}

export function TransaccionesDetalleForm({ initialData, onSubmit, onCancel, loading, transaccionesOptions, activosOptions }: TransaccionesDetalleFormProps) {
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
      transaccion_id: result.body.transaccion_id,
      activo_id: result.body.activo_id,
      cantidad: result.body.cantidad,
      estado_anterior: result.body.estado_anterior,
      estado_salida: result.body.estado_salida,
      estado_retorno: result.body.estado_retorno,
      observacion: result.body.observacion,
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

        {/* InputX - Cantidad */}
        <InputX
          type="number"
          name="cantidad"
          label="Cantidad"
          placeholder="Ingrese cantidad"
          helperText="Campo cantidad"
          defaultValue={ initialData?.cantidad }
        />

        {/* InputX - Estado Anterior */}
        <InputX
          type="text"
          name="estado_anterior"
          label="Estado Anterior"
          placeholder="Ingrese estado anterior"
          helperText="Campo estado_anterior"
          defaultValue={ initialData?.estado_anterior }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Estado Salida */}
        <InputX
          type="text"
          name="estado_salida"
          label="Estado Salida"
          placeholder="Ingrese estado salida"
          helperText="Campo estado_salida"
          defaultValue={ initialData?.estado_salida }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Estado Retorno */}
        <InputX
          type="text"
          name="estado_retorno"
          label="Estado Retorno"
          placeholder="Ingrese estado retorno"
          helperText="Campo estado_retorno"
          defaultValue={ initialData?.estado_retorno }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Observacion */}
        <InputX
          type="text"
          name="observacion"
          label="Observacion"
          placeholder="Ingrese observacion"
          helperText="Campo observacion"
          defaultValue={ initialData?.observacion }
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