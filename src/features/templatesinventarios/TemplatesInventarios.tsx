import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTemplatesInventarios } from './hooks/useTemplatesInventarios';
import { TemplatesInventariosForm } from './components/TemplatesInventariosForm';
import { TemplatesInventariosDeleteModal } from './components/TemplatesInventariosDeleteModal';
import { templatesInventariosHeaders } from './datatable_config/templatesinventarios.headers';
import { toTemplatesInventariosGridRows } from './datatable_config/templatesinventarios.body';
import type { TemplatesInventarios, TemplatesInventariosGridRow, TemplatesInventariosCreateDTO } from './templatesinventarios.types';
import './components/TemplatesInventariosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function TemplatesInventarios() {
  const gridieRef = useRef<GridieRef>(null);
  const navigate = useNavigate();

  const { templatesInventarios, meta, loading, saving, paginated, fetch, create, update, remove } = useTemplatesInventarios();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTemplatesInventarios, setSelectedTemplatesInventarios] = useState<TemplatesInventarios | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTemplatesInventarios(null);
    setModalMode('create');
  };

  const openEdit = (templatesInventarios: TemplatesInventarios) => {
    setSelectedTemplatesInventarios(templatesInventarios);
    setModalMode('edit');
  };

  const openDelete = (templatesInventarios: TemplatesInventarios) => {
    setSelectedTemplatesInventarios(templatesInventarios);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTemplatesInventarios(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TemplatesInventariosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTemplatesInventarios!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTemplatesInventarios) return;
    const success = await remove(selectedTemplatesInventarios.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TemplatesInventariosGridRow[] = toTemplatesInventariosGridRows(templatesInventarios, {
    onEdit: openEdit,
    onDelete: openDelete,
    onTemplateBuilder: (template) => {
      navigate(`/template-builder-inventarios/${template.id}`);
    },
  });

  // ========== RENDER ==========
  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
       <h1 className="tituloPrincipal">Plantillas Inventarios</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TemplatesInventarios
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TemplatesInventariosGridRow>
        ref={gridieRef}
        id="templatesinventarios-table"
        identityField="id"
        headers={templatesInventariosHeaders}
        body={gridRows}
        enableSort={true}
        enableFilter={true}
        language="es"
        paging={{
          enabled: true,
          pageSize: { visible: true, default: 10, options: [10, 25, 50, 100] },
          showInfo: true,
          navigation: { visible: true, showPrevNext: true, showFirstLast: true, maxButtons: 5 },
          position: 'bottom',
        }}
        onPageChange={handlePageChange}
      />

      {/* Meta */}
      {paginated && meta && (
        <p style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>
          Total: {meta.total} | Página {meta.page} de {meta.totalPages}
        </p>
      )}

      {/* Modal Crear/Editar */}
      <ModalX
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Crear TemplatesInventarios' : 'Editar TemplatesInventarios'}
        size="md"
      >
        <TemplatesInventariosForm
          key={selectedTemplatesInventarios?.id ?? 'new'}
          initialData={selectedTemplatesInventarios}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TemplatesInventariosDeleteModal
        isOpen={modalMode === 'delete'}
        templatesInventarios={selectedTemplatesInventarios}
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}