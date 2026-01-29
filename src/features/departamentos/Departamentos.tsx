import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useDepartamentos } from './hooks/useDepartamentos';
import { DepartamentosForm } from './components/DepartamentosForm';
import { DepartamentosDeleteModal } from './components/DepartamentosDeleteModal';
import { departamentosHeaders } from './datatable_config/departamentos.headers';
import { toDepartamentosGridRows } from './datatable_config/departamentos.body';
import type { Departamentos, DepartamentosGridRow, DepartamentosCreateDTO } from './departamentos.types';
import './components/DepartamentosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Departamentos() {
  const gridieRef = useRef<GridieRef>(null);

  const { departamentos, meta, loading, saving, paginated, fetch, create, update, remove, direccionesOptions } = useDepartamentos();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<Departamentos | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedDepartamentos(null);
    setModalMode('create');
  };

  const openEdit = (departamentos: Departamentos) => {
    setSelectedDepartamentos(departamentos);
    setModalMode('edit');
  };

  const openDelete = (departamentos: Departamentos) => {
    setSelectedDepartamentos(departamentos);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDepartamentos(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: DepartamentosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedDepartamentos!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedDepartamentos) return;
    const success = await remove(selectedDepartamentos.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: DepartamentosGridRow[] = toDepartamentosGridRows(departamentos, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Departamentos</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Departamentos
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<DepartamentosGridRow>
        ref={gridieRef}
        id="departamentos-table"
        identityField="id"
        headers={ departamentosHeaders }
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
        title={modalMode === 'create' ? 'Crear Departamentos' : 'Editar Departamentos'}
        size="md"
      >
        <DepartamentosForm
          key={ selectedDepartamentos?.id ?? 'new' }
          initialData={ selectedDepartamentos }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          direccionesOptions={ direccionesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <DepartamentosDeleteModal
        isOpen={modalMode === 'delete'}
        departamentos={ selectedDepartamentos }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Departamentos;
