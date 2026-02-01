import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useModulos } from './hooks/useModulos';
import { ModulosForm } from './components/ModulosForm';
import { ModulosDeleteModal } from './components/ModulosDeleteModal';
import { modulosHeaders } from './datatable_config/modulos.headers';
import { toModulosGridRows } from './datatable_config/modulos.body';
import type { Modulos, ModulosGridRow, ModulosCreateDTO } from './modulos.types';
import './components/ModulosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function Modulos() {
  const gridieRef = useRef<GridieRef>(null);

  const { modulos, meta, loading, saving, paginated, fetch, create, update, remove } = useModulos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedModulos, setSelectedModulos] = useState<Modulos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedModulos(null);
    setModalMode('create');
  };

  const openEdit = (modulos: Modulos) => {
    setSelectedModulos(modulos);
    setModalMode('edit');
  };

  const openDelete = (modulos: Modulos) => {
    setSelectedModulos(modulos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedModulos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: ModulosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedModulos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedModulos) return;
    const success = await remove(selectedModulos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: ModulosGridRow[] = toModulosGridRows(modulos, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Modulos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Modulos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<ModulosGridRow>
        ref={gridieRef}
        id="modulos-table"
        identityField="id"
        headers={ modulosHeaders }
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
        title={modalMode === 'create' ? 'Crear Modulos' : 'Editar Modulos'}
        size="md"
      >
        <ModulosForm
          key={ selectedModulos?.id ?? 'new' }
          initialData={ selectedModulos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <ModulosDeleteModal
        isOpen={modalMode === 'delete'}
        modulos={ selectedModulos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Modulos;
