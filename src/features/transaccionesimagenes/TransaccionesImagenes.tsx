import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTransaccionesImagenes } from './hooks/useTransaccionesImagenes';
import { TransaccionesImagenesForm } from './components/TransaccionesImagenesForm';
import { TransaccionesImagenesDeleteModal } from './components/TransaccionesImagenesDeleteModal';
import { transaccionesImagenesHeaders } from './datatable_config/transaccionesimagenes.headers';
import { toTransaccionesImagenesGridRows } from './datatable_config/transaccionesimagenes.body';
import type { TransaccionesImagenes, TransaccionesImagenesGridRow, TransaccionesImagenesCreateDTO } from './transaccionesimagenes.types';
import './components/TransaccionesImagenesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function TransaccionesImagenes() {
  const gridieRef = useRef<GridieRef>(null);

  const { transaccionesImagenes, meta, loading, saving, paginated, fetch, create, update, remove, transaccionesOptions, activosOptions } = useTransaccionesImagenes();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTransaccionesImagenes, setSelectedTransaccionesImagenes] = useState<TransaccionesImagenes | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTransaccionesImagenes(null);
    setModalMode('create');
  };

  const openEdit = (transaccionesImagenes: TransaccionesImagenes) => {
    setSelectedTransaccionesImagenes(transaccionesImagenes);
    setModalMode('edit');
  };

  const openDelete = (transaccionesImagenes: TransaccionesImagenes) => {
    setSelectedTransaccionesImagenes(transaccionesImagenes);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransaccionesImagenes(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TransaccionesImagenesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTransaccionesImagenes!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTransaccionesImagenes) return;
    const success = await remove(selectedTransaccionesImagenes.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TransaccionesImagenesGridRow[] = toTransaccionesImagenesGridRows(transaccionesImagenes, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>TransaccionesImagenes</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TransaccionesImagenes
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TransaccionesImagenesGridRow>
        ref={gridieRef}
        id="transaccionesimagenes-table"
        identityField="id"
        headers={ transaccionesImagenesHeaders }
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
        title={modalMode === 'create' ? 'Crear TransaccionesImagenes' : 'Editar TransaccionesImagenes'}
        size="md"
      >
        <TransaccionesImagenesForm
          key={ selectedTransaccionesImagenes?.id ?? 'new' }
          initialData={ selectedTransaccionesImagenes }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          transaccionesOptions={ transaccionesOptions }
          activosOptions={ activosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TransaccionesImagenesDeleteModal
        isOpen={modalMode === 'delete'}
        transaccionesImagenes={ selectedTransaccionesImagenes }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TransaccionesImagenes;
