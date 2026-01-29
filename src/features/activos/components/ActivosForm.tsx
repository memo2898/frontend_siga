import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Activos } from '../activos.types';
import './ActivosForm.css';

interface ActivosFormProps {
  initialData?: Activos | null;
  onSubmit: (data: { codigo_inventario_local: string; codigo_inventario_control_bienes: string; marca: string; modelo: string; categoria_id: number; almacen_id: number; estado_activo: string; cantidad: number; unidad_medida: string; atributos: any; fecha_ingreso: string; observaciones: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  categoriasOptions: Array<{ value: number; label: string }>;
  almacenesOptions: Array<{ value: number; label: string }>;
}

export function ActivosForm({ initialData, onSubmit, onCancel, loading, categoriasOptions, almacenesOptions }: ActivosFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);

  // Función para normalizar atributos a array
  const normalizeAtributos = (value: any): FieldDefinition[] => {
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
  const [atributosState, setAtributosState] = useState<FieldDefinition[]>(
    normalizeAtributos(initialData?.atributos)
  );

  const handleSubmit = (result: FormSubmitResult) => {
    if (!result.general_validation) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({
      codigo_inventario_local: result.body.codigo_inventario_local,
      codigo_inventario_control_bienes: result.body.codigo_inventario_control_bienes,
      marca: result.body.marca,
      modelo: result.body.modelo,
      categoria_id: result.body.categoria_id,
      almacen_id: result.body.almacen_id,
      estado_activo: result.body.estado_activo,
      cantidad: result.body.cantidad,
      unidad_medida: result.body.unidad_medida,
      atributos: result.body.atributos,
      fecha_ingreso: result.body.fecha_ingreso,
      observaciones: result.body.observaciones,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
        {/* InputX - Codigo Inventario Local */}
        <InputX
          type="text"
          name="codigo_inventario_local"
          label="Codigo Inventario Local"
          placeholder="Ingrese codigo inventario local"
          helperText="Código de inventario local único del activo"
          defaultValue={ initialData?.codigo_inventario_local }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Codigo Inventario Control Bienes */}
        <InputX
          type="text"
          name="codigo_inventario_control_bienes"
          label="Codigo Inventario Control Bienes"
          placeholder="Ingrese codigo inventario control bienes"
          helperText="Código de inventario de control de bienes único"
          defaultValue={ initialData?.codigo_inventario_control_bienes }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Marca */}
        <InputX
          type="text"
          name="marca"
          label="Marca"
          placeholder="Ingrese marca"
          helperText="Marca del activo"
          defaultValue={ initialData?.marca }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Modelo */}
        <InputX
          type="text"
          name="modelo"
          label="Modelo"
          placeholder="Ingrese modelo"
          helperText="Modelo del activo"
          defaultValue={ initialData?.modelo }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* SelectX - Categoria Id */}
        <SelectX
          name="categoria_id"
          label="Categoria Id"
          placeholder="Ingrese categoria id"
          helperText="ID de la categoría a la que pertenece el activo"
          options={ categoriasOptions }
          defaultValue={ initialData?.categoria_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* SelectX - Almacen Id */}
        <SelectX
          name="almacen_id"
          label="Almacen Id"
          placeholder="Ingrese almacen id"
          helperText="ID del almacén donde se encuentra el activo"
          options={ almacenesOptions }
          defaultValue={ initialData?.almacen_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Estado Activo */}
        <InputX
          type="text"
          name="estado_activo"
          label="Estado Activo"
          placeholder="Ingrese estado activo"
          helperText="Campo estado_activo"
          defaultValue={ initialData?.estado_activo }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Cantidad */}
        <InputX
          type="number"
          name="cantidad"
          label="Cantidad"
          placeholder="Ingrese cantidad"
          helperText="Cantidad del activo (1 para UNITARIO, >0 para CANTIDAD)"
          defaultValue={ initialData?.cantidad }
        />

        {/* InputX - Unidad Medida */}
        <InputX
          type="text"
          name="unidad_medida"
          label="Unidad Medida"
          placeholder="Ingrese unidad medida"
          helperText="Campo unidad_medida"
          defaultValue={ initialData?.unidad_medida }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Atributos */}
        <DynamicFieldsX
          name="atributos"
          label="Atributos"
          helperText="Atributos dinámicos del activo según su categoría"
          contract="follow"
          value={ atributosState }
          onChange={setAtributosState}
        />

        {/* InputX - Fecha Ingreso */}
        <InputX
          type="text"
          name="fecha_ingreso"
          label="Fecha Ingreso"
          placeholder="Ingrese fecha ingreso"
          helperText="Fecha de ingreso del activo al inventario (formato: YYYY-MM-DD)"
          defaultValue={ initialData?.fecha_ingreso }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Observaciones */}
        <InputX
          type="text"
          name="observaciones"
          label="Observaciones"
          placeholder="Ingrese observaciones"
          helperText="Observaciones adicionales sobre el activo"
          defaultValue={ initialData?.observaciones }
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