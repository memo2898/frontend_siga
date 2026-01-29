import { useState, useRef, useEffect } from 'react';
import { GridieReact } from '../../lib/gridie-react';
import type { GridieRef, GridiePageChangeEvent } from '../../lib/gridie-react';
import { ModalX } from '../../lib/uiX/components/ModalX';

import { usePersonas } from './hooks/usePersonas';
import { PersonasForm } from './components/PersonasForm';
import { PersonasDeleteModal } from './components/PersonasDeleteModal';
import { personasHeaders } from './datatable_config/personas.headers';
import { toPersonasGridRows } from './datatable_config/personas.body';
import type { Personas, PersonasGridRow, PersonasCreateDTO } from './personas.types';
import './components/PersonasForm.css';

type ModalMode = 'create' | 'edit' | 'delete' | null;

function Personas() {
  const gridieRef = useRef<GridieRef>(null);

  const { personas, meta, loading, saving, paginated, fetch, create, update, remove, departamentosOptions } = usePersonas();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<Personas | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  // ========== MODAL HANDLERS ==========
  const openCreate = () => {
    setSelectedPersonas(null);
    setModalMode('create');
  };

  const openEdit = (personas: Personas) => {
    setSelectedPersonas(personas);
    setModalMode('edit');
  };

  const openDelete = (personas: Personas) => {
    setSelectedPersonas(personas);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPersonas(null);
  };

  // ========== CRUD HANDLERS ==========
  const handleSubmit = async (data: PersonasCreateDTO) => {
    const success = modalMode === 'create'
      ? await create(data)
      : await update(selectedPersonas!.id, data);

    if (success) closeModal();
  };

  const handleDelete = async () => {
    if (!selectedPersonas) return;
    const success = await remove(selectedPersonas.id);
    if (success) closeModal();
  };

  // ========== GRID ==========
  const handlePageChange = (event: GridiePageChangeEvent) => {
    if (paginated) {
      fetch(event.page, event.pageSize);
    }
  };

  const gridRows: PersonasGridRow[] = toPersonasGridRows(personas, {
    onEdit: openEdit,
    onDelete: openDelete,
  });

  // ========== RENDER ==========
  return (
    <div style={ { padding: 20 } }>
      {/* Header */}
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } }>
        <h1 style={ { margin: 0 } }>Personas</h1>
        <button onClick={openCreate} className="btn btn-success">
          + Nuevo Personas
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Cargando...</p>}

      {/* Grid */}
      <GridieReact<PersonasGridRow>
        ref={gridieRef}
        id="personas-table"
        identityField="id"
        headers={ personasHeaders }
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
        title={modalMode === 'create' ? 'Crear Personas' : 'Editar Personas'}
        size="md"
      >
        <PersonasForm
          key={ selectedPersonas?.id ?? 'new' }
          initialData={ selectedPersonas }
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          // Opciones para foreign keys
          departamentosOptions={ departamentosOptions }
        />
      </ModalX>

      {/* Modal Eliminar */}
      <PersonasDeleteModal
        isOpen={modalMode === 'delete'}
        personas={ selectedPersonas }
        loading={saving}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Personas;
