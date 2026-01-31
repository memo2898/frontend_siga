import html2pdf from 'html2pdf.js';

export interface PDFExportOptions {
  filename?: string;
  margin?: number | number[];
  image?: { type: string; quality: number };
  html2canvas?: { scale: number };
  jsPDF?: { unit: string; format: string; orientation: string };
}

/**
 * Exporta HTML a PDF
 */
export async function exportToPDF(
  htmlContent: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const defaultOptions: PDFExportOptions = {
    filename: 'documento.pdf',
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // Crear un elemento temporal para el contenido
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.width = '210mm'; // A4 width

    await html2pdf()
      .set(finalOptions)
      .from(element)
      .save();
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw new Error('No se pudo exportar el PDF');
  }
}

/**
 * Exporta un elemento del DOM a PDF
 */
export async function exportElementToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const defaultOptions: PDFExportOptions = {
    filename: 'documento.pdf',
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    await html2pdf()
      .set(finalOptions)
      .from(element)
      .save();
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw new Error('No se pudo exportar el PDF');
  }
}

/**
 * Obtiene el blob del PDF sin descargarlo
 */
export async function getPDFBlob(
  htmlContent: string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  const defaultOptions: PDFExportOptions = {
    margin: 10,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.width = '210mm';

    const pdf = await html2pdf()
      .set(finalOptions)
      .from(element)
      .outputPdf('blob');

    return pdf;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error('No se pudo generar el PDF');
  }
}
