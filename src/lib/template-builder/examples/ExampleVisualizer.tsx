import React from 'react'
import { TemplateVisualizer } from '../components'

// Template de ejemplo con variables Handlebars
const exampleTemplate = `

<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">

  <!-- ========== ENCABEZADO DE LA EMPRESA ========== -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin-bottom: 5px;">{{empresa}}</h1>
    <p style="color: #7f8c8d; margin: 0;">{{direccion}}</p>
    <p style="color: #7f8c8d; margin: 0;">Tel: {{telefono}} | Email: {{email}}</p>
  </div>
  <!-- ========== FIN ENCABEZADO ========== -->

  <hr style="border: none; border-top: 2px solid #3498db; margin: 20px 0;" />

  <!-- ========== TITULO Y DATOS DEL DOCUMENTO ========== -->
  <div style="margin-bottom: 20px;">
    <h2 style="color: #2c3e50; font-size: 18px;">CONTRATO DE SERVICIOS</h2>
    <p style="color: #7f8c8d; font-size: 14px;">Documento No: {{numeroContrato}}</p>
    <p style="color: #7f8c8d; font-size: 14px;">Fecha: {{fecha}}</p>
  </div>
  <!-- ========== FIN TITULO Y DATOS ========== -->

  <!-- ========== DATOS DEL CLIENTE (TABLA) ========== -->
  <div style="margin-bottom: 20px;">
    <h3 style="color: #34495e; font-size: 16px;">Datos del Cliente</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; width: 30%;"><strong>Nombre:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{cliente.nombre}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Identificación:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{cliente.identificacion}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Dirección:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{cliente.direccion}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Teléfono:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{cliente.telefono}}</td>
      </tr>
    </table>
  </div>
  <!-- ========== FIN DATOS DEL CLIENTE ========== -->

  <!-- ========== DESCRIPCION DEL SERVICIO ========== -->
  <div style="margin-bottom: 20px;">
    <h3 style="color: #34495e; font-size: 16px;">Descripción del Servicio</h3>
    <p style="text-align: justify; line-height: 1.6;">{{descripcionServicio}}</p>
  </div>
  <!-- ========== FIN DESCRIPCION ========== -->

  <!-- ========== CONDICIONES (LISTA ITERADA) ========== -->
  <div style="margin-bottom: 20px;">
    <h3 style="color: #34495e; font-size: 16px;">Condiciones</h3>
    <ul style="line-height: 1.8;">
      {{#each condiciones}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  <!-- ========== FIN CONDICIONES ========== -->

  <!-- ========== VALOR TOTAL ========== -->
  <div style="margin-bottom: 30px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
    <h3 style="color: #34495e; font-size: 16px; margin-top: 0;">Valor Total</h3>
    <p style="font-size: 24px; color: #27ae60; font-weight: bold; margin: 0;">{{valorTotal}}</p>
  </div>
  <!-- ========== FIN VALOR TOTAL ========== -->

  <!-- ========== SECCION DE FIRMAS ========== -->
  <div style="display: flex; justify-content: space-between; margin-top: 50px;">

    <!-- FIRMA DEL REPRESENTANTE -->
    <div style="text-align: center; width: 45%;">
      <!-- Campo de firma clickeable (data-signature-field es requerido para detectar el campo) -->
      <div class="signature-placeholder" data-signature-field="firma_representante">
        {{#if firma_representante}}
        <img src="{{firma_representante}}" alt="Firma Representante" style="max-width: 200px; max-height: 80px;" />
        {{else}}
        <span class="signature-placeholder__text">Click para firmar</span>
        {{/if}}
      </div>
      <!-- Linea y nombre debajo de la firma -->
      <div style="border-top: 1px solid #333; padding-top: 8px; margin-top: 5px;">
        <p style="margin: 0;"><strong>{{representante}}</strong></p>
        <p style="margin: 0; color: #7f8c8d; font-size: 12px;">Representante Legal</p>
      </div>
    </div>
    <!-- FIN FIRMA DEL REPRESENTANTE -->

    <!-- FIRMA DEL CLIENTE -->
    <div style="text-align: center; width: 45%;">
      <!-- Campo de firma clickeable (data-signature-field es requerido para detectar el campo) -->
      <div class="signature-placeholder" data-signature-field="firma_cliente">
        {{#if firma_cliente}}
        <img src="{{firma_cliente}}" alt="Firma Cliente" style="max-width: 200px; max-height: 80px;" />
        {{else}}
        <span class="signature-placeholder__text">Click para firmar</span>
        {{/if}}
      </div>
      <!-- Linea y nombre debajo de la firma -->
      <div style="border-top: 1px solid #333; padding-top: 8px; margin-top: 5px;">
        <p style="margin: 0;"><strong>{{cliente.nombre}}</strong></p>
        <p style="margin: 0; color: #7f8c8d; font-size: 12px;">Cliente</p>
      </div>
    </div>
    <!-- FIN FIRMA DEL CLIENTE -->

  </div>
  <!-- ========== FIN SECCION DE FIRMAS ========== -->

</div>
`;

// Datos de ejemplo para el template
const exampleData = {
  empresa: 'TechCorp Solutions S.A.',
  direccion: 'Av. Principal #123, Ciudad Empresarial',
  telefono: '+1 (555) 123-4567',
  email: 'contacto@techcorp.com',
  numeroContrato: 'CONT-2026-0042',
  fecha: '26 de Enero de 2026',
  cliente: {
    nombre: 'María García López',
    identificacion: '12345678-9',
    direccion: 'Calle Los Álamos #456, Sector Norte',
    telefono: '+1 (555) 987-6543'
  },
  descripcionServicio: 'Desarrollo e implementación de sistema de gestión empresarial personalizado, incluyendo módulos de inventario, facturación, recursos humanos y reportes analíticos. El servicio incluye capacitación del personal, soporte técnico por 12 meses y actualizaciones de seguridad.',
  condiciones: [
    'El plazo de entrega es de 90 días hábiles a partir de la firma del contrato.',
    'El pago se realizará en tres cuotas: 40% al inicio, 30% a mitad del proyecto y 30% a la entrega.',
    'Incluye garantía de funcionamiento por 12 meses.',
    'El soporte técnico estará disponible en horario laboral de lunes a viernes.'
  ],
  valorTotal: '$15,000.00 USD',
  representante: 'Carlos Rodríguez M.'
};

function ExampleVisualizer() {
  const handleComplete = (updatedData: Record<string, unknown>) => {
    console.log('Documento completado con datos:', updatedData);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', overflowY: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Vista Previa del Documento
      </h2>
      <TemplateVisualizer
        template={exampleTemplate}
        data={exampleData}
        onComplete={handleComplete}
        mode="interactive"
      />
    </div>
  )
}

export default ExampleVisualizer