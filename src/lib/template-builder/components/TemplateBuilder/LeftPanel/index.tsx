import type { VariableSchemaMap, VariableGroupsMap, TemplateElement } from '../../../types/template.types';
import ElementsTab from './ElementsTab';
import VariablesTab from './VariablesTab';
import './LeftPanel.css';

export interface LeftPanelProps {
  activeTab: 'elements' | 'variables';
  onTabChange: (tab: 'elements' | 'variables') => void;
  variableSchema?: VariableSchemaMap;
  variableGroups?: VariableGroupsMap;
  onAddElement: (element: TemplateElement) => void;
}

export default function LeftPanel({
  activeTab,
  onTabChange,
  variableSchema,
  variableGroups,
  onAddElement
}: LeftPanelProps) {
  return (
    <div className="left-panel">
      <div className="left-panel__tabs">
        <button
          className={`left-panel__tab ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => onTabChange('elements')}
        >
          Elementos
        </button>
        <button
          className={`left-panel__tab ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => onTabChange('variables')}
        >
          Variables
        </button>
      </div>

      <div className="left-panel__content">
        {activeTab === 'elements' ? (
          <ElementsTab onAddElement={onAddElement} />
        ) : (
          <VariablesTab variableSchema={variableSchema} variableGroups={variableGroups} />
        )}
      </div>
    </div>
  );
}
