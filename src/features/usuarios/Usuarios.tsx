import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useUsuarios } from './hooks/useUsuarios';
import { UsuariosForm } from './components/UsuariosForm';
import { UsuariosDeleteModal } from './components/UsuariosDeleteModal';
import { usuariosHeaders } from './datatable_config/usuarios.headers';
import { toUsuariosGridRows } from './datatable_config/usuarios.body';
import type { Usuarios, UsuariosGridRow, UsuariosCreateDTO } from './usuarios.types';
import './components/UsuariosForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Usuarios() {
  const gridieRef = useRef<GridieRef>(null);

  const { usuarios, meta, loading, saving, paginated, fetch, create, update, remove, departamentosOptions } = useUsuarios();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuarios | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedUsuarios(null);
    setModalMode('create');
  };

  const openEdit = (usuarios: Usuarios) => {
    setSelectedUsuarios(usuarios);
    setModalMode('edit');
  };

  const openDelete = (usuarios: Usuarios) => {
    setSelectedUsuarios(usuarios);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUsuarios(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: UsuariosCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedUsuarios!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedUsuarios) return;
    const success = await remove(selectedUsuarios.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: UsuariosGridRow[] = toUsuariosGridRows(usuarios, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Usuarios</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Usuarios
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<UsuariosGridRow>
        ref={gridieRef}
        id="usuarios-table"
        identityField="id"
        headers={ usuariosHeaders }
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
        title={modalMode === 'create' ? 'Crear Usuarios' : 'Editar Usuarios'}
        size="md"
      >
        <UsuariosForm
          key={ selectedUsuarios?.id ?? 'new' }
          initialData={ selectedUsuarios }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          departamentosOptions={ departamentosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <UsuariosDeleteModal
        isOpen={modalMode === 'delete'}
        usuarios={ selectedUsuarios }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Usuarios;
