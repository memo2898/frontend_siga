import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTransaccionesDetalleImagenes } from './hooks/useTransaccionesDetalleImagenes';
import { TransaccionesDetalleImagenesForm } from './components/TransaccionesDetalleImagenesForm';
import { TransaccionesDetalleImagenesDeleteModal } from './components/TransaccionesDetalleImagenesDeleteModal';
import { transaccionesDetalleImagenesHeaders } from './datatable_config/transaccionesdetalleimagenes.headers';
import { toTransaccionesDetalleImagenesGridRows } from './datatable_config/transaccionesdetalleimagenes.body';
import type { TransaccionesDetalleImagenes, TransaccionesDetalleImagenesGridRow, TransaccionesDetalleImagenesCreateDTO } from './transaccionesdetalleimagenes.types';
import './components/TransaccionesDetalleImagenesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function TransaccionesDetalleImagenes() {
  const gridieRef = useRef<GridieRef>(null);

  const { transaccionesDetalleImagenes, meta, loading, saving, paginated, fetch, create, update, remove } = useTransaccionesDetalleImagenes();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTransaccionesDetalleImagenes, setSelectedTransaccionesDetalleImagenes] = useState<TransaccionesDetalleImagenes | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTransaccionesDetalleImagenes(null);
    setModalMode('create');
  };

  const openEdit = (transaccionesDetalleImagenes: TransaccionesDetalleImagenes) => {
    setSelectedTransaccionesDetalleImagenes(transaccionesDetalleImagenes);
    setModalMode('edit');
  };

  const openDelete = (transaccionesDetalleImagenes: TransaccionesDetalleImagenes) => {
    setSelectedTransaccionesDetalleImagenes(transaccionesDetalleImagenes);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransaccionesDetalleImagenes(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TransaccionesDetalleImagenesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTransaccionesDetalleImagenes!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTransaccionesDetalleImagenes) return;
    const success = await remove(selectedTransaccionesDetalleImagenes.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TransaccionesDetalleImagenesGridRow[] = toTransaccionesDetalleImagenesGridRows(transaccionesDetalleImagenes, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>TransaccionesDetalleImagenes</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TransaccionesDetalleImagenes
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TransaccionesDetalleImagenesGridRow>
        ref={gridieRef}
        id="transaccionesdetalleimagenes-table"
        identityField="id"
        headers={ transaccionesDetalleImagenesHeaders }
        body={gridRows}
        enableSort={true}
        enableFilter={true}
        language="es"
        paging={ {
          enabled: true,
          pageSize: { visible: true, default: 10, options: [10, 25, 50, 100] },
          showInfo: true,
          navigation: { visible: true, showPrevNext: true, showFirstLast: true, maxButtons: 5 },
          position: 'bottom',
        } }
        onPageChange={handlePageChange}
      />

      {/* Meta */}
      {paginated && meta && (
        <p style={ { marginTop: 10, color: '#6b7280', fontSize: 14 } }>
          Total: {meta.total} | Página {meta.page} de {meta.totalPages}
        </p>
      )}

      {/* Modal Crear/Editar */}
      <ModalX
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Crear TransaccionesDetalleImagenes' : 'Editar TransaccionesDetalleImagenes'}
        size="md"
      >
        <TransaccionesDetalleImagenesForm
          key={ selectedTransaccionesDetalleImagenes?.id ?? 'new' }
          initialData={ selectedTransaccionesDetalleImagenes }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TransaccionesDetalleImagenesDeleteModal
        isOpen={modalMode === 'delete'}
        transaccionesDetalleImagenes={ selectedTransaccionesDetalleImagenes }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TransaccionesDetalleImagenes;
