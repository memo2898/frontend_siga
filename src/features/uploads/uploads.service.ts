import { SERVER_ROUTE } from '../../config';

const BASE = `${SERVER_ROUTE}/api/uploads`;

// Tipos de respuesta del servidor
export interface UploadedFile {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  folder: string;
  url: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  count: number;
  folder: string;
  files: UploadedFile[];
}

/**
 * Sube múltiples archivos
 * POST /api/uploads/files
 * @param files - Array de archivos a subir
 * @param folder - Carpeta destino (opcional, ej: "templates/123")
 */
export const uploadFiles = async (files: File[], folder?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(`${BASE}/files`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading files: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Sube una sola imagen
 * POST /api/uploads/image
 * @param image - Archivo de imagen
 * @param folder - Carpeta destino (opcional)
 */
export const uploadImage = async (image: File, folder?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', image);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(`${BASE}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading image: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Obtiene la URL de un archivo por su path
 * GET /api/uploads/*
 * @param path - Ruta del archivo (soporta carpetas anidadas, ej: "folder/subfolder/file.png")
 */
export const getFileUrl = (path: string): string => {
  return `${BASE}/${path}`;
};

/**
 * Obtiene un archivo por su path
 * GET /api/uploads/*
 */
export const getFile = async (path: string): Promise<Blob> => {
  const response = await fetch(`${BASE}/${path}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Error getting file: ${response.statusText}`);
  }

  return response.blob();
};

/**
 * Elimina un archivo por su path
 * DELETE /api/uploads/*
 * @param path - Ruta del archivo (soporta carpetas anidadas)
 */
export const deleteFile = async (path: string): Promise<void> => {
  const response = await fetch(`${BASE}/${path}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting file: ${response.statusText}`);
  }
};

/**
 * Convierte un string base64 a File
 */
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Verifica si una URL es base64
 */
export function isBase64Image(url: string): boolean {
  return url.startsWith('data:image/');
}

/**
 * Verifica si una URL ya está subida al servidor
 */
export function isServerUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
