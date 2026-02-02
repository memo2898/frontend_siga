import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTransaccionesDetalle } from './hooks/useTransaccionesDetalle';
import { TransaccionesDetalleForm } from './components/TransaccionesDetalleForm';
import { TransaccionesDetalleDeleteModal } from './components/TransaccionesDetalleDeleteModal';
import { transaccionesDetalleHeaders } from './datatable_config/transaccionesdetalle.headers';
import { toTransaccionesDetalleGridRows } from './datatable_config/transaccionesdetalle.body';
import type { TransaccionesDetalle, TransaccionesDetalleGridRow, TransaccionesDetalleCreateDTO } from './transaccionesdetalle.types';
import './components/TransaccionesDetalleForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function TransaccionesDetalles() {
  const gridieRef = useRef<GridieRef>(null);

  const { transaccionesDetalles, meta, loading, saving, paginated, fetch, create, update, remove, transaccionesOptions, activosOptions } = useTransaccionesDetalle();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTransaccionesDetalle, setSelectedTransaccionesDetalle] = useState<TransaccionesDetalle | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTransaccionesDetalle(null);
    setModalMode('create');
  };

  const openEdit = (transaccionesDetalle: TransaccionesDetalle) => {
    setSelectedTransaccionesDetalle(transaccionesDetalle);
    setModalMode('edit');
  };

  const openDelete = (transaccionesDetalle: TransaccionesDetalle) => {
    setSelectedTransaccionesDetalle(transaccionesDetalle);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransaccionesDetalle(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TransaccionesDetalleCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTransaccionesDetalle!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTransaccionesDetalle) return;
    const success = await remove(selectedTransaccionesDetalle.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TransaccionesDetalleGridRow[] = toTransaccionesDetalleGridRows(transaccionesDetalles, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>TransaccionesDetalles</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TransaccionesDetalle
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TransaccionesDetalleGridRow>
        ref={gridieRef}
        id="transaccionesdetalle-table"
        identityField="id"
        headers={ transaccionesDetalleHeaders }
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
        title={modalMode === 'create' ? 'Crear TransaccionesDetalle' : 'Editar TransaccionesDetalle'}
        size="md"
      >
        <TransaccionesDetalleForm
          key={ selectedTransaccionesDetalle?.id ?? 'new' }
          initialData={ selectedTransaccionesDetalle }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          transaccionesOptions={ transaccionesOptions }
          activosOptions={ activosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TransaccionesDetalleDeleteModal
        isOpen={modalMode === 'delete'}
        transaccionesDetalle={ selectedTransaccionesDetalle }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TransaccionesDetalles;
