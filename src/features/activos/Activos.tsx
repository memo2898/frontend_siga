import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useActivos } from './hooks/useActivos';
import { ActivosForm } from './components/ActivosForm';
import { ActivosDeleteModal } from './components/ActivosDeleteModal';
import { activosHeaders } from './datatable_config/activos.headers';
import { toActivosGridRows } from './datatable_config/activos.body';
import type { Activos, ActivosGridRow, ActivosCreateDTO } from './activos.types';
import './components/ActivosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Activos() {
  const gridieRef = useRef<GridieRef>(null);

  const { activos, meta, loading, saving, paginated, fetch, create, update, remove, categoriasOptions, almacenesOptions } = useActivos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedActivos, setSelectedActivos] = useState<Activos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedActivos(null);
    setModalMode('create');
  };

  const openEdit = (activos: Activos) => {
    setSelectedActivos(activos);
    setModalMode('edit');
  };

  const openDelete = (activos: Activos) => {
    setSelectedActivos(activos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedActivos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: ActivosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedActivos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedActivos) return;
    const success = await remove(selectedActivos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: ActivosGridRow[] = toActivosGridRows(activos, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Activos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Activos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<ActivosGridRow>
        ref={gridieRef}
        id="activos-table"
        identityField="id"
        headers={ activosHeaders }
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
        title={modalMode === 'create' ? 'Crear Activos' : 'Editar Activos'}
        size="md"
      >
        <ActivosForm
          key={ selectedActivos?.id ?? 'new' }
          initialData={ selectedActivos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          categoriasOptions={ categoriasOptions }
          almacenesOptions={ almacenesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <ActivosDeleteModal
        isOpen={modalMode === 'delete'}
        activos={ selectedActivos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Activos;
