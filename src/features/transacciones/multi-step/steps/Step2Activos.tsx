import { useState, useMemo, useCallback } from 'react';
import { useTransaccionWizardContext } from '../context/TransaccionWizardContext';
import { useCategoriasActivos } from '../hooks/useCategoriasActivos';
import {
  CategoriasList,
  ActivosGrid,
  NuevoActivoForm,
  ActivosSeleccionados,
  INITIAL_FORM_DATA,
} from '../components';
import type { NuevoActivoFormData } from '../components';
import type { Activos } from '../../../activos/activos.types';
import type { Categorias } from '../../../categorias/categorias.types';
import type { ActivoSeleccionado } from '../types';
import './Steps.css';

export function Step2Activos() {
  const { state, dispatch, isDevolucion } = useTransaccionWizardContext();
  const [showNuevoForm, setShowNuevoForm] = useState(false);

  // Estado de formularios por categoría (para persistir al cambiar)
  const [formDataPorCategoria, setFormDataPorCategoria] = useState<Map<number, NuevoActivoFormData>>(
    new Map()
  );
  const [currentFormData, setCurrentFormData] = useState<NuevoActivoFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const isEntrada = state.tipoTransaccion === 'ENTRADA';
  const isSalida = state.tipoTransaccion === 'SALIDA';
  const esDevolucion = isDevolucion();

  // Hook para categorías y activos
  const {
    categorias,
    categoriasLoading,
    categoriaSeleccionada,
    selectCategoria: selectCategoriaBase,
    activos,
    activosLoading,
    activosError,
    searchTerm,
    setSearchTerm,
    getActivosCountByCategoria,
  } = useCategoriasActivos({
    subtipoSalida: state.subtipoSalida,
    categoriasPermitidas: state.categoriasPermitidas,
  });

  // Función para cambiar de categoría guardando el estado del formulario
  const handleSelectCategoria = useCallback(
    (nuevaCategoria: Categorias | null) => {
      // Guardar estado actual si hay categoría seleccionada y el formulario tiene datos
      if (categoriaSeleccionada?.id && isEntrada) {
        const tieneData =
          currentFormData.marca ||
          currentFormData.modelo ||
          currentFormData.codigo_inventario_local ||
          Object.keys(currentFormData.atributos).length > 0;

        if (tieneData) {
          setFormDataPorCategoria((prev) => {
            const newMap = new Map(prev);
            newMap.set(categoriaSeleccionada.id!, { ...currentFormData });
            return newMap;
          });
        }
      }

      // Cargar estado guardado de la nueva categoría o resetear
      if (nuevaCategoria?.id) {
        const savedData = formDataPorCategoria.get(nuevaCategoria.id);
        setCurrentFormData(savedData || INITIAL_FORM_DATA);
      } else {
        setCurrentFormData(INITIAL_FORM_DATA);
      }

      setFormErrors([]);
      selectCategoriaBase(nuevaCategoria);
    },
    [categoriaSeleccionada, currentFormData, formDataPorCategoria, isEntrada, selectCategoriaBase]
  );

  // Set de IDs seleccionados para búsqueda rápida
  const selectedIds = useMemo<Set<number>>(() => {
    return new Set<number>(
      state.activosSeleccionados
        .filter((item) => item.activo.id !== undefined)
        .map((item) => item.activo.id as number)
    );
  }, [state.activosSeleccionados]);

  // Toggle selección de activo (para salidas)
  const handleToggleActivo = (activo: Activos) => {
    if (!activo.id) return;

    const isSelected = selectedIds.has(activo.id);

    if (isSelected) {
      const index = state.activosSeleccionados.findIndex(
        (item) => item.activo.id === activo.id
      );
      if (index !== -1) {
        dispatch({ type: 'REMOVE_ACTIVO', payload: index });
      }
    } else {
      const nuevoItem: ActivoSeleccionado = {
        activo,
        cantidad: activo.cantidad || 1,
        isNew: false,
      };
      dispatch({ type: 'ADD_ACTIVO', payload: nuevoItem });
    }
  };

  // Agregar activo nuevo (para entradas)
  const handleAgregarNuevoActivo = (activo: Partial<Activos>, categoriaId: number) => {
    const nuevoItem: ActivoSeleccionado = {
      activo: {
        ...activo,
        id: undefined,
        categoria_id: categoriaId,
      } as Activos,
      cantidad: activo.cantidad || 1,
      isNew: true,
    };
    dispatch({ type: 'ADD_ACTIVO', payload: nuevoItem });

    // Limpiar el estado guardado de esta categoría después de agregar
    setFormDataPorCategoria((prev) => {
      const newMap = new Map(prev);
      newMap.delete(categoriaId);
      return newMap;
    });
  };

  // Remover activo seleccionado
  const handleRemoveActivo = (index: number) => {
    dispatch({ type: 'REMOVE_ACTIVO', payload: index });
  };

  // Actualizar cantidad
  const handleUpdateCantidad = (index: number, cantidad: number) => {
    dispatch({
      type: 'UPDATE_ACTIVO',
      payload: { index, updates: { cantidad } },
    });
  };

  // Actualizar observación
  const handleUpdateObservacion = (index: number, observacion: string) => {
    dispatch({
      type: 'UPDATE_ACTIVO',
      payload: { index, updates: { observacion } },
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">
          {esDevolucion
            ? 'Activos a Devolver'
            : isEntrada
              ? 'Registro de Activos'
              : 'Selección de Activos'}
        </h2>
        <p className="step-description">
          {esDevolucion
            ? 'Revise los activos que serán devueltos'
            : isEntrada
              ? 'Registre los activos que ingresan al inventario'
              : 'Seleccione los activos que salen del inventario'}
        </p>
      </div>

      {/* ============================================ */}
      {/* MODO DEVOLUCIÓN: Solo mostrar activos pre-cargados */}
      {/* ============================================ */}
      {esDevolucion && (
        <div className="step-section">
          <ActivosSeleccionados
            activos={state.activosSeleccionados}
            onRemove={handleRemoveActivo}
            onUpdateCantidad={handleUpdateCantidad}
            readOnly={true}
          />
          {state.activosSeleccionados.length === 0 && (
            <div className="step-empty-message">
              No hay activos cargados para devolver
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* MODO SALIDA: Categorías + Grid de activos */}
      {/* ============================================ */}
      {isSalida && !esDevolucion && (
        <div className="step-section">
          <div className="step-activos-layout">
            {/* Panel izquierdo: Categorías */}
            <CategoriasList
              categorias={categorias}
              loading={categoriasLoading}
              categoriaSeleccionada={categoriaSeleccionada}
              onSelectCategoria={handleSelectCategoria}
              getActivosCount={getActivosCountByCategoria}
            />

            {/* Panel derecho: Grid de activos */}
            <ActivosGrid
              categoriaSeleccionada={categoriaSeleccionada}
              activos={activos}
              loading={activosLoading}
              error={activosError}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedIds={selectedIds}
              onToggleActivo={handleToggleActivo}
            />
          </div>

          {/* Activos seleccionados */}
          <ActivosSeleccionados
            activos={state.activosSeleccionados}
            onRemove={handleRemoveActivo}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdateObservacion={handleUpdateObservacion}
            showCategoria={true}
          />
        </div>
      )}

      {/* ============================================ */}
      {/* MODO ENTRADA: Categorías + Formulario nuevo activo */}
      {/* ============================================ */}
      {isEntrada && !esDevolucion && (
        <div className="step-section">
          <div className="step-activos-layout">
            {/* Panel izquierdo: Categorías */}
            <CategoriasList
              categorias={categorias}
              loading={categoriasLoading}
              categoriaSeleccionada={categoriaSeleccionada}
              onSelectCategoria={(cat) => {
                handleSelectCategoria(cat);
                setShowNuevoForm(true);
              }}
              getActivosCount={getActivosCountByCategoria}
            />

            {/* Panel derecho: Formulario de nuevo activo */}
            {showNuevoForm || categoriaSeleccionada ? (
              <NuevoActivoForm
                categoriaSeleccionada={categoriaSeleccionada}
                onAgregarActivo={handleAgregarNuevoActivo}
                onCancelar={() => {
                  setShowNuevoForm(false);
                  handleSelectCategoria(null);
                }}
                formData={currentFormData}
                onFormDataChange={setCurrentFormData}
                errors={formErrors}
                onErrorsChange={setFormErrors}
              />
            ) : (
              <div className="step-activos-placeholder">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <p>Selecciona una categoría para agregar un nuevo activo</p>
              </div>
            )}
          </div>

          {/* Activos agregados */}
          <ActivosSeleccionados
            activos={state.activosSeleccionados}
            onRemove={handleRemoveActivo}
            onUpdateCantidad={handleUpdateCantidad}
            onUpdateObservacion={handleUpdateObservacion}
            showCategoria={true}
          />
        </div>
      )}

      {/* Errores */}
      {state.errors['step_1'] && state.errors['step_1'].length > 0 && (
        <div className="step-errors">
          {state.errors['step_1'].map((error, index) => (
            <p key={index} className="step-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}