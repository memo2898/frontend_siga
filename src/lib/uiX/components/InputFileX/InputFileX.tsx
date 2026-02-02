import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useFormXContext } from '../FormX/FormX.context';
import './InputFileX.css';

// SVG Icons inline (sin dependencias externas)
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const FileIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <path d="M13 2v7h7" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface InputFileXProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  accept?: string; // e.g., "image/*", ".pdf,.doc", etc.
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // en bytes (ej: 5 * 1024 * 1024 para 5MB)
  onChange?: (files: File[]) => void;
  onError?: (errors: string[]) => void;
  value?: File[];
  showPreview?: boolean; // Nueva prop para controlar si se muestra el preview interno
}

export const InputFileX: React.FC<InputFileXProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  helperText,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onChange,
  onError,
  value: controlledValue,
  showPreview = true, // Por defecto muestra el preview
}) => {
  const formContext = useFormXContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Determinar si es controlado o no
  const isControlled = controlledValue !== undefined;
  const files = isControlled ? controlledValue : internalFiles;

  // Función de validación que se registrará en FormX
  const validate = useCallback((currentFiles: File[]) => {
    const validationErrors: string[] = [];

    if (required && currentFiles.length === 0) {
      validationErrors.push('Este campo es requerido');
    }

    return {
      name,
      value: currentFiles,
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  }, [required, name]);

  // Registrar el campo en FormX
  useEffect(() => {
    if (formContext) {
      formContext.registerField({
        name,
        getValue: () => files,
        validate: () => validate(files),
        setError: (newErrors: string[]) => {
          setErrors(newErrors);
        },
        clearError: () => {
          setErrors([]);
        },
      });

      return () => {
        formContext.unregisterField(name);
      };
    }
  }, [formContext, name, files, validate]);

  // Validar archivos
  const validateFiles = useCallback((fileList: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileList.forEach((file) => {
      // Validar cantidad máxima
      if (!multiple && validFiles.length >= 1) {
        newErrors.push('Solo se permite un archivo');
        return;
      }
      if (multiple && files.length + validFiles.length >= maxFiles) {
        newErrors.push(`Máximo ${maxFiles} archivos permitidos`);
        return;
      }

      // Validar tamaño
      if (file.size > maxSize) {
        newErrors.push(`${file.name}: excede el tamaño máximo (${formatFileSize(maxSize)})`);
        return;
      }

      // Validar tipo de archivo
      if (accept) {
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const fileMimeType = file.type;

        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase();
          }
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return fileMimeType.startsWith(category + '/');
          }
          return fileMimeType === type;
        });

        if (!isAccepted) {
          newErrors.push(`${file.name}: tipo de archivo no permitido`);
          return;
        }
      }

      validFiles.push(file);
    });

    return { valid: validFiles, errors: newErrors };
  }, [accept, files.length, maxFiles, maxSize, multiple]);

  // Procesar archivos seleccionados
  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const fileArray = Array.from(fileList);
    const { valid, errors: validationErrors } = validateFiles(fileArray);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      onError?.(validationErrors);
      return;
    }

    setErrors([]);

    // Si es controlado, solo notificar via onChange
    if (isControlled) {
      onChange?.(valid);
    } else {
      // Si no es controlado, manejar estado interno
      // Crear previews para imágenes
      const filesWithPreview: FileWithPreview[] = valid.map((file) => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.id = Math.random().toString(36).substring(7);

        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }

        return fileWithPreview;
      });

      const newFiles = multiple ? [...internalFiles, ...filesWithPreview] : filesWithPreview;
      setInternalFiles(newFiles);
      onChange?.(newFiles);
      
      // Notificar a FormX
      if (formContext) {
        formContext.notifyChange(name);
      }
    }
  }, [internalFiles, multiple, name, onChange, onError, validateFiles, formContext, isControlled]);

  // Eliminar archivo - solo para modo no controlado
  const removeFile = useCallback((fileId: string) => {
    if (isControlled) {
      // En modo controlado, esto no debería llamarse
      console.warn('removeFile called on controlled InputFileX');
      return;
    }

    const newFiles = internalFiles.filter(f => f.id !== fileId);
    
    // Limpiar URL de preview
    const fileToRemove = internalFiles.find(f => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setInternalFiles(newFiles);
    onChange?.(newFiles);
    
    // Notificar a FormX
    if (formContext) {
      formContext.notifyChange(name);
    }
  }, [internalFiles, name, onChange, formContext, isControlled]);

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const { files: droppedFiles } = e.dataTransfer;
    handleFiles(droppedFiles);
  };

  // Click handler
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  // Cleanup previews on unmount - solo para modo no controlado
  useEffect(() => {
    if (!isControlled) {
      return () => {
        internalFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }
  }, [internalFiles, isControlled]);

  // Convertir files controlados a FileWithPreview para el preview
  const filesForPreview = useMemo(() => {
    if (!isControlled) return internalFiles;
    
    return files.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      if (!fileWithPreview.id) {
        fileWithPreview.id = Math.random().toString(36).substring(7);
      }
      // No crear previews aquí si es controlado - el componente padre maneja eso
      return fileWithPreview;
    });
  }, [files, internalFiles, isControlled]);

  return (
    <div className="inputfilex-container">
      {label && (
        <label className={`inputfilex-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        className={`inputfilex-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${errors.length > 0 ? 'error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        <div className="inputfilex-dropzone-content">
          <UploadIcon />
          <div className="inputfilex-dropzone-text">
            <span className="inputfilex-dropzone-primary">
              Click para seleccionar
            </span>
            <span className="inputfilex-dropzone-secondary">
              o arrastra archivos aquí
            </span>
          </div>
          {accept && (
            <span className="inputfilex-dropzone-hint">
              {getAcceptLabel(accept)}
            </span>
          )}
        </div>
      </div>

      {/* Files Preview - Solo mostrar si showPreview es true Y no es controlado */}
      {showPreview && !isControlled && filesForPreview.length > 0 && (
        <div className="inputfilex-files">
          {filesForPreview.map((file) => (
            <div key={file.id} className="inputfilex-file">
              <div className="inputfilex-file-preview">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} />
                ) : file.type.startsWith('image/') ? (
                  <ImageIcon />
                ) : (
                  <FileIcon />
                )}
              </div>
              <div className="inputfilex-file-info">
                <span className="inputfilex-file-name">{file.name}</span>
                <span className="inputfilex-file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="inputfilex-file-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                disabled={disabled}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="inputfilex-error">
          <AlertIcon />
          <ul className="inputfilex-error-list">
            {errors.map((error, index) => (
              <li key={index} className="inputfilex-error-item">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !errors.length && (
        <div className="inputfilex-helper">{helperText}</div>
      )}
    </div>
  );
};

// Utilidades
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getAcceptLabel(accept: string): string {
  if (accept.includes('image/*')) return 'Imágenes';
  if (accept.includes('.pdf')) return 'PDF';
  if (accept.includes('video/*')) return 'Videos';
  return 'Archivos permitidos: ' + accept;
}