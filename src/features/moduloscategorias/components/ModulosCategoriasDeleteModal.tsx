import { ModalX } from '../../../lib/uiX/components/ModalX';
import type { ModulosCategorias } from '../moduloscategorias.types';

interface ModulosCategoriasDeleteModalProps {
  isOpen: boolean;
  modulosCategorias: ModulosCategorias | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ModulosCategoriasDeleteModal({ isOpen, modulosCategorias, loading, onConfirm, onCancel }: ModulosCategoriasDeleteModalProps) {
  if (!modulosCategorias) return null;

  return (
    <ModalX
      isOpen={isOpen}
      onClose={onCancel}
      title="Eliminar ModulosCategorias"
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
        ¿Estás seguro que deseas eliminar el siguiente moduloscategorias?
      </p>
      <div style={ {
        padding: 16,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        border: '1px solid #fecaca',
      } }>
        <strong>{ modulosCategorias.modulo_id }</strong>
        <br />
        <span style={ { color: '#6b7280', fontSize: 14 } }>
          { modulosCategorias.categoria_id }
        </span>
      </div>
      <p style={ { marginTop: 16, color: '#ef4444', fontSize: 14 } }>
        Esta acción no se puede deshacer.
      </p>
    </ModalX>
  );
}
