import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Transacciones } from '../transacciones.types';
import './TransaccionesForm.css';

interface TransaccionesFormProps {
  initialData?: Transacciones | null;
  onSubmit: (data: { codigo: string; modulo_id: number; persona_id: number; tipo: any; tipo_salida: any; fecha: string; usuario_id: number; rol_id: number; fecha_devolucion_esperada: string; fecha_devolucion_real: string; motivo_descargo: any; comentario_descargo: string; metadata: any; estado_transaccion: any; observaciones: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  // Opciones para selects de foreign keys
  modulosOptions: Array<{ value: number; label: string }>;
  personasOptions: Array<{ value: number; label: string }>;
  usuariosOptions: Array<{ value: number; label: string }>;
  rolesOptions: Array<{ value: number; label: string }>;
}

export function TransaccionesForm({ initialData, onSubmit, onCancel, loading, modulosOptions, personasOptions, usuariosOptions, rolesOptions }: TransaccionesFormProps) {
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

  // Función para normalizar tipo_salida a array
  const normalizeTipoSalida = (value: any): FieldDefinition[] => {
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
  const [tipo_salidaState, setTipoSalidaState] = useState<FieldDefinition[]>(
    normalizeTipoSalida(initialData?.tipo_salida)
  );

  // Función para normalizar motivo_descargo a array
  const normalizeMotivoDescargo = (value: any): FieldDefinition[] => {
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
  const [motivo_descargoState, setMotivoDescargoState] = useState<FieldDefinition[]>(
    normalizeMotivoDescargo(initialData?.motivo_descargo)
  );

  // Función para normalizar metadata a array
  const normalizeMetadata = (value: any): FieldDefinition[] => {
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
  const [metadataState, setMetadataState] = useState<FieldDefinition[]>(
    normalizeMetadata(initialData?.metadata)
  );

  // Función para normalizar estado_transaccion a array
  const normalizeEstadoTransaccion = (value: any): FieldDefinition[] => {
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
  const [estado_transaccionState, setEstadoTransaccionState] = useState<FieldDefinition[]>(
    normalizeEstadoTransaccion(initialData?.estado_transaccion)
  );

  const handleSubmit = (result: FormSubmitResult) => {
    if (!result.general_validation) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({
      codigo: result.body.codigo,
      modulo_id: result.body.modulo_id,
      persona_id: result.body.persona_id,
      tipo: result.body.tipo,
      tipo_salida: result.body.tipo_salida,
      fecha: result.body.fecha,
      usuario_id: result.body.usuario_id,
      rol_id: result.body.rol_id,
      fecha_devolucion_esperada: result.body.fecha_devolucion_esperada,
      fecha_devolucion_real: result.body.fecha_devolucion_real,
      motivo_descargo: result.body.motivo_descargo,
      comentario_descargo: result.body.comentario_descargo,
      metadata: result.body.metadata,
      estado_transaccion: result.body.estado_transaccion,
      observaciones: result.body.observaciones,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={ { display: 'flex', flexDirection: 'column', gap: 16 } }>
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

        {/* SelectX - Persona Id */}
        <SelectX
          name="persona_id"
          label="Persona Id"
          placeholder="Ingrese persona id"
          helperText="Campo persona_id"
          options={ personasOptions }
          defaultValue={ initialData?.persona_id }
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

        {/* DynamicFieldsX - Tipo Salida */}
        <DynamicFieldsX
          name="tipo_salida"
          label="Tipo Salida"
          helperText="Campo tipo_salida"
          contract="none"
          value={ tipo_salidaState }
          onChange={setTipoSalidaState}
        />

        {/* InputX - Fecha */}
        <InputX
          type="text"
          name="fecha"
          label="Fecha"
          placeholder="Ingrese fecha"
          helperText="Campo fecha"
          defaultValue={ initialData?.fecha }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* SelectX - Usuario Id */}
        <SelectX
          name="usuario_id"
          label="Usuario Id"
          placeholder="Ingrese usuario id"
          helperText="Campo usuario_id"
          options={ usuariosOptions }
          defaultValue={ initialData?.usuario_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* SelectX - Rol Id */}
        <SelectX
          name="rol_id"
          label="Rol Id"
          placeholder="Ingrese rol id"
          helperText="Campo rol_id"
          options={ rolesOptions }
          defaultValue={ initialData?.rol_id }
          rules={ {
            validations: [
              { type: 'positive', message: '' },
              { type: 'integer', message: '' },
            ],
          } }
        />

        {/* InputX - Fecha Devolucion Esperada */}
        <InputX
          type="text"
          name="fecha_devolucion_esperada"
          label="Fecha Devolucion Esperada"
          placeholder="Ingrese fecha devolucion esperada"
          helperText="Campo fecha_devolucion_esperada"
          defaultValue={ initialData?.fecha_devolucion_esperada }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* InputX - Fecha Devolucion Real */}
        <InputX
          type="text"
          name="fecha_devolucion_real"
          label="Fecha Devolucion Real"
          placeholder="Ingrese fecha devolucion real"
          helperText="Campo fecha_devolucion_real"
          defaultValue={ initialData?.fecha_devolucion_real }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Motivo Descargo */}
        <DynamicFieldsX
          name="motivo_descargo"
          label="Motivo Descargo"
          helperText="Campo motivo_descargo"
          contract="none"
          value={ motivo_descargoState }
          onChange={setMotivoDescargoState}
        />

        {/* InputX - Comentario Descargo */}
        <InputX
          type="text"
          name="comentario_descargo"
          label="Comentario Descargo"
          placeholder="Ingrese comentario descargo"
          helperText="Campo comentario_descargo"
          defaultValue={ initialData?.comentario_descargo }
          rules={ {
            validations: [
              { type: 'maxLength', value: 255, message: '' },
            ],
          } }
        />

        {/* DynamicFieldsX - Metadata */}
        <DynamicFieldsX
          name="metadata"
          label="Metadata"
          helperText="Campo metadata"
          contract="none"
          value={ metadataState }
          onChange={setMetadataState}
        />

        {/* DynamicFieldsX - Estado Transaccion */}
        <DynamicFieldsX
          name="estado_transaccion"
          label="Estado Transaccion"
          helperText="Campo estado_transaccion"
          contract="none"
          value={ estado_transaccionState }
          onChange={setEstadoTransaccionState}
        />

        {/* InputX - Observaciones */}
        <InputX
          type="text"
          name="observaciones"
          label="Observaciones"
          placeholder="Ingrese observaciones"
          helperText="Campo observaciones"
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