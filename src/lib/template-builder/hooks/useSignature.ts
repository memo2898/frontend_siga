import { useRef, useState, useCallback, useEffect } from 'react';

export interface UseSignatureReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  isEmpty: boolean;
  clear: () => void;
  getSignatureData: () => string | null;
  setSignatureData: (data: string) => void;
}

export interface SignatureOptions {
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
}

/**
 * Hook para manejar la captura de firma en canvas
 */
export function useSignature(options: SignatureOptions = {}): UseSignatureReturn {
  const {
    strokeColor = '#000000',
    strokeWidth = 2,
    backgroundColor = '#ffffff'
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [strokeColor, strokeWidth, backgroundColor]);

  // Obtener coordenadas del evento (escaladas al tamaño interno del canvas)
  const getCoordinates = useCallback((event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return null;
    }

    // Escalar coordenadas al tamaño interno del canvas
    // (el canvas puede tener un tamaño CSS diferente al tamaño interno)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  // Iniciar dibujo
  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const coords = getCoordinates(event);
    if (!coords) return;

    setIsDrawing(true);
    lastPositionRef.current = coords;
  }, [getCoordinates]);

  // Dibujar
  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getCoordinates(event);
    if (!coords || !lastPositionRef.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPositionRef.current = coords;
    setIsEmpty(false);
  }, [isDrawing, getCoordinates]);

  // Terminar dibujo
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPositionRef.current = null;
  }, []);

  // Registrar event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleMouseLeave = () => stopDrawing();

    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  // Limpiar canvas
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }, [backgroundColor]);

  // Obtener datos de la firma como base64
  const getSignatureData = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return null;

    return canvas.toDataURL('image/png');
  }, [isEmpty]);

  // Establecer datos de firma desde base64
  const setSignatureData = useCallback((data: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setIsEmpty(false);
    };
    img.src = data;
  }, [backgroundColor]);

  return {
    canvasRef,
    isDrawing,
    isEmpty,
    clear,
    getSignatureData,
    setSignatureData
  };
}
