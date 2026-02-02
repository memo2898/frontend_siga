import { useState, useMemo } from 'react';
import type { Categorias } from '../../../categorias/categorias.types';
import './Components.css';

interface CategoriasListProps {
  categorias: Categorias[];
  loading: boolean;
  categoriaSeleccionada: Categorias | null;
  onSelectCategoria: (categoria: Categorias) => void;
  getActivosCount: (categoriaId: number) => number;
}

export function CategoriasList({
  categorias,
  loading,
  categoriaSeleccionada,
  onSelectCategoria,
  getActivosCount,
}: CategoriasListProps) {
  const [filtro, setFiltro] = useState('');

  // Ordenar alfabéticamente y filtrar
  const categoriasFiltradas = useMemo(() => {
    // Primero ordenar alfabéticamente
    const ordenadas = [...categorias].sort((a, b) => {
      const nombreA = (a.nombre || '').toLowerCase();
      const nombreB = (b.nombre || '').toLowerCase();
      return nombreA.localeCompare(nombreB, 'es');
    });

    // Si no hay filtro, devolver todas ordenadas
    if (!filtro.trim()) {
      return ordenadas;
    }

    // Filtrar por nombre o descripción
    const termino = filtro.toLowerCase().trim();
    return ordenadas.filter(
      (cat) =>
        cat.nombre?.toLowerCase().includes(termino) ||
        cat.descripcion?.toLowerCase().includes(termino)
    );
  }, [categorias, filtro]);

  if (loading) {
    return (
      <div className="categorias-list">
        <div className="categorias-list-header">
          <span className="categorias-list-title">Categorias</span>
        </div>
        <div className="categorias-list-loading">Cargando categorias...</div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="categorias-list">
        <div className="categorias-list-header">
          <span className="categorias-list-title">Categorias</span>
        </div>
        <div className="categorias-list-empty">No hay categorias disponibles</div>
      </div>
    );
  }

  return (
    <div className="categorias-list">
      <div className="categorias-list-header">
        <span className="categorias-list-title">Categorias</span>
        <span className="categorias-list-count">{categorias.length}</span>
      </div>

      {/* Input de búsqueda */}
      <div className="categorias-list-search">
        <div className="categorias-search-input-wrapper">
          <svg
            className="categorias-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="categorias-search-input"
            placeholder="Buscar categoria..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          {filtro && (
            <button
              type="button"
              className="categorias-search-clear"
              onClick={() => setFiltro('')}
              title="Limpiar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="categorias-list-items">
        {categoriasFiltradas.length === 0 ? (
          <div className="categorias-list-no-results">
            No se encontraron categorias con "{filtro}"
          </div>
        ) : (
          categoriasFiltradas.map((categoria) => {
            const isSelected = categoriaSeleccionada?.id === categoria.id;
            const count = categoria.id ? getActivosCount(categoria.id) : 0;

            return (
              <button
                key={categoria.id}
                type="button"
                className={`categoria-item ${isSelected ? 'categoria-item--selected' : ''}`}
                onClick={() => onSelectCategoria(categoria)}
              >
                <div className="categoria-item-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="categoria-item-content">
                  <span className="categoria-item-nombre">{categoria.nombre}</span>
                  {categoria.descripcion && (
                    <span className="categoria-item-descripcion">{categoria.descripcion}</span>
                  )}
                </div>
                <span className="categoria-item-badge">{count}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
