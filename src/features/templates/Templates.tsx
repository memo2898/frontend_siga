import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTemplates } from './hooks/useTemplates';
import { TemplatesForm } from './components/TemplatesForm';
import { TemplatesDeleteModal } from './components/TemplatesDeleteModal';
import { templatesHeaders } from './datatable_config/templates.headers';
import { toTemplatesGridRows } from './datatable_config/templates.body';
import type { Templates, TemplatesGridRow, TemplatesCreateDTO } from './templates.types';
import './components/TemplatesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function Templates() {
  const gridieRef = useRef<GridieRef>(null);

  const { templates, meta, loading, saving, paginated, fetch, create, update, remove } = useTemplates();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<Templates | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTemplates(null);
    setModalMode('create');
  };

  const openEdit = (templates: Templates) => {
    setSelectedTemplates(templates);
    setModalMode('edit');
  };

  const openDelete = (templates: Templates) => {
    setSelectedTemplates(templates);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTemplates(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TemplatesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTemplates!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTemplates) return;
    const success = await remove(selectedTemplates.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TemplatesGridRow[] = toTemplatesGridRows(templates, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Templates</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Templates
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TemplatesGridRow>
        ref={gridieRef}
        id="templates-table"
        identityField="id"
        headers={ templatesHeaders }
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
        title={modalMode === 'create' ? 'Crear Templates' : 'Editar Templates'}
        size="md"
      >
        <TemplatesForm
          key={ selectedTemplates?.id ?? 'new' }
          initialData={ selectedTemplates }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TemplatesDeleteModal
        isOpen={modalMode === 'delete'}
        templates={ selectedTemplates }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

//export default Templates;
