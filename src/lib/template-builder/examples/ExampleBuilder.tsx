import { TemplateBuilder } from "../components";
import type { Template, VariableGroupsMap } from "../types/template.types";

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

function ExampleBuilder() {

  const handleSave = (template: Template, hbsContent: string) => {
    console.log('Template guardado:', template);
    console.log('Contenido HBS generado:', hbsContent);

    // IMPORTANTE: Guarda AMBOS en el servidor
    // - template: para poder editar después
    // - hbsContent: para renderizar con Handlebars
  };

  return (
    <TemplateBuilder
      variableGroups={variableGroups}
      onSave={handleSave}
      // initialTemplate={templateFromServer}  // Descomenta para editar
    />
  )
}

export default ExampleBuilder