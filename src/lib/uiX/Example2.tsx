/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from "react";
import { FormX, InputX, SelectX, DynamicFieldsX, 
    type FormSubmitResult, type FormXRef, 
    type FieldDefinition, type SimpleField } from "./index";



// Opciones de ejemplo para Selects
const paisesOptions = [
    { value: "DO", label: "República Dominicana" },
    { value: "US", label: "Estados Unidos" },
    { value: "ES", label: "España" },
];

const coloresOptions = [
    { value: "negro", label: "Negro" },
    { value: "blanco", label: "Blanco" },
    { value: "azul", label: "Azul" },
    { value: "rojo", label: "Rojo" },
];

const estadoOptions = [
    { value: "nuevo", label: "Nuevo" },
    { value: "usado", label: "Usado" },
    { value: "reacondicionado", label: "Reacondicionado" },
];

const DynamicFieldsExample: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"define" | "follow" | "extend" | "none">("define");
    const formRef = useRef<FormXRef>(null);

    // ============================================
    // CONTRACT: DEFINE
    // Schema que el admin crea para la categoría "Celulares"
    // ============================================
    const [categorySchema, setCategorySchema] = useState<FieldDefinition[]>([
        {
            id: "1",
            component: "Input",
            name: "modelo",
            label: "Modelo del Dispositivo",
            type: "text",
            placeholder: "Ej: iPhone 15 Pro",
            rules: {
                validations: [
                    { type: "required", message: "El modelo es obligatorio" },
                    { type: "minLength", value: 2, message: "Mínimo 2 caracteres" },
                ],
            },
        },
        {
            id: "2",
            component: "Input",
            name: "imei",
            label: "IMEI",
            type: "text",
            placeholder: "123456789012345",
            helperText: "15 dígitos",
            rules: {
                validations: [
                    { type: "required", message: "El IMEI es obligatorio" },
                    { type: "minLength", value: 15, message: "IMEI debe tener 15 dígitos" },
                    { type: "maxLength", value: 15, message: "IMEI debe tener 15 dígitos" },
                ],
                restrictions: [{ type: "onlyNumbers" }],
            },
        },
        {
            id: "3",
            component: "Select",
            name: "color",
            label: "Color",
            placeholder: "Seleccione un color",
            options: "coloresOptions", 
            rules: {
                validations: [
                    { type: "required", message: "Debe seleccionar un color" },
                ],
            },
        },
        {
            id: "4",
            component: "Select",
            name: "estado",
            label: "Estado",
            placeholder: "Seleccione el estado",
            //Option Type string no es assignable con SelectXOption[]
            options: "estadoOptions",
            rules: {
                validations: [
                    { type: "required", message: "Debe seleccionar el estado" },
                ],
            },
        },
        {
            id: "5",
            component: "Input",
            name: "precio",
            label: "Precio (USD)",
            type: "number",
            placeholder: "999.99",
            rules: {
                validations: [
                    { type: "required", message: "El precio es obligatorio" },
                    { type: "min", value: 1, message: "El precio debe ser mayor a 0" },
                ],
            },
        },
    ]);

    // ============================================
    // CONTRACT: FOLLOW
    // Usuario llena los datos siguiendo el schema
    // ============================================
    const [followData, setFollowData] = useState<Record<string, any>>({});

    // ============================================
    // CONTRACT: EXTEND
    // Usuario llena schema + puede agregar campos extras
    // ============================================
    const [extendData, setExtendData] = useState<Record<string, any>>({});
    const [extendExtras, setExtendExtras] = useState<SimpleField[]>([]);

    // ============================================
    // CONTRACT: NONE
    // Campos completamente libres
    // ============================================
    const [noneFields, setNoneFields] = useState<SimpleField[]>([
        {
            id: "f1",
            name: "serial",
            label: "Número de Serie",
            value: "SN-ABC-12345",
            input_type: "text",
        },
        {
            id: "f2",
            name: "notas",
            label: "Notas Adicionales",
            value: "Producto en excelente estado",
            //inputtype no existe en SimpleField
            input_type: "text",
        },
    ]);

    // ============================================
    // OPTIONS RESOLVERS
    // Para resolver las opciones dinámicamente en follow/extend
    // ============================================
    const optionsResolvers = {
        coloresOptions,
        estadoOptions,
        paisesOptions,
    };

    // ============================================
    // HANDLERS
    // ============================================
    const handleSubmit = (result: FormSubmitResult) => {
        console.log("=== Form Submitted ===");
        console.log("Active Tab:", activeTab);
        console.log("General Validation:", result.general_validation);
        console.log("Body:", result.body);
        console.log("Validation Results:", result.validations_results);

        if (result.general_validation) {
            alert(`Formulario "${activeTab}" válido!\n\nRevisa la consola para ver los datos.`);
        } else {
            alert("❌ Hay errores en el formulario.");
        }
    };

    const handleReset = () => {
        formRef.current?.reset();

        // Reset según el tab activo
        switch (activeTab) {
            case "follow":
                setFollowData({});
                break;
            case "extend":
                setExtendData({});
                setExtendExtras([]);
                break;
            case "none":
                setNoneFields([]);
                break;
        }
    };

    // ============================================
    // RENDER TAB CONTENT
    // ============================================
    const renderTabContent = () => {
        switch (activeTab) {
            case "define":
                return (
                    <div>
                        <div style={{
                            background: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24
                        }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#0369a1", fontSize: 16 }}>
                                📋 Modo: Definir Schema (Admin)
                            </h3>
                            <p style={{ margin: 0, fontSize: 14, color: "#0c4a6e" }}>
                                Crea el schema/contrato que los usuarios deberán seguir al crear productos en esta categoría.
                                Define los campos, tipos de input y validaciones.
                            </p>
                        </div>

                        <DynamicFieldsX
                            name="categorySchema"
                            contract="define"
                            value={categorySchema}
                            onChange={setCategorySchema}
                            label="Schema de Especificaciones - Categoría: Celulares"
                        />

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "#fafafa",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "monospace"
                        }}>
                            <strong>Schema generado ({categorySchema.length} campos):</strong>
                            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(categorySchema, null, 2)}
                            </pre>
                        </div>
                    </div>
                );

            case "follow":
                return (
                    <div>
                        <div style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24
                        }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#15803d", fontSize: 16 }}>
                                ✏️ Modo: Seguir Schema (Usuario)
                            </h3>
                            <p style={{ margin: 0, fontSize: 14, color: "#14532d" }}>
                                Completa los campos definidos en el schema. No puedes agregar campos adicionales.
                                Las validaciones se aplican automáticamente.
                            </p>
                        </div>

                        <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
                            <DynamicFieldsX
                                name="productData"
                                contract="follow"
                                schema={categorySchema}
                                value={followData}
                                onChange={setFollowData}
                                optionsResolvers={optionsResolvers}
                                label="Datos del Producto"
                            />

                            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                                <button
                                    data-submitx
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#16a34a",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        fontSize: 16,
                                        cursor: "pointer",
                                    }}
                                >
                                    Crear Producto
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
                                    Limpiar
                                </button>
                            </div>
                        </FormX>

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "#fafafa",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "monospace"
                        }}>
                            <strong>Datos capturados:</strong>
                            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(followData, null, 2)}
                            </pre>
                        </div>
                    </div>
                );

            case "extend":
                return (
                    <div>
                        <div style={{
                            background: "#fef3c7",
                            border: "1px solid #fde68a",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24
                        }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#b45309", fontSize: 16 }}>
                                ➕ Modo: Extender Schema (Usuario Avanzado)
                            </h3>
                            <p style={{ margin: 0, fontSize: 14, color: "#78350f" }}>
                                Completa los campos del schema y agrega campos personalizados adicionales si lo necesitas.
                                Los campos del schema tienen validaciones, los extras son opcionales.
                            </p>
                        </div>

                        <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
                            <DynamicFieldsX
                                name="productDataExtend"
                                contract="extend"
                                schema={categorySchema}
                                value={extendData}
                                onChange={setExtendData}
                                extraFields={extendExtras}
                                onExtraFieldsChange={setExtendExtras}
                                optionsResolvers={optionsResolvers}
                                label="Datos del Producto (con campos personalizados)"
                            />

                            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                                <button
                                    data-submitx
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#d97706",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        fontSize: 16,
                                        cursor: "pointer",
                                    }}
                                >
                                    Crear Producto
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
                                    Limpiar
                                </button>
                            </div>
                        </FormX>

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "#fafafa",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "monospace"
                        }}>
                            <strong>Datos del schema:</strong>
                            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(extendData, null, 2)}
                            </pre>
                            <strong style={{ display: "block", marginTop: 16 }}>Campos extras ({extendExtras.length}):</strong>
                            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(extendExtras, null, 2)}
                            </pre>
                        </div>
                    </div>
                );

            case "none":
                return (
                    <div>
                        <div style={{
                            background: "#fce7f3",
                            border: "1px solid #fbcfe8",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24
                        }}>
                            <h3 style={{ margin: "0 0 8px 0", color: "#be185d", fontSize: 16 }}>
                                🆓 Modo: Campos Libres (Sin Schema)
                            </h3>
                            <p style={{ margin: 0, fontSize: 14, color: "#831843" }}>
                                Crea campos completamente personalizados sin restricciones ni schema previo.
                                Ideal para productos únicos o situaciones especiales.
                            </p>
                        </div>

                        <FormX ref={formRef} onSubmit={handleSubmit} validateOn="blur">
                            <DynamicFieldsX
                                name="freeFields"
                                contract="none"
                                value={noneFields}
                                onChange={setNoneFields}
                                label="Campos Personalizados"
                            />

                            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                                <button
                                    data-submitx
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#db2777",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        fontSize: 16,
                                        cursor: "pointer",
                                    }}
                                >
                                    Guardar Datos
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
                                    Limpiar
                                </button>
                            </div>
                        </FormX>

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "#fafafa",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "monospace"
                        }}>
                            <strong>Campos libres ({noneFields.length}):</strong>
                            <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(noneFields, null, 2)}
                            </pre>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ margin: "0 0 8px 0", fontSize: 32 }}>uiX - DynamicFieldsX</h1>
                <p style={{ margin: 0, color: "#6b7280", fontSize: 16 }}>
                    Componente para manejar campos dinámicos con 4 contratos diferentes
                </p>
            </div>

            {/* TABS */}
            <div style={{
                display: "flex",
                gap: 8,
                marginBottom: 32,
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: 0,
            }}>
                {[
                    { key: "define", label: "📋 Define", color: "#0284c7" },
                    { key: "follow", label: "✏️ Follow", color: "#16a34a" },
                    { key: "extend", label: "➕ Extend", color: "#d97706" },
                    { key: "none", label: "🆓 None", color: "#db2777" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        style={{
                            padding: "12px 24px",
                            border: "none",
                            borderBottom: activeTab === tab.key ? `3px solid ${tab.color}` : "3px solid transparent",
                            background: activeTab === tab.key ? "#f9fafb" : "transparent",
                            color: activeTab === tab.key ? tab.color : "#6b7280",
                            cursor: "pointer",
                            fontSize: 15,
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            transition: "all 0.2s",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div style={{ marginTop: 24 }}>
                {renderTabContent()}
            </div>

            {/* FOOTER INFO */}
            <div style={{
                marginTop: 48,
                padding: 20,
                background: "#f9fafb",
                borderRadius: 8,
                borderLeft: "4px solid #3b82f6"
            }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: 16 }}>💡 Resumen de Contratos:</h4>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, fontSize: 14 }}>
                    <li><strong>define:</strong> Admin crea el schema con validaciones completas</li>
                    <li><strong>follow:</strong> Usuario llena campos según el schema (sin agregar extras)</li>
                    <li><strong>extend:</strong> Usuario llena schema + puede agregar campos personalizados</li>
                    <li><strong>none:</strong> Campos completamente libres sin schema previo</li>
                </ul>
            </div>
        </div>
    );
};

export default DynamicFieldsExample;