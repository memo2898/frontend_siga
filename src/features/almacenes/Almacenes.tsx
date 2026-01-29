import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useAlmacenes } from './hooks/useAlmacenes';
import { AlmacenesForm } from './components/AlmacenesForm';
import { AlmacenesDeleteModal } from './components/AlmacenesDeleteModal';
import { almacenesHeaders } from './datatable_config/almacenes.headers';
import { toAlmacenesGridRows } from './datatable_config/almacenes.body';
import type { Almacenes, AlmacenesGridRow, AlmacenesCreateDTO } from './almacenes.types';
import './components/AlmacenesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Almacenes() {
  const gridieRef = useRef<GridieRef>(null);

  const { almacenes, meta, loading, saving, paginated, fetch, create, update, remove, sedesOptions } = useAlmacenes();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAlmacenes, setSelectedAlmacenes] = useState<Almacenes | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedAlmacenes(null);
    setModalMode('create');
  };

  const openEdit = (almacenes: Almacenes) => {
    setSelectedAlmacenes(almacenes);
    setModalMode('edit');
  };

  const openDelete = (almacenes: Almacenes) => {
    setSelectedAlmacenes(almacenes);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAlmacenes(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: AlmacenesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedAlmacenes!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedAlmacenes) return;
    const success = await remove(selectedAlmacenes.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: AlmacenesGridRow[] = toAlmacenesGridRows(almacenes, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Almacenes</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Almacenes
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<AlmacenesGridRow>
        ref={gridieRef}
        id="almacenes-table"
        identityField="id"
        headers={ almacenesHeaders }
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
        title={modalMode === 'create' ? 'Crear Almacenes' : 'Editar Almacenes'}
        size="md"
      >
        <AlmacenesForm
          key={ selectedAlmacenes?.id ?? 'new' }
          initialData={ selectedAlmacenes }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          sedesOptions={ sedesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <AlmacenesDeleteModal
        isOpen={modalMode === 'delete'}
        almacenes={ selectedAlmacenes }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Almacenes;
