/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react';
import { FormX, InputX, SelectX, InputFileX, DynamicFieldsX } from '../../../lib/uiX';
import type { FormXRef, FormSubmitResult, FieldDefinition } from '../../../lib/uiX';
import type { Usuarios } from '../usuarios.types';
import './UsuariosForm.css';
import { checkEmailAvaibility, checkUserNameAvaibility } from '../usuarios.service';

interface UsuariosFormProps {
  initialData?: Usuarios | null;
  onSubmit: (data: { nombre: string; apellido: string; username: string; email: string; password_hash: string; avatar_url: string; ultimo_acceso: any; intentos_fallidos: number; bloqueado_hasta: any; debe_cambiar_password: boolean; fecha_ultimo_cambio_password: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}



export function UsuariosForm({ initialData, onSubmit, onCancel, loading }: UsuariosFormProps) {
  const formRef = useRef<FormXRef>(null);
  const isEdit = !!initialData;
  const [showError, setShowError] = useState(false);


  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);


  const handleUsernameBlur = async (value: string) => {

   
    // Solo verificar si hay valor y tiene longitud mínima
    if (!value || value.length < 3) {
      setUsernameError(null);
      return;
    }

    // Si estamos editando y el username no cambió, no verificar
    if (isEdit && value === initialData?.username) {
      setUsernameError(null);
      return;
    }

    setUsernameChecking(true);
    setUsernameError(null);

    try {
      
      const isAvailable = await checkUserNameAvaibility(value);
    
      
      if (isAvailable) {
        setUsernameError('Este nombre de usuario ya está en uso');
      }
    } catch (error) {
      console.error('Error verificando username:', error);
      setUsernameError('Error al verificar disponibilidad');
    } finally {
      setUsernameChecking(false);
    }
  };

  // 🆕 Handler para verificar email
  const handleEmailBlur = async (value: string) => {
    // Solo verificar si el email es válido básicamente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      setEmailError(null);
      return;
    }

    // Si estamos editando y el email no cambió, no verificar
    if (isEdit && value === initialData?.email) {
      setEmailError(null);
      return;
    }

    setEmailChecking(true);
    setEmailError(null);

    try {
      const isAvailable = await checkEmailAvaibility(value);
      
      if (isAvailable) {
        setEmailError('Este email ya está registrado');
      }
    } catch (error) {
      console.error('Error verificando email:', error);
      setEmailError('Error al verificar disponibilidad');
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = (result: FormSubmitResult) => {
    // Verificar errores asíncronos antes de continuar
    if (usernameError || emailError) {
      setShowError(true);
      return;
    }

    if (!result.general_validation) {
      setShowError(true);
      return;
    }

    setShowError(false);
    onSubmit({
      nombre: result.body.nombre,
      apellido: result.body.apellido,
      username: result.body.username,
      email: result.body.email,
      password_hash: result.body.password_hash,
      avatar_url: result.body.avatar_url,
      ultimo_acceso: result.body.ultimo_acceso,
      intentos_fallidos: result.body.intentos_fallidos,
      bloqueado_hasta: result.body.bloqueado_hasta,
      debe_cambiar_password: result.body.debe_cambiar_password,
      fecha_ultimo_cambio_password: result.body.fecha_ultimo_cambio_password,
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
              { type: 'required', message: 'Este campo es requerido' },
              { type: 'maxLength', value: 255, message: 'Máximo 255 caracteres' },
              {
                type: 'custom',
                value: (val) => {
                  // Solo letras y espacios
                  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                    return 'Solo se permiten letras y espacios';
                  }
                  return true;
                },
              },
            ],
          }}
        />

        {/* InputX - Apellido */}
        <InputX
          type="text"
          name="apellido"
          label="Apellido"
          placeholder="Ingrese apellido"
          helperText="Campo apellido"
          defaultValue={initialData?.apellido}
          rules={{
            validations: [
              { type: 'required', message: 'Este campo es requerido' },
              { type: 'maxLength', value: 255, message: 'Máximo 255 caracteres' },
              {
                type: 'custom',
                value: (val) => {
                  // Solo letras y espacios
                  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                    return 'Solo se permiten letras y espacios';
                  }
                  return true;
                },
              },
            ],
          }}
        />

        {/* InputX - Username */}
        <div style={{ position: 'relative' }}>
          <InputX
            type="text"
            name="username"
            label="Username"
            placeholder="Ingrese username"
            helperText={
              usernameChecking
                ? 'Verificando disponibilidad...'
                : 'Campo username (debe ser único)'
            }
            defaultValue={initialData?.username}
            onBlur={(value) => handleUsernameBlur(value)}
            rules={{
              validations: [
                { type: 'required', message: 'Este campo es requerido' },
                { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres' },
                { type: 'maxLength', value: 255, message: 'Máximo 255 caracteres' },
                {
                  type: 'custom',
                  value: (val) => {
                    // Solo letras, números y guiones bajos
                    if (!/^[a-zA-Z0-9_]*$/.test(val)) {
                      return 'Solo letras, números y guión bajo';
                    }
                    return true;
                  },
                },
                {
                  type: 'custom',
                  value: (val) => {
                    // No puede empezar con número
                    if (/^[0-9]/.test(val)) {
                      return 'No puede empezar con un número';
                    }
                    return true;
                  },
                },
                {
                  type: 'custom',
                  value: (val) => {
                    // Palabras reservadas
                    const reserved = ['admin', 'root', 'system', 'user', 'guest'];
                    if (reserved.includes(val.toLowerCase())) {
                      return 'Este nombre de usuario está reservado';
                    }
                    return true;
                  },
                },
              ],
            }}
          />
          {/* 🆕 Error asíncrono de username */}
          {usernameError && (
            <div className="inputx-error" role="alert" style={{ marginTop: '4px' }}>
              <svg
                className="inputx-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{usernameError}</span>
            </div>
          )}
        </div>

        {/* InputX - Email */}
        <div style={{ position: 'relative' }}>
          <InputX
            type="email"
            name="email"
            label="Email"
            placeholder="Ingrese email"
            helperText={
              emailChecking
                ? 'Verificando disponibilidad...'
                : 'Campo email (debe ser único)'
            }
            defaultValue={initialData?.email}
            onBlur={(value) => handleEmailBlur(value)}
            rules={{
              validations: [
                { type: 'required', message: 'Este campo es requerido' },
                { type: 'email', message: 'Email inválido' },
                { type: 'maxLength', value: 255, message: 'Máximo 255 caracteres' },
                {
                  type: 'custom',
                  value: (val) => {
                    // No permitir emails temporales
                    const tempDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com'];
                    const domain = val.split('@')[1];
                    if (domain && tempDomains.includes(domain.toLowerCase())) {
                      return 'No se permiten emails temporales';
                    }
                    return true;
                  },
                },
              ],
            }}
          />
          {/* 🆕 Error asíncrono de email */}
          {emailError && (
            <div className="inputx-error" role="alert" style={{ marginTop: '4px' }}>
              <svg
                className="inputx-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{emailError}</span>
            </div>
          )}
        </div>
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
          disabled={loading || usernameChecking || emailChecking}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          data-submitx
          disabled={loading || usernameChecking || emailChecking || !!usernameError || !!emailError}
          className="btn btn-primary"
        >
          {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </FormX>
  );
}