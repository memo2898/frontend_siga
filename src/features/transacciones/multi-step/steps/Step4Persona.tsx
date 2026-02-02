import { useState, useEffect } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { InputX, SelectX } from '../../../../lib/uiX';
import { MOTIVOS_DESCARGO, type PersonaTransaccion } from '../types';
import './Steps.css';
import { getByDocumento, existsByDocumento } from '../../../personas/personas.service';
import { getAll as tipodoc_getall } from '../../../tiposdocumentos/tiposdocumentos.service';
import { getAll as direcciones_getAll } from '../../../direcciones/direcciones.service';
import { getByDireccion } from '../../../departamentos/departamentos.service';

export function Step4Persona() {
  const { state, dispatch, requiresFechaDevolucion, requiresMotivoDescargo } = useTransaccionWizardContext();

  // Estados para el formulario
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [tipoDocumentoId, setTipoDocumentoId] = useState<number | null>(null);
  const [numeroDocumento, setNumeroDocumento] = useState('');
  
  // Determinar si es persona jurídica basado en el tipo de documento
  const [isPersonaJuridica, setIsPersonaJuridica] = useState(false);
  
  // **NUEVO: Estados para empleado**
  const [clasificacion, setClasificacion] = useState<'EMPLEADO' | 'VISITANTE' | 'CONTRATISTA' | null>(null);
  const [codigoEmpleado, setCodigoEmpleado] = useState('');
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [direccionId, setDireccionId] = useState<number | null>(null);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  
  // Datos para persona física
  const [formDataFisica, setFormDataFisica] = useState({
    nombre: '',
    apellido: '',
    cargo: '',
    telefono: '',
    correo: '',
  });
  
  // Datos para persona jurídica
  const [formDataJuridica, setFormDataJuridica] = useState({
    razon_social: '',
    nombre_comercial: '',
    telefono: '',
    correo: '',
  });
  
  // Estados de UI
  const [buscando, setBuscando] = useState(false);
  const [personaEncontrada, setPersonaEncontrada] = useState(false);
  const [mensajeBusqueda, setMensajeBusqueda] = useState('');

  const isEntrada = state.tipoTransaccion === 'ENTRADA';

  // **NUEVO: Determinar si es empleado**
  const isEmpleado = clasificacion === 'EMPLEADO';

  // Cargar tipos de documento al montar
  useEffect(() => {
    const loadTiposDocumento = async () => {
      try {
        const tipos = await tipodoc_getall();
        setTiposDocumento(tipos);
      } catch (error) {
        console.error('Error cargando tipos de documento:', error);
      }
    };
    loadTiposDocumento();
  }, []);

  // **NUEVO: Cargar direcciones al montar (solo si no es persona jurídica)**
  useEffect(() => {
    if (!isPersonaJuridica) {
      const loadDirecciones = async () => {
        try {
          const dirs = await direcciones_getAll();
          setDirecciones(dirs);
        } catch (error) {
          console.error('Error cargando direcciones:', error);
        }
      };
      loadDirecciones();
    }
  }, [isPersonaJuridica]);

  // **NUEVO: Cargar departamentos cuando cambia la dirección**
  useEffect(() => {
    const loadDepartamentos = async () => {
      if (!direccionId) {
        setDepartamentos([]);
        setDepartamentoId(null);
        return;
      }

      try {
        const depts = await getByDireccion(direccionId);
        setDepartamentos(depts);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
        setDepartamentos([]);
      }
    };

    loadDepartamentos();
  }, [direccionId]);

  // Detectar si el tipo de documento es RNC (persona jurídica)
  useEffect(() => {
    if (tipoDocumentoId && tiposDocumento.length > 0) {
      const tipoSeleccionado = tiposDocumento.find(t => t.id === tipoDocumentoId);
      // Verificar si el código o nombre del tipo es RNC
      const esRNC = tipoSeleccionado?.codigo === 'RNC' || 
                    tipoSeleccionado?.nombre?.toUpperCase().includes('RNC');
      setIsPersonaJuridica(esRNC);
      
      // Limpiar formularios al cambiar tipo
      setFormDataFisica({
        nombre: '',
        apellido: '',
        cargo: '',
        telefono: '',
        correo: '',
      });
      setFormDataJuridica({
        razon_social: '',
        nombre_comercial: '',
        telefono: '',
        correo: '',
      });
      
      // **NUEVO: Limpiar campos de empleado si cambia a jurídica**
      if (esRNC) {
        setClasificacion(null);
        setCodigoEmpleado('');
        setDireccionId(null);
        setDepartamentoId(null);
      }
      
      setPersonaEncontrada(false);
      setMensajeBusqueda('');
    }
  }, [tipoDocumentoId, tiposDocumento]);

  // Buscar persona automáticamente cuando cambian tipo_doc y numero_doc
  useEffect(() => {
    const buscarPersona = async () => {
      // Validar que tengamos tipo de documento y al menos 3 caracteres
      if (!tipoDocumentoId || numeroDocumento.length < 3) {
        setPersonaEncontrada(false);
        setMensajeBusqueda('');
        return;
      }

      setBuscando(true);
      setMensajeBusqueda('Buscando...');

      try {
        // Verificar si existe
        const { exists } = await existsByDocumento(tipoDocumentoId, numeroDocumento);

        if (exists) {
          // Traer los datos completos
          const persona = await getByDocumento(tipoDocumentoId, numeroDocumento);
          
          // Autocompletar el formulario según el tipo
          if (isPersonaJuridica) {
            setFormDataJuridica({
              razon_social: persona.razon_social || '',
              nombre_comercial: persona.nombre_comercial || '',
              telefono: persona.telefono || '',
              correo: persona.correo || '',
            });
          } else {
            setFormDataFisica({
              nombre: persona.nombre || '',
              apellido: persona.apellido || '',
              cargo: persona.cargo || '',
              telefono: persona.telefono || '',
              correo: persona.correo || '',
            });
            
            // **NUEVO: Autocompletar datos de empleado**
            setClasificacion(persona.clasificacion || null);
            setCodigoEmpleado(persona.codigo_empleado || '');
            
            if (persona.departamento_id && persona.departamento?.direccion_id) {
              setDireccionId(persona.departamento.direccion_id);
              setDepartamentoId(persona.departamento_id);
            }
          }

          setPersonaEncontrada(true);
          setMensajeBusqueda('✓ Persona encontrada en el sistema');

          // Actualizar el estado global con la persona existente
          dispatch({
            type: 'SET_PERSONA',
            payload: {
              ...persona,
              isNew: false,
            } as PersonaTransaccion,
          });
        } else {
          // No existe, limpiar el formulario para nueva persona
          if (isPersonaJuridica) {
            setFormDataJuridica({
              razon_social: '',
              nombre_comercial: '',
              telefono: '',
              correo: '',
            });
          } else {
            setFormDataFisica({
              nombre: '',
              apellido: '',
              cargo: '',
              telefono: '',
              correo: '',
            });
            
            // **NUEVO: Limpiar campos de empleado**
            setClasificacion(null);
            setCodigoEmpleado('');
            setDireccionId(null);
            setDepartamentoId(null);
          }
          
          setPersonaEncontrada(false);
          setMensajeBusqueda(
            isPersonaJuridica 
              ? 'Nueva empresa - Complete los datos' 
              : 'Nueva persona - Complete los datos'
          );

          // Limpiar el estado global
          dispatch({ type: 'SET_PERSONA', payload: null });
        }
      } catch (error) {
        console.error('Error buscando persona:', error);
        setMensajeBusqueda('');
        setPersonaEncontrada(false);
      } finally {
        setBuscando(false);
      }
    };

    // Debounce de 500ms
    const timer = setTimeout(buscarPersona, 500);
    return () => clearTimeout(timer);
  }, [tipoDocumentoId, numeroDocumento, isPersonaJuridica, dispatch]);

  // Actualizar estado global cuando cambian los datos del formulario
  useEffect(() => {
    if (!tipoDocumentoId || !numeroDocumento) return;

    let personaData: Partial<PersonaTransaccion> = {
      tipo_documento_id: tipoDocumentoId,
      numero_documento: numeroDocumento,
      isNew: !personaEncontrada,
    };

    if (isPersonaJuridica) {
      // Validar que tenga al menos razón social
      if (!formDataJuridica.razon_social) return;
      
      personaData = {
        ...personaData,
        tipo_persona: 'JURIDICA' as const,
        clasificacion: 'PROVEEDOR' as const, // Las jurídicas típicamente son proveedores
        razon_social: formDataJuridica.razon_social,
        nombre_comercial: formDataJuridica.nombre_comercial,
        telefono: formDataJuridica.telefono,
        correo: formDataJuridica.correo,
        // Para compatibilidad con PersonaTransaccion, usar nombre_comercial como nombre
        nombre: formDataJuridica.nombre_comercial || formDataJuridica.razon_social,
      };
    } else {
      // Validar que tenga al menos nombre
      if (!formDataFisica.nombre) return;
      
      // **NUEVO: Validar campos de empleado si es empleado**
      if (isEmpleado && (!departamentoId || !codigoEmpleado)) return;
      
      personaData = {
        ...personaData,
        tipo_persona: 'FISICA' as const,
        clasificacion: clasificacion || 'VISITANTE' as const,
        nombre: formDataFisica.nombre,
        apellido: formDataFisica.apellido,
        cargo: formDataFisica.cargo,
        telefono: formDataFisica.telefono,
        correo: formDataFisica.correo,
        // **NUEVO: Agregar campos de empleado**
        ...(isEmpleado && {
          codigo_empleado: codigoEmpleado,
          departamento_id: departamentoId,
        }),
      };
    }

    dispatch({
      type: 'SET_PERSONA',
      payload: personaData as PersonaTransaccion,
    });
  }, [
    formDataFisica, 
    formDataJuridica, 
    tipoDocumentoId, 
    numeroDocumento, 
    personaEncontrada, 
    isPersonaJuridica,
    clasificacion,
    codigoEmpleado,
    departamentoId,
    isEmpleado,
    dispatch
  ]);

  // Manejar cambios en formulario físico
  const handleFormFisicaChange = (field: keyof typeof formDataFisica, value: string) => {
    setFormDataFisica((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar cambios en formulario jurídico
  const handleFormJuridicaChange = (field: keyof typeof formDataJuridica, value: string) => {
    setFormDataJuridica((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Cambiar fecha de devolución
  const handleFechaDevolucionChange = (value: string) => {
    dispatch({ type: 'SET_FECHA_DEVOLUCION', payload: value });
  };

  // Cambiar motivo de descargo
  const handleMotivoDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: value as any,
        comentario: state.comentarioDescargo,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  // Cambiar comentario de descargo
  const handleComentarioDescargoChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: value,
        documento: state.documentoAprobacionDescargo,
      },
    });
  };

  // Cambiar documento de aprobación
  const handleDocumentoAprobacionChange = (value: string) => {
    dispatch({
      type: 'SET_MOTIVO_DESCARGO',
      payload: {
        motivo: state.motivoDescargo!,
        comentario: state.comentarioDescargo,
        documento: value,
      },
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">
          {isEntrada ? 'Datos del Solicitante' : 'Datos del Receptor'}
        </h2>
        <p className="step-description">
          {isEntrada
            ? 'Identifique quien entrega o devuelve el activo'
            : 'Identifique a quien se entrega el activo'}
        </p>
      </div>

      {/* Formulario de Persona - Siempre visible */}
      <div className="step-section">
        <div className="step-form">
          {/* Tipo de Documento y Número de Documento */}
          <div className="step-form-row">
            <div className="step-form-group">
              <SelectX
                name="tipo_documento_id"
                label="Tipo de Documento"
                placeholder="Seleccione tipo..."
                options={tiposDocumento.map((tipo) => ({
                  value: tipo.id.toString(),
                  label: tipo.nombre,
                }))}
                value={tipoDocumentoId?.toString()}
                onChange={(value) => setTipoDocumentoId(Number(value))}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido' }],
                }}
              />
            </div>
            <div className="step-form-group">
              <InputX
                name="numero_documento"
                label="Número de Documento"
                placeholder={isPersonaJuridica ? 'Ej: 130123456' : 'Ej: 001-2345678-9'}
                defaultValue={numeroDocumento}
                onChange={(value) => setNumeroDocumento(value as string)}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido' }],
                }}
              />
            </div>
          </div>

          {/* Mensaje de búsqueda */}
          {mensajeBusqueda && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                backgroundColor: personaEncontrada ? '#dcfce7' : buscando ? '#fef3c7' : '#e0f2fe',
                color: personaEncontrada ? '#166534' : buscando ? '#92400e' : '#0c4a6e',
                border: `1px solid ${personaEncontrada ? '#86efac' : buscando ? '#fcd34d' : '#7dd3fc'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {buscando && (
                <svg
                  className="animate-spin"
                  style={{ width: '1rem', height: '1rem' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span style={{ fontWeight: 500 }}>{mensajeBusqueda}</span>
            </div>
          )}

          {/* Campos para PERSONA JURÍDICA (RNC) */}
          {isPersonaJuridica && (
            <>
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="razon_social"
                    label="Razón Social"
                    placeholder="Nombre legal de la empresa"
                    defaultValue={formDataJuridica.razon_social}
                    onChange={(value) => handleFormJuridicaChange('razon_social', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="nombre_comercial"
                    label="Nombre Comercial"
                    placeholder="Nombre comercial de la empresa"
                    defaultValue={formDataJuridica.nombre_comercial}
                    onChange={(value) => handleFormJuridicaChange('nombre_comercial', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="telefono"
                    label="Teléfono"
                    placeholder="809-000-0000"
                    defaultValue={formDataJuridica.telefono}
                    onChange={(value) => handleFormJuridicaChange('telefono', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="correo"
                    label="Correo Electrónico"
                    placeholder="correo@empresa.com"
                    defaultValue={formDataJuridica.correo}
                    onChange={(value) => handleFormJuridicaChange('correo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [
                        { type: 'required', message: 'Requerido' },
                        { type: 'email', message: 'Email inválido' }
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Campos para PERSONA FÍSICA (Cédula, Pasaporte, etc.) */}
          {!isPersonaJuridica && (
            <>
              {/* **NUEVO: Clasificación de persona** */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <SelectX
                    name="clasificacion"
                    label="Clasificación"
                    placeholder="Seleccione clasificación..."
                    options={[
                      { value: 'EMPLEADO', label: 'Empleado Interno' },
                      { value: 'CONTRATISTA', label: 'Contratista' },
                      { value: 'VISITANTE', label: 'Visitante' },
                    ]}
                    value={clasificacion || undefined}
                    onChange={(value) => {
                      setClasificacion(value as any);
                      // Si deja de ser empleado, limpiar campos relacionados
                      if (value !== 'EMPLEADO') {
                        setCodigoEmpleado('');
                        setDireccionId(null);
                        setDepartamentoId(null);
                      }
                    }}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              {/* Campos básicos de persona física */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="nombre"
                    label="Nombre"
                    placeholder="Primer y segundo nombre"
                    defaultValue={formDataFisica.nombre}
                    onChange={(value) => handleFormFisicaChange('nombre', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="apellido"
                    label="Apellido"
                    placeholder="Apellidos"
                    defaultValue={formDataFisica.apellido}
                    onChange={(value) => handleFormFisicaChange('apellido', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              {/* **NUEVO: Campos adicionales si es EMPLEADO** */}
              {isEmpleado && (
                <>
                  <div className="step-form-row">
                    <div className="step-form-group">
                      <InputX
                        name="codigo_empleado"
                        label="Código de Empleado"
                        placeholder="Ej: EMP-2024-001"
                        defaultValue={codigoEmpleado}
                        onChange={(value) => setCodigoEmpleado(value as string)}
                        disabled={personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                  </div>

                  <div className="step-form-row">
                    <div className="step-form-group">
                      <SelectX
                        name="direccion_id"
                        label="Dirección"
                        placeholder="Seleccione dirección..."
                        options={direcciones.map((dir) => ({
                          value: dir.id.toString(),
                          label: dir.nombre,
                        }))}
                        value={direccionId?.toString()}
                        onChange={(value) => {
                          setDireccionId(Number(value));
                          setDepartamentoId(null); // Reset departamento al cambiar dirección
                        }}
                        disabled={personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                    <div className="step-form-group">
                      <SelectX
                        name="departamento_id"
                        label="Departamento"
                        placeholder={direccionId ? "Seleccione departamento..." : "Primero seleccione dirección"}
                        options={departamentos.map((dept) => ({
                          value: dept.id.toString(),
                          label: dept.nombre,
                        }))}
                        value={departamentoId?.toString()}
                        onChange={(value) => setDepartamentoId(Number(value))}
                        disabled={!direccionId || personaEncontrada}
                        rules={{
                          validations: [{ type: 'required', message: 'Requerido para empleados' }],
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campos comunes */}
              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="cargo"
                    label="Cargo"
                    placeholder="Cargo en la institución"
                    defaultValue={formDataFisica.cargo}
                    onChange={(value) => handleFormFisicaChange('cargo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
                <div className="step-form-group">
                  <InputX
                    name="telefono"
                    label="Teléfono"
                    placeholder="809-000-0000"
                    defaultValue={formDataFisica.telefono}
                    onChange={(value) => handleFormFisicaChange('telefono', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [{ type: 'required', message: 'Requerido' }],
                    }}
                  />
                </div>
              </div>

              <div className="step-form-row">
                <div className="step-form-group">
                  <InputX
                    name="correo"
                    label="Correo Electrónico"
                    placeholder="correo@ejemplo.com"
                    defaultValue={formDataFisica.correo}
                    onChange={(value) => handleFormFisicaChange('correo', value as string)}
                    disabled={personaEncontrada}
                    rules={{
                      validations: [
                        { type: 'required', message: 'Requerido' },
                        { type: 'email', message: 'Email inválido' }
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Campos adicionales según tipo de salida */}
      {state.persona && (
        <>
          {/* Fecha de devolución para préstamos */}
          {requiresFechaDevolucion() && (
            <div className="step-section">
              <label className="step-label">Fecha de Devolución Esperada</label>
              <InputX
                name="fechaDevolucion"
                type="date"
                defaultValue={state.fechaDevolucionEsperada}
                onChange={(value) => handleFechaDevolucionChange(value as string)}
                rules={{
                  validations: [{ type: 'required', message: 'Requerido para préstamos' }],
                }}
              />
            </div>
          )}

          {/* Campos para descargo */}
          {requiresMotivoDescargo() && (
            <>
              <div className="step-section">
                <SelectX
                  name="motivoDescargo"
                  label="Motivo del Descargo"
                  placeholder="Seleccione un motivo..."
                  options={MOTIVOS_DESCARGO.map((m) => ({ value: m.value, label: m.label }))}
                  value={state.motivoDescargo}
                  onChange={(value) => handleMotivoDescargoChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="comentarioDescargo"
                  label="Detalles del Descargo"
                  placeholder="Describa los detalles..."
                  defaultValue={state.comentarioDescargo}
                  onChange={(value) => handleComentarioDescargoChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
              <div className="step-section">
                <InputX
                  name="documentoAprobacion"
                  label="Documento de Aprobación"
                  placeholder="Ej: RES-2026-003"
                  defaultValue={state.documentoAprobacionDescargo}
                  onChange={(value) => handleDocumentoAprobacionChange(value as string)}
                  rules={{
                    validations: [{ type: 'required', message: 'Requerido' }],
                  }}
                />
              </div>
            </>
          )}

          {/* Observaciones generales */}
          <div className="step-section">
            <InputX
              name="observaciones"
              label="Observaciones Adicionales"
              placeholder="Observaciones sobre la transacción..."
              defaultValue={state.observaciones}
              onChange={(value) => dispatch({ type: 'SET_OBSERVACIONES', payload: value as string })}
              rules={{
                validations: [{ type: 'required', message: 'Requerido' }],
              }}
            />
          </div>
        </>
      )}

      {/* Errores */}
      {state.errors['step_3'] && state.errors['step_3'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_3'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}