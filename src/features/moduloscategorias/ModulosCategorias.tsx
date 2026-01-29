import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useModulosCategorias } from './hooks/useModulosCategorias';
import { ModulosCategoriasForm } from './components/ModulosCategoriasForm';
import { ModulosCategoriasDeleteModal } from './components/ModulosCategoriasDeleteModal';
import { modulosCategoriasHeaders } from './datatable_config/moduloscategorias.headers';
import { toModulosCategoriasGridRows } from './datatable_config/moduloscategorias.body';
import type { ModulosCategorias, ModulosCategoriasGridRow, ModulosCategoriasCreateDTO } from './moduloscategorias.types';
import './components/ModulosCategoriasForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function ModulosCategorias() {
  const gridieRef = useRef<GridieRef>(null);

  const { modulosCategorias, meta, loading, saving, paginated, fetch, create, update, remove, modulosOptions, categoriasOptions } = useModulosCategorias();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedModulosCategorias, setSelectedModulosCategorias] = useState<ModulosCategorias | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedModulosCategorias(null);
    setModalMode('create');
  };

  const openEdit = (modulosCategorias: ModulosCategorias) => {
    setSelectedModulosCategorias(modulosCategorias);
    setModalMode('edit');
  };

  const openDelete = (modulosCategorias: ModulosCategorias) => {
    setSelectedModulosCategorias(modulosCategorias);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedModulosCategorias(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: ModulosCategoriasCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedModulosCategorias!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedModulosCategorias) return;
    const success = await remove(selectedModulosCategorias.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: ModulosCategoriasGridRow[] = toModulosCategoriasGridRows(modulosCategorias, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>ModulosCategorias</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo ModulosCategorias
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<ModulosCategoriasGridRow>
        ref={gridieRef}
        id="moduloscategorias-table"
        identityField="id"
        headers={ modulosCategoriasHeaders }
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
        title={modalMode === 'create' ? 'Crear ModulosCategorias' : 'Editar ModulosCategorias'}
        size="md"
      >
        <ModulosCategoriasForm
          key={ selectedModulosCategorias?.id ?? 'new' }
          initialData={ selectedModulosCategorias }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          modulosOptions={ modulosOptions }
          categoriasOptions={ categoriasOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <ModulosCategoriasDeleteModal
        isOpen={modalMode === 'delete'}
        modulosCategorias={ selectedModulosCategorias }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default ModulosCategorias;
