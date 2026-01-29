import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { Departamentos } from '../departamentos.types';

interface DepartamentosDeleteModalProps {
  isOpen: boolean;
  departamentos: Departamentos | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DepartamentosDeleteModal({ isOpen, departamentos, loading, onConfirm, onCancel }: DepartamentosDeleteModalProps) {
  if (!departamentos) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar Departamentos"
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
        ¿Estás seguro que deseas eliminar el siguiente departamentos?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ departamentos.direccion_id }</strong>
        <br />
        <span style={ { color: '#6b7280', fontSize: 14 } }>
          { departamentos.nombre }
        </span>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
