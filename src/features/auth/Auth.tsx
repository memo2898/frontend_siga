import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { AuthDeleteModal } from './components/AuthDeleteModal';
import { authHeaders } from './datatable_config/auth.headers';
import { toAuthGridRows } from './datatable_config/auth.body';
import type { Auth, AuthGridRow, AuthCreateDTO } from './auth.types';
import './components/AuthForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Auths() {
  const gridieRef = useRef<GridieRef>(null);

  const { auths, meta, loading, saving, paginated, fetch, create, update, remove } = useAuth();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAuth, setSelectedAuth] = useState<Auth | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedAuth(null);
    setModalMode('create');
  };

  const openEdit = (auth: Auth) => {
    setSelectedAuth(auth);
    setModalMode('edit');
  };

  const openDelete = (auth: Auth) => {
    setSelectedAuth(auth);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAuth(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: AuthCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedAuth!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedAuth) return;
    const success = await remove(selectedAuth.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: AuthGridRow[] = toAuthGridRows(auths, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Auths</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Auth
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<AuthGridRow>
        ref={gridieRef}
        id="auth-table"
        identityField="id"
        headers={ authHeaders }
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
        title={modalMode === 'create' ? 'Crear Auth' : 'Editar Auth'}
        size="md"
      >
        <AuthForm
          key={ selectedAuth?.id ?? 'new' }
          initialData={ selectedAuth }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </ModalX>

      {/* Modal Eliminar */}
      <AuthDeleteModal
        isOpen={modalMode === 'delete'}
        auth={ selectedAuth }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Auths;
