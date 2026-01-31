import React, { useState, useRef, useCallback, useMemo } from 'react';
import type {
  TemplateVisualizerProps,
  SignatureField
} from '../../types/template.types';
import { compileTemplate, extractVariables } from '../../utils/hbsCompiler';
import { exportElementToPDF } from '../..//utils/pdfExporter';
import SignatureModal from './SignatureModal';
import './TemplateVisualizer.css';

/**
 * Componente Template Visualizer
 *
 * Renderiza templates Handlebars con datos reales
 * y maneja el flujo de captura de firmas digitales
 */
export default function TemplateVisualizer({
  template,
  data,
  onComplete,
  onPrint,
  mode = 'interactive'
}: TemplateVisualizerProps) {
  const [currentSignatureField, setCurrentSignatureField] = useState<string | null>(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [capturedSignatures, setCapturedSignatures] = useState<Record<string, string>>({});

  const documentRef = useRef<HTMLDivElement>(null);

  const formatLabel = useCallback((varName: string): string => {
    return varName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  // Calcular campos de firma desde el template
  const signatures: SignatureField[] = useMemo(() => {
    const variables = extractVariables(template);
    const signatureVars = variables.filter(v =>
      v.toLowerCase().includes('firma') || v.toLowerCase().includes('signature')
    );

    return signatureVars.map(v => ({
      id: v,
      label: formatLabel(v),
      variableName: v,
      captured: !!capturedSignatures[v]
    }));
  }, [template, capturedSignatures, formatLabel]);

  // Compilar HTML del template
  const compiledHtml = useMemo(() => {
    try {
      const dataWithSignatures = { ...data, ...capturedSignatures };
      return compileTemplate(template, dataWithSignatures);
    } catch (error) {
      console.error('Error al compilar template:', error);
      return '';
    }
  }, [template, data, capturedSignatures]);

  // Determinar modo del visualizador
  const visualizerMode = useMemo(() => {
    const uncapturedSignatures = signatures.filter(s => !s.captured);
    if (uncapturedSignatures.length > 0 && mode === 'interactive') {
      return 'awaiting_signature';
    }
    return 'ready_to_print';
  }, [signatures, mode]);

  // Manejar click en campos de firma usando event delegation
  const handleDocumentClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'interactive') return;

    // Buscar si el click fue en un signature-placeholder o dentro de uno
    const target = event.target as HTMLElement;
    const signaturePlaceholder = target.closest('[data-signature-field]') as HTMLElement | null;

    if (signaturePlaceholder) {
      const fieldId = signaturePlaceholder.getAttribute('data-signature-field');
      if (fieldId) {
        // Permitir abrir el modal aunque ya tenga firma (para editar)
        setCurrentSignatureField(fieldId);
        setSignatureModalOpen(true);
      }
    }
  }, [mode]);

  const handleSignPhysical = () => {
    if (onPrint) {
      onPrint();
    } else {
      handlePrint();
    }
  };

  const handleSignatureCapture = (signatureData: string) => {
    if (!currentSignatureField) return;

    // Actualizar firmas capturadas
    const newCapturedSignatures = {
      ...capturedSignatures,
      [currentSignatureField]: signatureData
    };
    setCapturedSignatures(newCapturedSignatures);

    setSignatureModalOpen(false);
    setCurrentSignatureField(null);

    // Verificar si todas las firmas fueron capturadas
    const allCaptured = signatures.every(s =>
      s.id === currentSignatureField || s.captured
    );

    if (allCaptured && onComplete) {
      const updatedData = { ...data, ...newCapturedSignatures };
      onComplete(updatedData);
    }
  };

  const handlePrint = () => {
    if (documentRef.current) {
      exportElementToPDF(documentRef.current, {
        filename: 'documento.pdf'
      });
    }
  };

  const renderActions = () => {
    if (visualizerMode === 'awaiting_signature') {
      const uncapturedCount = signatures.filter(s => !s.captured).length;
      return (
        <div className="visualizer__actions">
          <div className="visualizer__signature-prompt">
            <p>Haga click en los campos de firma del documento para firmar digitalmente</p>
            {uncapturedCount > 0 && (
              <p className="visualizer__signature-count">
                Firmas pendientes: {uncapturedCount}
              </p>
            )}
          </div>
          <div className="visualizer__buttons">
            <button
              className="visualizer__btn visualizer__btn--secondary"
              onClick={handleSignPhysical}
            >
              Imprimir para Firmar en Fisico
            </button>
          </div>
        </div>
      );
    }

    if (visualizerMode === 'ready_to_print') {
      return (
        <div className="visualizer__actions">
          <button
            className="visualizer__btn visualizer__btn--primary"
            onClick={handlePrint}
          >
            Imprimir / Exportar PDF
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="template-visualizer">
      <div className="visualizer__document" ref={documentRef} onClick={handleDocumentClick}>
        <div dangerouslySetInnerHTML={{ __html: compiledHtml }} />
      </div>

      {mode === 'interactive' && renderActions()}

      {signatureModalOpen && currentSignatureField && (
        <SignatureModal
          title={formatLabel(currentSignatureField)}
          onCapture={handleSignatureCapture}
          onClose={() => {
            setSignatureModalOpen(false);
            setCurrentSignatureField(null);
          }}
        />
      )}
    </div>
  );
}

// Re-exportar tipos
export type { TemplateVisualizerProps };
