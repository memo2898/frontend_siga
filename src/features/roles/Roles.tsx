import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useRoles } from './hooks/useRoles';
import { RolesForm } from './components/RolesForm';
import { RolesDeleteModal } from './components/RolesDeleteModal';
import { rolesHeaders } from './datatable_config/roles.headers';
import { toRolesGridRows } from './datatable_config/roles.body';
import type { Roles, RolesGridRow, RolesCreateDTO } from './roles.types';
import './components/RolesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Roles() {
  const gridieRef = useRef<GridieRef>(null);

  const { roles, meta, loading, saving, paginated, fetch, create, update, remove } = useRoles();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedRoles, setSelectedRoles] = useState<Roles | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedRoles(null);
    setModalMode('create');
  };

  const openEdit = (roles: Roles) => {
    setSelectedRoles(roles);
    setModalMode('edit');
  };

  const openDelete = (roles: Roles) => {
    setSelectedRoles(roles);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRoles(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: RolesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedRoles!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedRoles) return;
    const success = await remove(selectedRoles.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: RolesGridRow[] = toRolesGridRows(roles, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Roles</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Roles
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<RolesGridRow>
        ref={gridieRef}
        id="roles-table"
        identityField="id"
        headers={ rolesHeaders }
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
        title={modalMode === 'create' ? 'Crear Roles' : 'Editar Roles'}
        size="md"
      >
        <RolesForm
          key={ selectedRoles?.id ?? 'new' }
          initialData={ selectedRoles }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <RolesDeleteModal
        isOpen={modalMode === 'delete'}
        roles={ selectedRoles }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Roles;
