import { useSignature } from '../../hooks/useSignature';
import './SignatureModal.css';

export interface SignatureModalProps {
  title: string;
  onCapture: (signatureData: string) => void;
  onClose: () => void;
}

export default function SignatureModal({ title, onCapture, onClose }: SignatureModalProps) {
  const { canvasRef, isEmpty, clear, getSignatureData } = useSignature({
    strokeColor: '#000000',
    strokeWidth: 2,
    backgroundColor: '#ffffff'
  });

  const handleAccept = () => {
    const data = getSignatureData();
    if (data) {
      onCapture(data);
    } else {
      alert('Por favor, firme antes de aceptar');
    }
  };

  return (
    <div className="signature-modal-overlay" onClick={onClose}>
      <div className="signature-modal" onClick={e => e.stopPropagation()}>
        <div className="signature-modal__header">
          <h3>{title}</h3>
          <button className="signature-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="signature-modal__body">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="signature-modal__canvas"
          />
        </div>

        <div className="signature-modal__footer">
          <button
            className="signature-modal__btn signature-modal__btn--secondary"
            onClick={clear}
            disabled={isEmpty}
          >
            🗑️ Limpiar
          </button>
          <button
            className="signature-modal__btn signature-modal__btn--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="signature-modal__btn signature-modal__btn--primary"
            onClick={handleAccept}
            disabled={isEmpty}
          >
            ✓ Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
