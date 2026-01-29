import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { Uploads } from '../uploads.types';

interface UploadsDeleteModalProps {
  isOpen: boolean;
  uploads: Uploads | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UploadsDeleteModal({ isOpen, uploads, loading, onConfirm, onCancel }: UploadsDeleteModalProps) {
  if (!uploads) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar Uploads"
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
        ¿Estás seguro que deseas eliminar el siguiente uploads?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ uploads.filename }</strong>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
