import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';
import { useNavigate } from 'react-router-dom';
import { useTemplatesModulos } from './hooks/useTemplatesModulos';
import { TemplatesModulosForm } from './components/TemplatesModulosForm';
import { TemplatesModulosDeleteModal } from './components/TemplatesModulosDeleteModal';
import { templatesModulosHeaders } from './datatable_config/templatesmodulos.headers';
import { toTemplatesModulosGridRows } from './datatable_config/templatesmodulos.body';
import type { TemplatesModulos, TemplatesModulosGridRow, TemplatesModulosCreateDTO } from './templatesmodulos.types';
import './components/TemplatesModulosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function TemplatesModulos() {
  const gridieRef = useRef<GridieRef>(null);
  const navigate = useNavigate();
  const { templatesModulos, meta, loading, saving, paginated, fetch, create, update, remove } = useTemplatesModulos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTemplatesModulos, setSelectedTemplatesModulos] = useState<TemplatesModulos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTemplatesModulos(null);
    setModalMode('create');
  };

  const openEdit = (templatesModulos: TemplatesModulos) => {
    setSelectedTemplatesModulos(templatesModulos);
    setModalMode('edit');
  };

  const openDelete = (templatesModulos: TemplatesModulos) => {
    setSelectedTemplatesModulos(templatesModulos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTemplatesModulos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TemplatesModulosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTemplatesModulos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTemplatesModulos) return;
    const success = await remove(selectedTemplatesModulos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TemplatesModulosGridRow[] = toTemplatesModulosGridRows(templatesModulos, {
    onEdit: openEdit,
      onDelete: openDelete,
      onTemplateBuilder: (template) => {
        navigate(`/template-builder-modulos/${template.id}`);
      },
  });

  

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Plantillas Módulos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TemplatesModulos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TemplatesModulosGridRow>
        ref={gridieRef}
        id="templatesmodulos-table"
        identityField="id"
        headers={ templatesModulosHeaders }
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
        title={modalMode === 'create' ? 'Crear TemplatesModulos' : 'Editar TemplatesModulos'}
        size="md"
      >
        <TemplatesModulosForm
          key={ selectedTemplatesModulos?.id ?? 'new' }
          initialData={ selectedTemplatesModulos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TemplatesModulosDeleteModal
        isOpen={modalMode === 'delete'}
        templatesModulos={ selectedTemplatesModulos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TemplatesModulos;
