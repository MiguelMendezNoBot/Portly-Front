└── 📁src
├── main.tsx (El Componente Principal - el punto más sucio)
├── index.css
│
├── 📁core (Opcional: El centro de la arquitectura)
│ ├── 📁entities (Reglas de negocio críticas - ej. UserEntity.ts)
│ └── 📁use-cases (Lógica específica de la aplicación - ej. LoginUser.ts)
│
├── 📁modules (Organización por componentes de despliegue)
│ └── 📁auth
│ ├── 📁domain (Entidades y modelos de este módulo) (opcional)
│ ├── 📁application (Casos de uso e interfaces/puertos)
│ ├── 📁infrastructure (Adaptadores: implementaciones de Axios, Repositorios)
│ └── 📁presentation (El "Objeto Humilde": Componentes, Hooks de UI)
│ ├── 📁components
│ ├── 📁hooks (Lógica de presentación únicamente)
│ └── 📁pages
│
├── 📁shared (Lógica transversal y componentes genéricos)
│ ├── 📁components (Botones, Inputs base)
│ └── 📁utils (Funciones puras)
│
├── 📁infrastructure (Detalles técnicos globales)
│ ├── 📁http (Configuración de Axios - detalle externo)
│ └── 📁storage (TokenManager, Cookies - detalle externo)
│
└── 📁assets (Recursos estáticos)

---

└── 📁src
├── 📁entities
│ └── (Reglas de negocio críticas - p. ej., UserEntity.ts)
├── 📁use-cases
│ └── (Reglas de negocio de la aplicación - p. ej., LoginUser.ts)
├── 📁interface-adapters
│ ├── 📁controllers
│ │ └── (Manejo de entrada de la UI)
│ ├── 📁presenters
│ │ └── (Formateo de datos para la vista - ViewModels)
│ └── 📁gateways (Opcional)
│ └── (Interfaces/Puertos para el acceso a datos)
├── 📁frameworks-and-drivers
│ ├── 📁web (o 📁ui)
│ │ └── (Detalles de React: componentes, estilos Tailwind)
│ ├── 📁persistence
│ │ └── (Detalle de implementación: Axios, Fetch, LocalStorage)
│ └── 📁external-services (Opcional)
│ └── (Detalles de APIs de terceros)
├── 📁main
│ └── (El punto de entrada - Inyección de dependencias)
└── index.css (Detalle de bajo nivel)
