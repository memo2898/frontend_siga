interface CampoExtra {
    id: string;
    name: string;
    type: string;
    label: string;
    component: string;
}

// interface CamposExtraActivo {
//     campos: CampoExtra[];
// }

export function transformateCamposExtraActivo(camposExtra: CampoExtra[] | null | undefined): string {
    // Validar que camposExtra exista y sea un array
    if (!camposExtra || !Array.isArray(camposExtra)) {
        console.log('camposExtra inválido o sin campos:', camposExtra);
        return '';
    }

    // Mapear y unir los labels con comas
    const nombresCampos = camposExtra
        .map((campo: CampoExtra) => campo.label)
        .join(', ');
    

    return nombresCampos;
}