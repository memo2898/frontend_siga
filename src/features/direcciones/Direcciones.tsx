import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useDirecciones } from './hooks/useDirecciones';
import { DireccionesForm } from './components/DireccionesForm';
import { DireccionesDeleteModal } from './components/DireccionesDeleteModal';
import { direccionesHeaders } from './datatable_config/direcciones.headers';
import { toDireccionesGridRows } from './datatable_config/direcciones.body';
import type { Direcciones, DireccionesGridRow, DireccionesCreateDTO } from './direcciones.types';
import './components/DireccionesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

export function Direcciones() {
  const gridieRef = useRef<GridieRef>(null);

  const { direcciones, meta, loading, saving, paginated, fetch, create, update, remove, sedesOptions } = useDirecciones();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedDirecciones, setSelectedDirecciones] = useState<Direcciones | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedDirecciones(null);
    setModalMode('create');
  };

  const openEdit = (direcciones: Direcciones) => {
    setSelectedDirecciones(direcciones);
    setModalMode('edit');
  };

  const openDelete = (direcciones: Direcciones) => {
    setSelectedDirecciones(direcciones);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDirecciones(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: DireccionesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedDirecciones!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedDirecciones) return;
    const success = await remove(selectedDirecciones.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: DireccionesGridRow[] = toDireccionesGridRows(direcciones, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Direcciones</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Direcciones
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<DireccionesGridRow>
        ref={gridieRef}
        id="direcciones-table"
        identityField="id"
        headers={ direccionesHeaders }
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
        title={modalMode === 'create' ? 'Crear Direcciones' : 'Editar Direcciones'}
        size="md"
      >
        <DireccionesForm
          key={ selectedDirecciones?.id ?? 'new' }
          initialData={ selectedDirecciones }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          sedesOptions={ sedesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <DireccionesDeleteModal
        isOpen={modalMode === 'delete'}
        direcciones={ selectedDirecciones }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

//export default Direcciones;
