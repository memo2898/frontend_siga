import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTiposDocumentos } from './hooks/useTiposDocumentos';
import { TiposDocumentosForm } from './components/TiposDocumentosForm';
import { TiposDocumentosDeleteModal } from './components/TiposDocumentosDeleteModal';
import { tiposDocumentosHeaders } from './datatable_config/tiposdocumentos.headers';
import { toTiposDocumentosGridRows } from './datatable_config/tiposdocumentos.body';
import type { TiposDocumentos, TiposDocumentosGridRow, TiposDocumentosCreateDTO } from './tiposdocumentos.types';
import './components/TiposDocumentosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function TiposDocumentos() {
  const gridieRef = useRef<GridieRef>(null);

  const { tiposDocumentos, meta, loading, saving, paginated, fetch, create, update, remove } = useTiposDocumentos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTiposDocumentos, setSelectedTiposDocumentos] = useState<TiposDocumentos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTiposDocumentos(null);
    setModalMode('create');
  };

  const openEdit = (tiposDocumentos: TiposDocumentos) => {
    setSelectedTiposDocumentos(tiposDocumentos);
    setModalMode('edit');
  };

  const openDelete = (tiposDocumentos: TiposDocumentos) => {
    setSelectedTiposDocumentos(tiposDocumentos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTiposDocumentos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TiposDocumentosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTiposDocumentos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTiposDocumentos) return;
    const success = await remove(selectedTiposDocumentos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TiposDocumentosGridRow[] = toTiposDocumentosGridRows(tiposDocumentos, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>TiposDocumentos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo TiposDocumentos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TiposDocumentosGridRow>
        ref={gridieRef}
        id="tiposdocumentos-table"
        identityField="id"
        headers={ tiposDocumentosHeaders }
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
        title={modalMode === 'create' ? 'Crear TiposDocumentos' : 'Editar TiposDocumentos'}
        size="md"
      >
        <TiposDocumentosForm
          key={ selectedTiposDocumentos?.id ?? 'new' }
          initialData={ selectedTiposDocumentos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TiposDocumentosDeleteModal
        isOpen={modalMode === 'delete'}
        tiposDocumentos={ selectedTiposDocumentos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TiposDocumentos;
