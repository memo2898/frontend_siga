import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { Roles } from '../roles.types';

interface RolesDeleteModalProps {
  isOpen: boolean;
  roles: Roles | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RolesDeleteModal({ isOpen, roles, loading, onConfirm, onCancel }: RolesDeleteModalProps) {
  if (!roles) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar Roles"
      size="sm"
      footer={
        <>
          <button onClick={onCancel} disabled={loading} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </>
      }
    >
      <p style={ { marginBottom: 16 } }>
        ¿Estás seguro que deseas eliminar el siguiente roles?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ roles.nombre }</strong>
        <br />
        <span style={ { color: '#6b7280', fontSize: 14 } }>
          { roles.descripcion }
        </span>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
