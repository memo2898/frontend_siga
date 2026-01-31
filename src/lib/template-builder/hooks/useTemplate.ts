import { useState, useCallback } from 'react';
import type { Template, TemplateElement, TemplatePage, PageSize } from '../types/template.types';
import { createDefaultPageSize, createEmptyPage, generateId } from '../utils/helpers';

export interface UseTemplateReturn {
  template: Template;
  currentPageIndex: number;
  currentPage: TemplatePage | null;
  selectedElementId: string | null;

  // Acciones de página
  setCurrentPageIndex: (index: number) => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePageSize: (pageSize: Partial<PageSize>) => void;

  // Acciones de elemento
  addElement: (element: TemplateElement, pageIndex?: number) => void;
  updateElement: (elementId: string, updates: Partial<TemplateElement>) => void;
  removeElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  getSelectedElement: () => TemplateElement | null;

  // Acciones de orden
  reorderElements: (pageIndex: number, elements: TemplateElement[]) => void;

  // Acciones generales
  updateTemplate: (updates: Partial<Template>) => void;
  resetTemplate: () => void;
}

export function useTemplate(initialTemplate?: Template): UseTemplateReturn {
  const [template, setTemplate] = useState<Template>(() => {
    if (initialTemplate) return initialTemplate;

    return {
      id: generateId('template'),
      name: 'Nuevo Template',
      pageSize: createDefaultPageSize(),
      pages: [createEmptyPage()]
    };
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const currentPage = template.pages[currentPageIndex] || null;

  // Acciones de página
  const addPage = useCallback(() => {
    setTemplate(prev => ({
      ...prev,
      pages: [...prev.pages, createEmptyPage()]
    }));
  }, []);

  const removePage = useCallback((pageId: string) => {
    setTemplate(prev => {
      const newPages = prev.pages.filter(p => p.id !== pageId);
      // Asegurar que siempre haya al menos una página
      if (newPages.length === 0) {
        newPages.push(createEmptyPage());
      }
      return { ...prev, pages: newPages };
    });

    // Ajustar el índice actual si es necesario
    setCurrentPageIndex(prev => Math.min(prev, template.pages.length - 2));
  }, [template.pages.length]);

  const updatePageSize = useCallback((pageSizeUpdate: Partial<PageSize>) => {
    setTemplate(prev => ({
      ...prev,
      pageSize: { ...prev.pageSize, ...pageSizeUpdate }
    }));
  }, []);

  // Acciones de elemento
  const addElement = useCallback((element: TemplateElement, pageIndex?: number) => {
    const targetPageIndex = pageIndex !== undefined ? pageIndex : currentPageIndex;

    setTemplate(prev => {
      const newPages = [...prev.pages];
      const targetPage = newPages[targetPageIndex];

      if (!targetPage) return prev;

      // Asignar orden basado en el número de elementos existentes
      const elementWithOrder = {
        ...element,
        order: targetPage.elements.length
      };

      newPages[targetPageIndex] = {
        ...targetPage,
        elements: [...targetPage.elements, elementWithOrder]
      };

      return { ...prev, pages: newPages };
    });
  }, [currentPageIndex]);

  const updateElement = useCallback((elementId: string, updates: Partial<TemplateElement>) => {
    setTemplate(prev => {
      const newPages = prev.pages.map(page => ({
        ...page,
        elements: page.elements.map(el => {
          if (el.id !== elementId) return el;
          // Merge profundo para styles y properties
          return {
            ...el,
            ...updates,
            styles: updates.styles ? { ...el.styles, ...updates.styles } : el.styles,
            properties: updates.properties ? { ...(el.properties as object), ...updates.properties } : el.properties
          };
        })
      }));

      return { ...prev, pages: newPages };
    });
  }, []);

  const removeElement = useCallback((elementId: string) => {
    setTemplate(prev => {
      const newPages = prev.pages.map(page => ({
        ...page,
        elements: page.elements.filter(el => el.id !== elementId)
      }));

      return { ...prev, pages: newPages };
    });

    // Deseleccionar si era el elemento seleccionado
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  const getSelectedElement = useCallback((): TemplateElement | null => {
    if (!selectedElementId) return null;

    for (const page of template.pages) {
      const element = page.elements.find(el => el.id === selectedElementId);
      if (element) return element;
    }

    return null;
  }, [selectedElementId, template.pages]);

  // Acciones de orden
  const reorderElements = useCallback((pageIndex: number, elements: TemplateElement[]) => {
    setTemplate(prev => {
      const newPages = [...prev.pages];
      newPages[pageIndex] = {
        ...newPages[pageIndex],
        elements: elements.map((el, index) => ({ ...el, order: index }))
      };

      return { ...prev, pages: newPages };
    });
  }, []);

  // Acciones generales
  const updateTemplate = useCallback((updates: Partial<Template>) => {
    setTemplate(prev => ({ ...prev, ...updates }));
  }, []);

  const resetTemplate = useCallback(() => {
    setTemplate({
      id: generateId('template'),
      name: 'Nuevo Template',
      pageSize: createDefaultPageSize(),
      pages: [createEmptyPage()]
    });
    setCurrentPageIndex(0);
    setSelectedElementId(null);
  }, []);

  return {
    template,
    currentPageIndex,
    currentPage,
    selectedElementId,

    setCurrentPageIndex,
    addPage,
    removePage,
    updatePageSize,

    addElement,
    updateElement,
    removeElement,
    selectElement,
    getSelectedElement,

    reorderElements,

    updateTemplate,
    resetTemplate
  };
}
