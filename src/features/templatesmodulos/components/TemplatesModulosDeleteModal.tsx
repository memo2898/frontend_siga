import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { TemplatesModulos } from '../templatesmodulos.types';

interface TemplatesModulosDeleteModalProps {
  isOpen: boolean;
  templatesModulos: TemplatesModulos | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TemplatesModulosDeleteModal({ isOpen, templatesModulos, loading, onConfirm, onCancel }: TemplatesModulosDeleteModalProps) {
  if (!templatesModulos) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar TemplatesModulos"
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
        ¿Estás seguro que deseas eliminar el siguiente templatesmodulos?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ templatesModulos.nombre }</strong>
        <br />
        <span style={ { color: '#6b7280', fontSize: 14 } }>
          { templatesModulos.descripcion }
        </span>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
