import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useTransacciones } from './hooks/useTransacciones';
import { TransaccionesForm } from './components/TransaccionesForm';
import { TransaccionesDeleteModal } from './components/TransaccionesDeleteModal';
import { transaccionesHeaders } from './datatable_config/transacciones.headers';
import { toTransaccionesGridRows } from './datatable_config/transacciones.body';
import type { Transacciones, TransaccionesGridRow, TransaccionesCreateDTO } from './transacciones.types';
import './components/TransaccionesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Transacciones() {
  const gridieRef = useRef<GridieRef>(null);

  const { transacciones, meta, loading, saving, paginated, fetch, create, update, remove, modulosOptions, personasOptions, usuariosOptions, rolesOptions } = useTransacciones();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTransacciones, setSelectedTransacciones] = useState<Transacciones | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedTransacciones(null);
    setModalMode('create');
  };

  const openEdit = (transacciones: Transacciones) => {
    setSelectedTransacciones(transacciones);
    setModalMode('edit');
  };

  const openDelete = (transacciones: Transacciones) => {
    setSelectedTransacciones(transacciones);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTransacciones(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: TransaccionesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedTransacciones!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedTransacciones) return;
    const success = await remove(selectedTransacciones.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: TransaccionesGridRow[] = toTransaccionesGridRows(transacciones, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">Transacciones</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Transacciones
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<TransaccionesGridRow>
        ref={gridieRef}
        id="transacciones-table"
        identityField="id"
        headers={ transaccionesHeaders }
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
        title={modalMode === 'create' ? 'Crear Transacciones' : 'Editar Transacciones'}
        size="md"
      >
        <TransaccionesForm
          key={ selectedTransacciones?.id ?? 'new' }
          initialData={ selectedTransacciones }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          modulosOptions={ modulosOptions }
          personasOptions={ personasOptions }
          usuariosOptions={ usuariosOptions }
          rolesOptions={ rolesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <TransaccionesDeleteModal
        isOpen={modalMode === 'delete'}
        transacciones={ selectedTransacciones }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Transacciones;
