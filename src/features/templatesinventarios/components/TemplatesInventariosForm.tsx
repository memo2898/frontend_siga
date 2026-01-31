import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { TemplatesInventarios } from '../templatesinventarios.types';
import './TemplatesInventariosForm.css';

interface TemplatesInventariosFormProps {
  initialData?: TemplatesInventarios | null;
  onSubmit: (data: { nombre: string; descripcion: string; tipo: string; tipo_entrada: string; tipo_salida: string; is_default: boolean; contenido_hbs: string; variables_utilizadas: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TemplatesInventariosForm({ initialData, onSubmit, onCancel, loading }: TemplatesInventariosFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);
  
  // Estado para controlar qué tipo está seleccionado
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>(initialData?.tipo || '');

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
      tipo_entrada: result.body.tipo_entrada,
      tipo_salida: result.body.tipo_salida,
      is_default: result.body.is_default,
      contenido_hbs: result.body.contenido_hbs,
      variables_utilizadas: result.body.variables_utilizadas,
    });
  };

  return (
    <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* InputX - Nombre */}
        <InputX
          type="text"
          name="nombre"
          label="Nombre"
          placeholder="Ingrese nombre"
          helperText="Campo nombre"
          defaultValue={initialData?.nombre}
          rules={{
            validations: [
              { type: 'maxLength', value: 255, message: '' },
               { type: "required", message: "El correo es obligatorio" },
            ],
          }}
        />

        {/* InputX - Descripcion */}
        <InputX
          type="text"
          name="descripcion"
          label="Descripcion"
          placeholder="Ingrese descripcion"
          helperText="Campo descripcion"
          defaultValue={initialData?.descripcion}
           rules={{
            validations: [
              
               { type: "required", message: "El correo es obligatorio" },
            ],
          }}
        />

        {/* SelectX - Tipo */}
        <SelectX
          name="tipo"
          label="Tipo"
          placeholder="Ingrese tipo"
          helperText="Campo tipo"
          options={[
            {
              "value": "ENTRADA",
              "label": "Entrada"
            },
            {
              "value": "SALIDA",
              "label": "Salida"
            }
          ]}
          defaultValue={initialData?.tipo}
          onChange={(value) => setTipoSeleccionado(value as string)}
          rules={{
              validations: [
                { type: "required", message: "El correo es obligatorio" },
              ],
              
            }}
        />

        {/* SelectX - Tipo Entrada (solo si tipo es ENTRADA) */}
        {tipoSeleccionado === 'ENTRADA' && (
          <SelectX
            name="tipo_entrada"
            label="Tipo Entrada"
            placeholder="Ingrese tipo entrada"
            helperText="Campo tipo_entrada"
            options={[
              {
                "value": "INGRESO_CONTROL_BIENES",
                "label": "Ingreso desde Control de Bienes"
              },
              {
                "value": "ADQUISICION_DIRECTA",
                "label": "Adquisición Directa"
              },
              {
                "value": "TRANSFERENCIA_INTERNA",
                "label": "Transferencia Interna"
              },
              {
                "value": "DEVOLUCION_ASIGNACION",
                "label": "Devolución de Asignación"
              },
              {
                "value": "DEVOLUCION_PRESTAMO",
                "label": "Devolución de Préstamo"
              },
              {
                "value": "AJUSTE_INVENTARIO",
                "label": "Ajuste de Inventario"
              },
              {
                "value": "OTRO",
                "label": "Otro"
              }
            ]}
            defaultValue={initialData?.tipo_entrada}
            rules={{
            validations: [
              
               { type: "required", message: "El correo es obligatorio" },
            ],
          }}
          />
        )}

        {/* SelectX - Tipo Salida (solo si tipo es SALIDA) */}
        {tipoSeleccionado === 'SALIDA' && (
          <SelectX
            name="tipo_salida"
            label="Tipo Salida"
            placeholder="Ingrese tipo salida"
            helperText="Campo tipo_salida"
            options={[
              {
                "value": "ASIGNACION",
                "label": "Asignación"
              },
              {
                "value": "PRESTAMO",
                "label": "Préstamo"
              },
              {
                "value": "DESCARGO",
                "label": "Descargo"
              },
              {
                "value": "TRANSFERENCIA_EXTERNA",
                "label": "Transferencia Externa"
              },
              {
                "value": "DEVOLUCION_PROVEEDOR",
                "label": "Devolución a Proveedor"
              }
            ]}
             rules={{
            validations: [
              
               { type: "required", message: "El correo es obligatorio" },
            ],
          }}
            defaultValue={initialData?.tipo_salida}
          />
        )}

        {/* SelectX - Is Default */}
        <SelectX
          name="is_default"
          label="Is Default"
          placeholder="Ingrese is default"
          helperText="Campo is_default"
          options={[
            {
              "value": true,
              "label": "Sí"
            },
            {
              "value": false,
              "label": "No"
            }
          ]}
          defaultValue={initialData?.is_default}
          rules={{
            validations: [
              
               { type: "required", message: "El correo es obligatorio" },
            ],
          }}
        />

        {/* InputX - Contenido Hbs */}
        {/* <InputX
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
        /> */}

        {/* DynamicFieldsX - Variables Utilizadas */}
        {/* <DynamicFieldsX
          name="variables_utilizadas"
          label="Variables Utilizadas"
          helperText="Campo variables_utilizadas"
          contract="none"
          value={variables_utilizadasState}
          onChange={setVariablesUtilizadasState}
        /> */}

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