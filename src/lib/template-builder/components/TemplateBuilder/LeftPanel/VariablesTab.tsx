import { useState } from 'react';
import type { VariableSchemaMap, VariableGroupsMap, VariableSchema } from '../../../types/template.types';

export interface VariablesTabProps {
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
}

export default function VariablesTab({ variableSchema, variableGroups }: VariablesTabProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const hasGroups = variableGroups && Object.keys(variableGroups).length > 0;
  const hasSchema = variableSchema && Object.keys(variableSchema).length > 0;

  if (!hasGroups && !hasSchema) {
    return (
      <div className="variables-tab">
        <div className="variables-tab__empty">
          No hay variables definidas.
          <br />
          Pasa un <code>variableGroups</code> al componente para ver las variables disponibles.
        </div>
      </div>
    );
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const renderVariable = (key: string, schema: VariableSchema, groupKey?: string) => {
    const typeIcon = getTypeIcon(schema.type);
    const variablePath = groupKey ? `${groupKey}.${key}` : key;

    return (
      <div key={key} className="variable-item">
        <div className="variable-item__info">
          <span className="variable-item__icon">{typeIcon}</span>
          <span className="variable-item__name">{key}</span>
          <span className="variable-item__type">{schema.type}</span>
        </div>
        {schema.label && (
          <div className="variable-item__label">{schema.label}</div>
        )}
        <div className="variable-item__path">
          <code>{`{{${variablePath}}}`}</code>
        </div>
      </div>
    );
  };

  const renderGroup = (groupKey: string, group: { groupLabel: string; schema: Record<string, VariableSchema> }) => {
    const isExpanded = expandedGroups[groupKey] ?? false;
    const variableCount = Object.keys(group.schema).length;

    return (
      <div key={groupKey} className="variable-group">
        <button
          className={`variable-group__header ${isExpanded ? 'expanded' : ''}`}
          onClick={() => toggleGroup(groupKey)}
        >
          <span className="variable-group__arrow">{isExpanded ? '▼' : '▶'}</span>
          <span className="variable-group__label">{group.groupLabel}</span>
          <span className="variable-group__count">{variableCount}</span>
        </button>

        {isExpanded && (
          <div className="variable-group__content">
            <div className="variable-group__each-hint">
              <code>{`{{#each ${groupKey}}}...{{/each}}`}</code>
            </div>
            <div className="variable-group__variables">
              {Object.entries(group.schema).map(([key, schema]) =>
                renderVariable(key, schema, groupKey)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="variables-tab">
      <div className="variables-tab__header">
        <h3>Variables Disponibles</h3>
        <p className="variables-tab__hint">
          Usa <code>{'{{'}</code> en elementos de texto para autocompletar
        </p>
      </div>

      {/* Grupos de variables (acordeones) */}
      {hasGroups && (
        <div className="variables-tab__groups">
          {Object.entries(variableGroups).map(([groupKey, group]) =>
            renderGroup(groupKey, group)
          )}
        </div>
      )}

      {/* Variables simples (compatibilidad hacia atrás) */}
      {hasSchema && (
        <div className="variables-tab__list">
          {Object.entries(variableSchema).map(([key, schema]) =>
            renderVariable(key, schema)
          )}
        </div>
      )}
    </div>
  );
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    string: 'Aa',
    number: '#',
    date: 'D',
    boolean: '?',
    object: '{}',
    array: '[]',
    signature: 'S'
  };
  return icons[type] || '-';
}
