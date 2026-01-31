import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useUsuariosRoles } from './hooks/useUsuariosRoles';
import { UsuariosRolesForm } from './components/UsuariosRolesForm';
import { UsuariosRolesDeleteModal } from './components/UsuariosRolesDeleteModal';
import { usuariosRolesHeaders } from './datatable_config/usuariosroles.headers';
import { toUsuariosRolesGridRows } from './datatable_config/usuariosroles.body';
import type { UsuariosRoles, UsuariosRolesGridRow, UsuariosRolesCreateDTO } from './usuariosroles.types';
import './components/UsuariosRolesForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function UsuariosRoles() {
  const gridieRef = useRef<GridieRef>(null);

  const { usuariosRoles, meta, loading, saving, paginated, fetch, create, update, remove, usuariosOptions, rolesOptions } = useUsuariosRoles();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUsuariosRoles, setSelectedUsuariosRoles] = useState<UsuariosRoles | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedUsuariosRoles(null);
    setModalMode('create');
  };

  const openEdit = (usuariosRoles: UsuariosRoles) => {
    setSelectedUsuariosRoles(usuariosRoles);
    setModalMode('edit');
  };

  const openDelete = (usuariosRoles: UsuariosRoles) => {
    setSelectedUsuariosRoles(usuariosRoles);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUsuariosRoles(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: UsuariosRolesCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedUsuariosRoles!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedUsuariosRoles) return;
    const success = await remove(selectedUsuariosRoles.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: UsuariosRolesGridRow[] = toUsuariosRolesGridRows(usuariosRoles, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 className="tituloPrincipal">UsuariosRoles</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo UsuariosRoles
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<UsuariosRolesGridRow>
        ref={gridieRef}
        id="usuariosroles-table"
        identityField="id"
        headers={ usuariosRolesHeaders }
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
        title={modalMode === 'create' ? 'Crear UsuariosRoles' : 'Editar UsuariosRoles'}
        size="md"
      >
        <UsuariosRolesForm
          key={ selectedUsuariosRoles?.id ?? 'new' }
          initialData={ selectedUsuariosRoles }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          usuariosOptions={ usuariosOptions }
          rolesOptions={ rolesOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <UsuariosRolesDeleteModal
        isOpen={modalMode === 'delete'}
        usuariosRoles={ selectedUsuariosRoles }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default UsuariosRoles;
