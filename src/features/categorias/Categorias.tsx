import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useCategorias } from './hooks/useCategorias';
import { CategoriasForm } from './components/CategoriasForm';
import { CategoriasDeleteModal } from './components/CategoriasDeleteModal';
import { categoriasHeaders } from './datatable_config/categorias.headers';
import { toCategoriasGridRows } from './datatable_config/categorias.body';
import type { Categorias, CategoriasGridRow, CategoriasCreateDTO } from './categorias.types';
import './components/CategoriasForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function Categorias() {
  const gridieRef = useRef<GridieRef>(null);

  const { categorias, meta, loading, saving, paginated, fetch, create, update, remove } = useCategorias();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCategorias, setSelectedCategorias] = useState<Categorias | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedCategorias(null);
    setModalMode('create');
  };

  const openEdit = (categorias: Categorias) => {
    setSelectedCategorias(categorias);
    setModalMode('edit');
  };

  const openDelete = (categorias: Categorias) => {
    setSelectedCategorias(categorias);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCategorias(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: CategoriasCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedCategorias!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedCategorias) return;
    const success = await remove(selectedCategorias.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: CategoriasGridRow[] = toCategoriasGridRows(categorias, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Categorias</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Categorias
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<CategoriasGridRow>
        ref={gridieRef}
        id="categorias-table"
        identityField="id"
        headers={ categoriasHeaders }
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
        title={modalMode === 'create' ? 'Crear Categorias' : 'Editar Categorias'}
        size="md"
      >
        <CategoriasForm
          key={ selectedCategorias?.id ?? 'new' }
          initialData={ selectedCategorias }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <CategoriasDeleteModal
        isOpen={modalMode === 'delete'}
        categorias={ selectedCategorias }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Categorias;
