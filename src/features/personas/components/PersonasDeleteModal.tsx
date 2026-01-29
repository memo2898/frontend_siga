import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { Personas } from '../personas.types';

interface PersonasDeleteModalProps {
  isOpen: boolean;
  personas: Personas | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PersonasDeleteModal({ isOpen, personas, loading, onConfirm, onCancel }: PersonasDeleteModalProps) {
  if (!personas) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar Personas"
      size="sm"
      footer={
        <>
          <button onClick={onCancel} disabled={loading} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger">
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </>
      }
    >
      <p style={ { marginBottom: 16 } }>
        ¿Estás seguro que deseas eliminar el siguiente personas?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ personas.nombre }</strong>
        <br />
        <span style={ { color: '#6b7280', fontSize: 14 } }>
          { personas.tipo_documento_id }
        </span>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
