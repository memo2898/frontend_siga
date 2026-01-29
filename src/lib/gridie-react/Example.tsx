/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Ejemplo de uso de GridieReact
 * 
 * Este archivo muestra cómo usar el wrapper en un proyecto React
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GridieReact } from './index';
import type { GridieRef, GridieHeaderConfig, GridiePageChangeEvent } from './index';

// ============================================================================
// TIPOS
// ============================================================================

interface Employee {
  employeeId: string;
  fullName: string;
  department: string;
  salary: number;
  city: string;
  hireDate: string;
  age: number;
  active: boolean;
  performance: number;
}

interface GridieActionCell {
  content: string;
  event: string;
  funct: () => void;
}

interface EmployeeGridRow {
  employeeId: string;
  fullName: string;
  department: string;
  salary: number;
  city: string;
  hireDate: string;
  age: number;
  status: GridieActionCell[];
  actions: GridieActionCell[];
}
// ============================================================================
// DATOS DE EJEMPLO
// ============================================================================

function generateEmployees(count: number): Employee[] {
  const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance'];
  const cities = ['Santo Domingo', 'Santiago', 'La Vega', 'Puerto Plata'];
  const names = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];

  return Array.from({ length: count }, (_, i) => ({
    employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
    fullName: names[i % names.length],
    department: departments[i % departments.length],
    salary: Math.floor(Math.random() * 60000) + 30000,
    city: cities[i % cities.length],
    hireDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    age: Math.floor(Math.random() * 35) + 25,
    active: Math.random() > 0.2,
    performance: Math.floor(Math.random() * 5) + 1,
  }));
}

// ============================================================================
// COMPONENTE DE EJEMPLO
// ============================================================================

export function EmployeeTable() {
  // ========== STATE ==========
  const [employees, setEmployees] = useState<Employee[]>(() => generateEmployees(20));
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState({ page: 1, total: 10 });

  // ========== REF ==========
  const gridieRef = useRef<GridieRef>(null);

  // ========== HANDLERS ==========

  // ✅ Usar useCallback para evitar recrear funciones innecesariamente
  const handleView = useCallback((row: Employee) => {
    setSelectedEmployee(row);
    alert(`Ver empleado: ${row.fullName}`);
  }, []);

  const handleEdit = useCallback((row: Employee) => {
    const newSalary = prompt(`Editar salario de ${row.fullName}:`, String(row.salary));
    if (newSalary && !isNaN(Number(newSalary))) {
      // Usar el ref para actualizar via identityField
      const updated = gridieRef.current?.updateRowByIdentity(row.employeeId, {
        salary: Number(newSalary),
      });
      if (updated) {
        console.log('Empleado actualizado');
      }
    }
  }, []);

  const handleDelete = useCallback((row: Employee) => {
    if (confirm(`¿Eliminar a ${row.fullName}?`)) {
      gridieRef.current?.removeRowByIdentity(row.employeeId);
    }
  }, []);

  const handleToggleStatus = useCallback((row: Employee) => {
    gridieRef.current?.updateRowByIdentity(row.employeeId, {
      active: !row.active,
    });
  }, []);

  const handlePageChange = useCallback((event: GridiePageChangeEvent) => {
    setStats({
      page: event.page,
      total: event.totalItems,
    });
    console.log('Página cambiada:', event);
  }, []);

  // ========== HEADERS ==========

  // ✅ Usar useMemo para evitar recrear headers en cada render
  const headers = useMemo<(string | GridieHeaderConfig)[]>(
    () => [
      {
        label: 'ID',
        type: 'string' as const,
        sortable: true,
        width: '100px',
        filters: {
          filterRow: { visible: true, operators: ['contains', 'equals'] },
        },
      },
      {
        label: 'Nombre',
        type: 'string' as const,
        sortable: true,
        filters: {
          headerFilter: { visible: true, search: true, showCount: true },
          filterRow: { visible: true },
        },
      },
      {
        label: 'Departamento',
        type: 'string' as const,
        sortable: true,
        filters: {
          headerFilter: { visible: true, showCount: true },
        },
      },
      {
        label: 'Salario',
        type: 'number' as const,
        sortable: true,
        width: '120px',
        filters: {
          headerFilter: {
            visible: true,
            parameters: [
              { text: '< $40k', operator: '<' as const, value: 40000 },
              { text: '$40k - $60k', operator: 'between' as const, value: 40000, value2: 60000 },
              { text: '> $60k', operator: '>' as const, value: 60000 },
            ],
          },
          filterRow: { visible: true, operators: ['=', '<', '>', 'between'] },
        },
      },
      {
        label: 'Ciudad',
        type: 'string' as const,
        filters: {
          headerFilter: { visible: true, showCount: true },
        },
      },
      {
        label: 'Fecha Ingreso',
        type: 'date' as const,
        sortable: true,
        filters: {
          headerFilter: { visible: true, dateHierarchy: ['year', 'month'] },
        },
      },
      {
        label: 'Edad',
        type: 'number' as const,
        sortable: true,
        width: '80px',
      },
      {
        label: 'Estado',
        type: 'string' as const,
        width: '100px',
      },
      {
        label: 'Acciones',
        width: '150px',
      },
    ],
    []
  );

  // ========== BODY CON ACCIONES ==========

  // ✅ useMemo con dependencias correctas
  const bodyWithActions = useMemo<EmployeeGridRow[]>(
    () =>
      employees.map((emp) => ({
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        department: emp.department,
        salary: emp.salary,
        city: emp.city,
        hireDate: emp.hireDate,
        age: emp.age,
        // Columna "Estado" con HTML dinámico y evento
        status: [
          {
            content: emp.active
              ? '<span style="color: green; cursor: pointer;">🟢 Activo</span>'
              : '<span style="color: red; cursor: pointer;">🔴 Inactivo</span>',
            event: 'click',
            funct: () => handleToggleStatus(emp),
          },
        ],
        // Columna "Acciones" con múltiples botones
        actions: [
          {
            content:
              '<button style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px;">👁️</button>',
            event: 'click',
            funct: () => handleView(emp),
          },
          {
            content:
              '<button style="padding: 4px 8px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px;">✏️</button>',
            event: 'click',
            funct: () => handleEdit(emp),
          },
          {
            content:
              '<button style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑️</button>',
            event: 'click',
            funct: () => handleDelete(emp),
          },
        ],
      })),
    [employees, handleView, handleEdit, handleDelete, handleToggleStatus]
  );

  // ========== ACCIONES EXTERNAS ==========

  const handleAddEmployee = () => {
    console.log('agregando nuevo')
  // Usar timestamp + random para ID único
  const newId = `EMP${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  const newEmployee: Employee = {
    employeeId: newId,
    fullName: 'Nuevo Empleado',
    department: 'IT',
    salary: 50000,
    city: 'Santo Domingo',
    hireDate: new Date().toISOString().split('T')[0],
    age: 30,
    active: true,
    performance: 3,
  };

  const newRow: EmployeeGridRow = {
    employeeId: newEmployee.employeeId,
    fullName: newEmployee.fullName,
    department: newEmployee.department,
    salary: newEmployee.salary,
    city: newEmployee.city,
    hireDate: newEmployee.hireDate,
    age: newEmployee.age,
    status: [
      {
        content: '<span style="color: green; cursor: pointer;">🟢 Activo</span>',
        event: 'click',
        funct: () => handleToggleStatus(newEmployee),
      },
    ],
    actions: [
      {
        content: '<button style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px;">👁️</button>',
        event: 'click',
        funct: () => handleView(newEmployee),
      },
      {
        content: '<button style="padding: 4px 8px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 4px;">✏️</button>',
        event: 'click',
        funct: () => handleEdit(newEmployee),
      },
      {
        content: '<button style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">🗑️</button>',
        event: 'click',
        funct: () => handleDelete(newEmployee),
      },
    ],
  };

  gridieRef.current?.addRow(newRow);
};

  const handleClearFilters = () => {
    gridieRef.current?.clearAllFilters();
  };

  const handleGoToPage = (page: number) => {
    gridieRef.current?.goToPage(page);
  };

  // ========== RENDER ==========

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tabla de Empleados</h1>

      {/* Controles */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleAddEmployee}>➕ Agregar Empleado</button>
        <button onClick={handleClearFilters}>🗑️ Limpiar Filtros</button>
        <button onClick={() => handleGoToPage(1)}>⏮️ Primera Página</button>
        <button onClick={() => gridieRef.current?.lastPage()}>⏭️ Última Página</button>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: '10px', color: '#666' }}>
        Página: {stats.page} | Total: {stats.total} empleados
      </div>

      {/* Tabla */}
      <GridieReact<EmployeeGridRow>
        ref={gridieRef}
        id="employee-table"
        identityField="employeeId"
        headers={headers}
        body={bodyWithActions}
        enableSort={true}
        enableFilter={true}
        language="es"
        paging={{
          enabled: true,
          pageSize: {
            visible: true,
            default: 10,
            options: [10, 25, 50, 100],
          },
          showInfo: true,
          navigation: {
            visible: true,
            showPrevNext: true,
            showFirstLast: true,
            maxButtons: 5,
            jumpTo: {
              visible: true,
              position: 'inline',
            },
          },
          position: 'bottom',
        }}
        onPageChange={handlePageChange}
      />

      {/* Modal de empleado seleccionado */}
      {selectedEmployee && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <strong>Último seleccionado:</strong>
          <br />
          {selectedEmployee.fullName} ({selectedEmployee.employeeId})
          <br />
          <button onClick={() => setSelectedEmployee(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;