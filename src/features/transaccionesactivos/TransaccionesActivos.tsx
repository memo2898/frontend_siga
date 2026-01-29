import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTransaccionesActivos } from './hooks/useTransaccionesActivos';
import { TransaccionesActivosForm } from './components/TransaccionesActivosForm';
import { TransaccionesActivosDeleteModal } from './components/TransaccionesActivosDeleteModal';
import { transaccionesActivosHeaders } from './datatable_config/transaccionesactivos.headers';
import { toTransaccionesActivosGridRows } from './datatable_config/transaccionesactivos.body';
import type { TransaccionesActivos, TransaccionesActivosGridRow, TransaccionesActivosCreateDTO } from './transaccionesactivos.types';
import './components/TransaccionesActivosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function TransaccionesActivos() {
  const gridieRef = useRef<GridieRef>(null);

  const { transaccionesActivos, meta, loading, saving, paginated, fetch, create, update, remove, transaccionesOptions, activosOptions } = useTransaccionesActivos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTransaccionesActivos, setSelectedTransaccionesActivos] = useState<TransaccionesActivos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTransaccionesActivos(null);
    setModalMode('create');
  };

  const openEdit = (transaccionesActivos: TransaccionesActivos) => {
    setSelectedTransaccionesActivos(transaccionesActivos);
    setModalMode('edit');
  };

  const openDelete = (transaccionesActivos: TransaccionesActivos) => {
    setSelectedTransaccionesActivos(transaccionesActivos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransaccionesActivos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TransaccionesActivosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTransaccionesActivos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTransaccionesActivos) return;
    const success = await remove(selectedTransaccionesActivos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TransaccionesActivosGridRow[] = toTransaccionesActivosGridRows(transaccionesActivos, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>TransaccionesActivos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TransaccionesActivos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TransaccionesActivosGridRow>
        ref={gridieRef}
        id="transaccionesactivos-table"
        identityField="id"
        headers={ transaccionesActivosHeaders }
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
        title={modalMode === 'create' ? 'Crear TransaccionesActivos' : 'Editar TransaccionesActivos'}
        size="md"
      >
        <TransaccionesActivosForm
          key={ selectedTransaccionesActivos?.id ?? 'new' }
          initialData={ selectedTransaccionesActivos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          transaccionesOptions={ transaccionesOptions }
          activosOptions={ activosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TransaccionesActivosDeleteModal
        isOpen={modalMode === 'delete'}
        transaccionesActivos={ selectedTransaccionesActivos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TransaccionesActivos;
