src/
│
├── app/                    # Configuración global
│   ├── router/             # React Router
│   ├── store/              # Estado global (Zustand/Redux)
│   ├── providers/          # Providers globales
│   ├── layouts/            # Layouts base
│   └── config/             # Constantes y settings
│
├── core/                   # Infraestructura reutilizable
│   ├── ui/                 # Componentes UI base (InputX, Modal, Table)
│   ├── hooks/              # Hooks genéricos
│   ├── services/           # HTTP, interceptores
│   ├── utils/              # Helpers
│   └── types/              # Tipos compartidos
│
├── features/               # DOMINIOS DEL NEGOCIO
│   ├── auth/
│   ├── assets/
│   ├── categories/
│   ├── transactions/
│   └── users/
│
├── pages/                  # Entradas de rutas
│
├── shared/                 # Cosas compartidas no core
│
├── main.tsx
└── env.d.ts
