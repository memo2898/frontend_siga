import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useSedes } from './hooks/useSedes';
import { SedesForm } from './components/SedesForm';
import { SedesDeleteModal } from './components/SedesDeleteModal';
import { sedesHeaders } from './datatable_config/sedes.headers';
import { toSedesGridRows } from './datatable_config/sedes.body';
import type { Sedes, SedesGridRow, SedesCreateDTO } from './sedes.types';
import './components/SedesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function Sedes() {
  const gridieRef = useRef<GridieRef>(null);

  const { sedes, meta, loading, saving, paginated, fetch, create, update, remove } = useSedes();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedSedes, setSelectedSedes] = useState<Sedes | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedSedes(null);
    setModalMode('create');
  };

  const openEdit = (sedes: Sedes) => {
    setSelectedSedes(sedes);
    setModalMode('edit');
  };

  const openDelete = (sedes: Sedes) => {
    setSelectedSedes(sedes);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedSedes(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: SedesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedSedes!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedSedes) return;
    const success = await remove(selectedSedes.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: SedesGridRow[] = toSedesGridRows(sedes, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Sedes</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Sedes
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<SedesGridRow>
        ref={gridieRef}
        id="sedes-table"
        identityField="id"
        headers={ sedesHeaders }
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
        title={modalMode === 'create' ? 'Crear Sedes' : 'Editar Sedes'}
        size="md"
      >
        <SedesForm
          key={ selectedSedes?.id ?? 'new' }
          initialData={ selectedSedes }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <SedesDeleteModal
        isOpen={modalMode === 'delete'}
        sedes={ selectedSedes }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

//export default Sedes;
