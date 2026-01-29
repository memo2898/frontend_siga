// ============================================
// uiX - Usage Example
// ============================================

import React, { useRef } from "react";
import { FormX, InputX, SelectX, InputFileX, type FormSubmitResult, type FormXRef } from "./index";

const ExampleForm: React.FC = () => {
  const formRef = useRef<FormXRef>(null);

  const handleSubmit = (result: FormSubmitResult) => {
    console.log(result)
    console.log("=== Form Submitted ===");
    console.log("General Validation:", result.general_validation);
    console.log("Body:", result.body);
    console.log("Validation Results:", result.validations_results);

    if (result.general_validation) {
      alert("¡Formulario válido! Revisa la consola.");
    } else {
      alert("Hay errores en el formulario.");
    }
  };

  const handleExternalSubmit = () => {
    formRef.current?.submit();
  };

  const handleReset = () => {
    formRef.current?.reset();
  };

  // Opciones para SelectX
  const paisesOptions = [
    { value: "DO", label: "República Dominicana" },
    { value: "US", label: "Estados Unidos" },
    { value: "ES", label: "España" },
    { value: "MX", label: "México" },
    { value: "CO", label: "Colombia" },
    { value: "AR", label: "Argentina" },
    { value: "PE", label: "Perú" },
    { value: "CL", label: "Chile" },
    { value: "VE", label: "Venezuela" },
    { value: "PR", label: "Puerto Rico" },
  ];

  const departamentoOptions = [
    { value: "TI", label: "Tecnología de la Información" },
    { value: "RH", label: "Recursos Humanos" },
    { value: "FIN", label: "Finanzas" },
    { value: "MKT", label: "Marketing" },
    { value: "OPS", label: "Operaciones" },
    { value: "LEG", label: "Legal" },
  ];

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h1>uiX - Demo Form</h1>

      <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
        {/* Email con validación */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="email"
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            rules={{
              validations: [
                { type: "required", message: "El correo es obligatorio" },
                { type: "email", message: "Ingrese un email válido" },
              ],
              restrictions: [{ type: "noSpaces" }],
              formatting: [{ type: "lowercase" }, { type: "trim" }],
            }}
          />
        </div>

        {/* Nombre con restricción de solo letras */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="nombre"
            label="Nombre Completo"
            placeholder="Juan Pérez"
            rules={{
              validations: [
                { type: "required" },
                { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
              ],
              restrictions: [{ type: "onlyLetters" }],
              formatting: [{ type: "capitalize" }],
            }}
          />
        </div>

        {/* SelectX - País con autocompletado */}
        <div style={{ marginBottom: 20 }}>
          <SelectX
            name="pais"
            label="País"
            placeholder="Buscar país..."
            options={paisesOptions}
            rules={{
              validations: [
                { type: "required", message: "Debe seleccionar un país" },
              ],
            }}
          />
        </div>

        {/* SelectX - Departamento con texto libre permitido */}
        <div style={{ marginBottom: 20 }}>
          <SelectX
            name="departamento"
            label="Departamento"
            placeholder="Buscar o escribir departamento..."
            options={departamentoOptions}
            allowFreeText={true}
            helperText="Puede seleccionar de la lista o escribir uno nuevo"
            rules={{
              validations: [
                { type: "required", message: "Debe indicar un departamento" },
              ],
            }}
          />
        </div>

        {/* Teléfono con formato automático */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="telefono"
            label="Teléfono"
            placeholder="(809) 555-1234"
            rules={{
              validations: [
                { type: "required" },
                { type: "minLength", value: 10, message: "Teléfono incompleto" },
              ],
              restrictions: [{ type: "onlyNumbers" }, { type: "maxChars", value: 10 }],
              formatting: [{ type: "phone", format: "(###) ###-####" }],
            }}
          />
        </div>

        {/* Cédula dominicana */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="cedula"
            label="Cédula"
            placeholder="001-1234567-8"
            rules={{
              validations: [
                { type: "required" },
                { type: "minLength", value: 11, message: "Cédula incompleta" },
              ],
              restrictions: [{ type: "onlyNumbers" }, { type: "maxChars", value: 11 }],
              formatting: [{ type: "cedula" }],
            }}
          />
        </div>

        {/* Edad con validación de rango */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="edad"
            label="Edad"
            type="number"
            placeholder="25"
            rules={{
              validations: [
                { type: "required" },
                { type: "min", value: 18, message: "Debe ser mayor de 18 años" },
                { type: "max", value: 100, message: "Edad no válida" },
              ],
              restrictions: [{ type: "onlyNumbers" }, { type: "maxChars", value: 3 }],
            }}
          />
        </div>

        {/* InputFileX - Foto de perfil (imagen única) */}
        <div style={{ marginBottom: 20 }}>
          <InputFileX
            name="fotoPerfil"
            label="Foto de Perfil"
            accept="image/*"
            required
            maxSize={2 * 1024 * 1024} // 2MB
            helperText="Solo imágenes, máximo 2MB"
            onChange={(files) => console.log("Foto de perfil:", files)}
          />
        </div>

        {/* InputFileX - Documentos múltiples */}
        <div style={{ marginBottom: 20 }}>
          <InputFileX
            name="documentos"
            label="Documentos de Identidad"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            maxFiles={3}
            maxSize={5 * 1024 * 1024} // 5MB
            helperText="Sube hasta 3 documentos (PDF o imágenes)"
            onChange={(files) => console.log("Documentos:", files)}
            onError={(errors) => console.error("Errores:", errors)}
          />
        </div>

        {/* InputFileX - Currículum (opcional) */}
        <div style={{ marginBottom: 20 }}>
          <InputFileX
            name="curriculum"
            label="Currículum Vitae (opcional)"
            accept=".pdf,.doc,.docx"
            maxSize={10 * 1024 * 1024} // 10MB
            helperText="Formatos: PDF, DOC, DOCX - Máximo 10MB"
          />
        </div>

        {/* Comentario con validación solo al submit */}
        <div style={{ marginBottom: 20 }}>
          <InputX
            name="comentario"
            label="Comentario (opcional)"
            placeholder="Escribe algo..."
            validateOn="submit"
            helperText="Este campo solo se valida al enviar"
            rules={{
              validations: [
                { type: "maxLength", value: 200, message: "Máximo 200 caracteres" },
              ],
            }}
          />
        </div>

        {/* Botón dentro del form con data-submitx */}
        <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
          <button
            data-submitx
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Enviar (data-submitx)
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </FormX>

      {/* Botón externo usando ref */}
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={handleExternalSubmit}
          style={{
            padding: "12px 24px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Enviar desde afuera (ref.submit())
        </button>
      </div>
    </div>
  );
};

export default ExampleForm;