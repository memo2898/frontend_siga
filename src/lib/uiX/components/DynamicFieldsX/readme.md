components/DynamicFieldsX/
├── DynamicFieldsX.tsx          # Componente principal
├── DynamicFieldsX.css          # Estilos
├── types.ts                    # Tipos e interfaces
├── index.ts                    # Exports
├── contracts/
│   ├── DefineContract.tsx      # Admin crea schema
│   ├── FollowContract.tsx      # Usuario llena schema
│   ├── ExtendContract.tsx      # Schema + extras
│   └── NoneContract.tsx        # Campos libres
└── components/
    ├── FieldCard.tsx           # Card de campo con drag
    ├── FieldMetadataForm.tsx   # Form para definir campo completo
    └── SimpleFieldForm.tsx     # Form para campo simple