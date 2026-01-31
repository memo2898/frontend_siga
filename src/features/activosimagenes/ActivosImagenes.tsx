import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useActivosImagenes } from './hooks/useActivosImagenes';
import { ActivosImagenesForm } from './components/ActivosImagenesForm';
import { ActivosImagenesDeleteModal } from './components/ActivosImagenesDeleteModal';
import { activosImagenesHeaders } from './datatable_config/activosimagenes.headers';
import { toActivosImagenesGridRows } from './datatable_config/activosimagenes.body';
import type { ActivosImagenes, ActivosImagenesGridRow, ActivosImagenesCreateDTO } from './activosimagenes.types';
import './components/ActivosImagenesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function ActivosImagenes() {
  const gridieRef = useRef<GridieRef>(null);

  const { activosImagenes, meta, loading, saving, paginated, fetch, create, update, remove, activosOptions } = useActivosImagenes();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedActivosImagenes, setSelectedActivosImagenes] = useState<ActivosImagenes | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedActivosImagenes(null);
    setModalMode('create');
  };

  const openEdit = (activosImagenes: ActivosImagenes) => {
    setSelectedActivosImagenes(activosImagenes);
    setModalMode('edit');
  };

  const openDelete = (activosImagenes: ActivosImagenes) => {
    setSelectedActivosImagenes(activosImagenes);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedActivosImagenes(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: ActivosImagenesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedActivosImagenes!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedActivosImagenes) return;
    const success = await remove(selectedActivosImagenes.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: ActivosImagenesGridRow[] = toActivosImagenesGridRows(activosImagenes, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">ActivosImagenes</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo ActivosImagenes
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<ActivosImagenesGridRow>
        ref={gridieRef}
        id="activosimagenes-table"
        identityField="id"
        headers={ activosImagenesHeaders }
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
        title={modalMode === 'create' ? 'Crear ActivosImagenes' : 'Editar ActivosImagenes'}
        size="md"
      >
        <ActivosImagenesForm
          key={ selectedActivosImagenes?.id ?? 'new' }
          initialData={ selectedActivosImagenes }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          activosOptions={ activosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <ActivosImagenesDeleteModal
        isOpen={modalMode === 'delete'}
        activosImagenes={ selectedActivosImagenes }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default ActivosImagenes;
