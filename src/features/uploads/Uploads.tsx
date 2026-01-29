import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useUploads } from './hooks/useUploads';
import { UploadsForm } from './components/UploadsForm';
import { UploadsDeleteModal } from './components/UploadsDeleteModal';
import { uploadsHeaders } from './datatable_config/uploads.headers';
import { toUploadsGridRows } from './datatable_config/uploads.body';
import type { Uploads, UploadsGridRow, UploadsCreateDTO } from './uploads.types';
import './components/UploadsForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Uploads() {
  const gridieRef = useRef<GridieRef>(null);

  const { uploads, meta, loading, saving, paginated, fetch, create, update, remove } = useUploads();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUploads, setSelectedUploads] = useState<Uploads | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedUploads(null);
    setModalMode('create');
  };

  const openEdit = (uploads: Uploads) => {
    setSelectedUploads(uploads);
    setModalMode('edit');
  };

  const openDelete = (uploads: Uploads) => {
    setSelectedUploads(uploads);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUploads(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: UploadsCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedUploads!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedUploads) return;
    const success = await remove(selectedUploads.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: UploadsGridRow[] = toUploadsGridRows(uploads, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Uploads</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Uploads
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<UploadsGridRow>
        ref={gridieRef}
        id="uploads-table"
        identityField="id"
        headers={ uploadsHeaders }
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
        title={modalMode === 'create' ? 'Crear Uploads' : 'Editar Uploads'}
        size="md"
      >
        <UploadsForm
          key={ selectedUploads?.id ?? 'new' }
          initialData={ selectedUploads }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <UploadsDeleteModal
        isOpen={modalMode === 'delete'}
        uploads={ selectedUploads }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Uploads;
