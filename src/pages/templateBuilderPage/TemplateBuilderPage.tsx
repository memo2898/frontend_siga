import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TemplateBuilder } from "../../lib/template-builder"
import type { Template, TemplateElement, ImageProperties, VariableGroupsMap } from "../../lib/template-builder/types/template.types";
import { createDefaultPageSize, createEmptyPage, generateId } from "../../lib/template-builder/utils/helpers";

import { getById, update } from "../../features/templatesinventarios/templatesinventarios.service";
import { uploadImage, base64ToFile, isBase64Image, isServerUrl } from "../../features/uploads/uploads.service";
import TemplateBuilderSkeleton from "./components/TemplateBuilderSkeleton";

/**
 * Normaliza un template para asegurar que tenga la estructura mínima requerida
 */
function normalizeTemplate(data: Partial<Template>): Template {
    return {
        id: data.id || generateId('template'),
        name: data.name || 'Template sin nombre',
        pageSize: data.pageSize || createDefaultPageSize(),
        pages: Array.isArray(data.pages) && data.pages.length > 0
            ? data.pages.map(page => ({
                id: page.id || generateId('page'),
                elements: Array.isArray(page.elements) ? page.elements : []
            }))
            : [createEmptyPage()]
    };
}

function TemplateBuilderPage() {
    const { id } = useParams<{ id: string }>(); // Captura el ID de la URL
   // const navigate = useNavigate();
    
    const [initialTemplate, setInitialTemplate] = useState<Template | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTemplate = async () => {
            // Si no hay ID, estamos creando un nuevo template
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Llamar al servicio para obtener el template
                const templateData = await getById(parseInt(id));

                // Si el template tiene variables_utilizadas guardadas, parseamos el JSON
                if (templateData?.variables_utilizadas) {
                    const rawTemplate = typeof templateData.variables_utilizadas === 'string'
                        ? JSON.parse(templateData.variables_utilizadas)
                        : templateData.variables_utilizadas;

                    // Normalizar para asegurar estructura válida
                    const savedTemplate = normalizeTemplate(rawTemplate);
                    setInitialTemplate(savedTemplate);
                }
            } catch (err) {
                console.error('Error cargando template:', err);
                setError('No se pudo cargar el template');
            } finally {
                setIsLoading(false);
            }
        };

        loadTemplate();
    }, [id]);






    // ============================================================
// SIMULACIÓN: Datos que vendrían del padre (tablas de BD)
// ============================================================

// Simulamos que el padre obtiene los schemas de sus tablas
// y los envía al builder como grupos de variables
const variableGroups: VariableGroupsMap = {
  clientes: {
    groupLabel: 'Clientes',
    schema: {
      nombre: { type: 'string', label: 'Nombre completo' },
      cedula: { type: 'string', label: 'Cédula / RIF' },
      email: { type: 'string', label: 'Correo electrónico' },
      telefono: { type: 'string', label: 'Teléfono' },
      direccion: { type: 'string', label: 'Dirección' }
    }
  },
  productos: {
    groupLabel: 'Productos',
    schema: {
      codigo: { type: 'string', label: 'Código' },
      descripcion: { type: 'string', label: 'Descripción' },
      precio: { type: 'number', label: 'Precio unitario' },
      cantidad: { type: 'number', label: 'Cantidad' },
      subtotal: { type: 'number', label: 'Subtotal' }
    }
  },
  empresa: {
    groupLabel: 'Empresa',
    schema: {
      razonSocial: { type: 'string', label: 'Razón social' },
      rif: { type: 'string', label: 'RIF' },
      direccionFiscal: { type: 'string', label: 'Dirección fiscal' },
      telefono: { type: 'string', label: 'Teléfono' },
      logo: { type: 'string', label: 'URL del logo' }
    }
  },
  factura: {
    groupLabel: 'Factura',
    schema: {
      numero: { type: 'string', label: 'Número de factura' },
      fecha: { type: 'date', label: 'Fecha de emisión' },
      fechaVencimiento: { type: 'date', label: 'Fecha de vencimiento' },
      subtotal: { type: 'number', label: 'Subtotal' },
      impuesto: { type: 'number', label: 'Impuesto (IVA)' },
      total: { type: 'number', label: 'Total a pagar' },
      observaciones: { type: 'string', label: 'Observaciones' }
    }
  },
  firmas: {
    groupLabel: 'Firmas',
    schema: {
      firmaCliente: { type: 'signature', label: 'Firma del cliente' },
      firmaVendedor: { type: 'signature', label: 'Firma del vendedor' }
    }
  }
};

// ============================================================
// EJEMPLO: Template existente para edición
// Descomenta esto cuando quieras cargar un template guardado
// ============================================================
// const templateFromServer: Template = {
//   id: "template-123",
//   name: "Mi Template",
//   pageSize: { format: "A4", width: 210, height: 297, orientation: "portrait" },
//   pages: [
//     {
//       id: "page-1",
//       elements: [
//         {
//           id: "elem-1",
//           type: "TEXT",
//           content: "Hola {{nombre}}",
//           position: { x: 0, y: 0 },
//           positionMode: "static",
//           styles: { fontSize: 16 },
//           order: 0
//         }
//       ]
//     }
//   ]
// };
    /**
     * Procesa el template para subir imágenes base64 al servidor
     * y reemplazar las URLs por las del servidor
     */
    const processTemplateImages = async (template: Template): Promise<Template> => {
        const processedTemplate = JSON.parse(JSON.stringify(template)) as Template;

        for (const page of processedTemplate.pages) {
            for (const element of page.elements) {
                if (element.type === 'IMAGE') {
                    const props = element.properties as ImageProperties;
                    const url = props?.url;

                    // Solo procesar si es base64 (no URLs del servidor)
                    if (url && isBase64Image(url) && !isServerUrl(url)) {
                        try {
                            // Generar nombre único para el archivo
                            const filename = `template_${id}_${element.id}_${Date.now()}.png`;
                            const file = base64ToFile(url, filename);

                            // Subir al servidor en carpeta de templates
                            const response = await uploadImage(file, `img_templates/inventario/template_${id}`);
                            console.log('Upload response:', response);

                            // Manejar diferentes estructuras de respuesta
                            let uploadedUrl: string | null = null;

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const res = response as any;

                            // Intentar extraer URL de diferentes estructuras posibles
                            if (res?.image?.url) {
                                // Estructura de uploadImage: { image: { url: "..." } }
                                uploadedUrl = res.image.url;
                            } else if (res?.files?.[0]?.url) {
                                // Estructura de uploadFiles: { files: [{ url: "..." }] }
                                uploadedUrl = res.files[0].url;
                            } else if (res?.file?.url) {
                                uploadedUrl = res.file.url;
                            } else if (res?.url) {
                                uploadedUrl = res.url;
                            } else if (typeof res === 'string' && res.startsWith('http')) {
                                uploadedUrl = res;
                            }

                            console.log('Extracted URL:', uploadedUrl);

                            if (uploadedUrl) {
                                (element.properties as ImageProperties).url = uploadedUrl;
                                console.log(`Imagen ${element.id} actualizada con URL: ${uploadedUrl}`);
                            } else {
                                console.warn(`No se pudo extraer URL de la respuesta para ${element.id}:`, JSON.stringify(res, null, 2));
                                // Limpiar la URL base64 para evitar payload grande
                                (element.properties as ImageProperties).url = '';
                            }
                        } catch (err) {
                            console.error(`Error subiendo imagen del elemento ${element.id}:`, err);
                            // Limpiar la URL base64 para evitar payload grande
                            (element.properties as ImageProperties).url = '';
                        }
                    }
                }
            }
        }

        return processedTemplate;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSave = async (template: Template, _hbsContent: string) => {
        if (!id) {
            console.error('No hay ID para actualizar');
            return;
        }

        try {
            // 1. Procesar imágenes: subir base64 al servidor
            const processedTemplate = await processTemplateImages(template);

            // 2. Regenerar HBS con las URLs actualizadas
            const { generateHandlebarsTemplate } = await import("../../lib/template-builder/utils/hbsGenerator");
            const updatedHbsContent = generateHandlebarsTemplate(processedTemplate);

            // 3. Guardar template con URLs del servidor
            const payload = {
                nombre: processedTemplate.name || '',
                contenido_hbs: updatedHbsContent,
                variables_utilizadas: JSON.stringify(processedTemplate),
            };

            await update(parseInt(id), payload);
            console.log('Template actualizado correctamente');
        } catch (err) {
            console.error('Error al guardar template:', err);
        }
    };
    
  if (isLoading) {
    return <TemplateBuilderSkeleton />;
  }

  return (
    <>
    <TemplateBuilder
       variableGroups={variableGroups}
       onSave={handleSave}
       initialTemplate={initialTemplate}
    />
    </>
  )
}

export default TemplateBuilderPage