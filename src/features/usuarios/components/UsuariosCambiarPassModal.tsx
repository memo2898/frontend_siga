import { useState } from 'react';
import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { Usuarios } from '../usuarios.types';

interface UsuariosCambiarPassProps {
  isOpen: boolean;
  usuarios: Usuarios | null;
  loading?: boolean;
  onConfirm: (nuevaPassword: string) => void;
  onCancel: () => void;
}

export function UsuariosCambiarPass({ 
  isOpen, 
  usuarios, 
  loading, 
  onConfirm, 
  onCancel 
}: UsuariosCambiarPassProps) {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  if (!usuarios) return null;

  const handleSubmit = () => {
    // Validaciones
    if (!nuevaPassword || !confirmarPassword) {
      setError('Ambos campos son requeridos');
      return;
    }

    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    onConfirm(nuevaPassword);
  };

  const handleClose = () => {
    setNuevaPassword('');
    setConfirmarPassword('');
    setError('');
    setMostrarPassword(false);
    onCancel();
  };

  return (
    <ModalX
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Contraseña"
      size="sm"
      footer={
        <>
          <button onClick={handleClose} disabled={loading} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </>
      }
    >
      <div style={{ marginBottom: 20 }}>
        <p style={{ marginBottom: 12, color: '#374151' }}>
          Cambiar contraseña para:
        </p>
        <div style={{
          padding: 12,
          backgroundColor: '#eff6ff',
          borderRadius: 8,
          border: '1px solid #bfdbfe',
        }}>
          <strong>{usuarios.nombre} {usuarios.apellido}</strong>
          <br />
          <span style={{ color: '#6b7280', fontSize: 14 }}>
            @{usuarios.username}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
          Nueva Contraseña <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type={mostrarPassword ? 'text' : 'password'}
          value={nuevaPassword}
          onChange={(e) => {
            setNuevaPassword(e.target.value);
            setError('');
          }}
          placeholder="Ingrese la nueva contraseña"
          disabled={loading}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
          Confirmar Contraseña <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type={mostrarPassword ? 'text' : 'password'}
          value={confirmarPassword}
          onChange={(e) => {
            setConfirmarPassword(e.target.value);
            setError('');
          }}
          placeholder="Confirme la nueva contraseña"
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSubmit();
            }
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14 }}>
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={(e) => setMostrarPassword(e.target.checked)}
            disabled={loading}
            style={{ marginRight: 8 }}
          />
          Mostrar contraseñas
        </label>
      </div>

      {error && (
        <div style={{
          padding: 12,
          backgroundColor: '#fef2f2',
          borderRadius: 6,
          border: '1px solid #fecaca',
          marginBottom: 16,
        }}>
          <p style={{ margin: 0, color: '#ef4444', fontSize: 14 }}>
            {error}
          </p>
        </div>
      )}

      <p style={{ margin: 0, color: '#6b7280', fontSize: 12, fontStyle: 'italic' }}>
        La contraseña debe tener al menos 6 caracteres.
      </p>
    </ModalX>
  );
}