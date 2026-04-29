import React, { useState } from 'react';

// Mock Data
const initialPortfolios = [
  {
    id: '1',
    title: 'Diseño UX/UI',
    status: 'PÚBLICO',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'Fotografía de Producto',
    status: 'PRIVADO',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'Brand Identity - Tech',
    status: 'PÚBLICO',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=500&auto=format&fit=crop&q=60',
  },
];

const templates = [
  {
    id: 't1',
    name: 'Minimalist Zen',
    previewUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&auto=format&fit=crop&q=60',
    description: 'Una plantilla enfocada en la tipografía, ideal para diseñadores que buscan un estilo sobrio pero impactante. Utiliza espacios negativos y contrastes profundos.',
    tags: ['Creativo', 'Moderno', 'Limpio'],
    stats: [
      { label: 'Estructura', value: '8 secciones', sub: 'Dinámicas' },
      { label: 'Impacto', value: '1.2k', sub: 'Visualizaciones' },
      { label: 'Tiempo', value: '2 min', sub: 'Configuración' },
    ],
  },
  {
    id: 't2',
    name: 'Tech Curator',
    previewUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Diseño oscuro y elegante, perfecto para desarrolladores de software y especialistas en tecnología.',
    tags: ['Tech', 'Oscuro', 'Profesional'],
    stats: [
      { label: 'Estructura', value: '5 secciones', sub: 'Modulares' },
      { label: 'Impacto', value: '800', sub: 'Visualizaciones' },
      { label: 'Tiempo', value: '3 min', sub: 'Configuración' },
    ],
  },
  {
    id: 't3',
    name: 'Vibrant Artist',
    previewUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Colores vibrantes y diseño asimétrico para destacar obras de arte, ilustraciones y proyectos creativos.',
    tags: ['Colorido', 'Arte', 'Audaz'],
    stats: [
      { label: 'Estructura', value: '10 secciones', sub: 'Fluidas' },
      { label: 'Impacto', value: '2.5k', sub: 'Visualizaciones' },
      { label: 'Tiempo', value: '5 min', sub: 'Configuración' },
    ],
  },
];

export default function PortfoliosPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [portfolios, setPortfolios] = useState(initialPortfolios);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleCreatePortfolio = () => {
    const newPortfolio = {
      id: Date.now().toString(),
      title: `Nuevo Portafolio (${selectedTemplate.name})`,
      status: 'PRIVADO',
      imageUrl: selectedTemplate.previewUrl,
    };
    setPortfolios([newPortfolio, ...portfolios]);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter(p => p.id !== id));
  };

  return (
    <div className="w-full h-full text-white bg-[#0f111a] flex flex-col pt-8 pb-10 px-10 gap-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-dm-sans mb-1">Mis portafolios</h1>
          <p className="text-src-a7aab9 text-sm font-inter">
            Puedes visualizar tus portafolios creados, editarlos y crear nuevos
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-src-8781fa/20 hover:bg-src-8781fa/30 text-src-8781fa w-10 h-10 rounded-full flex items-center justify-center transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
          </button>
          <button className="bg-src-8781fa/20 hover:bg-src-8781fa/30 text-src-8781fa w-10 h-10 rounded-full flex items-center justify-center transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* COLUMNA IZQUIERDA: Tus portafolios */}
        <div className="w-1/3 bg-[#171B28] rounded-[24px] p-6 flex flex-col gap-6 h-full border border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-dm-sans">Tus portafolios</h2>
            <span className="text-sm text-src-a7aab9">({portfolios.length})</span>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 flex flex-col gap-4">
            {portfolios.map((portfolio) => (
              <div 
                key={portfolio.id}
                className="bg-[#0f111a] hover:bg-[#1a1c29] border border-white/5 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={portfolio.imageUrl} 
                      alt={portfolio.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-semibold text-sm text-white font-inter">{portfolio.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white inline-flex w-max tracking-wide ${
                      portfolio.status === 'PÚBLICO' ? 'bg-src-7c6bec/20 text-src-7c6bec' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {portfolio.status}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeletePortfolio(portfolio.id)}
                  className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 hover:text-red-400 transition-all mr-2"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                  <span className="text-[10px] font-medium">Eliminar</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Crear nuevo portafolio */}
        <div className="w-2/3 bg-[#171B28] rounded-[24px] p-6 flex flex-col h-full border border-white/5">
          <h2 className="text-2xl font-bold font-dm-sans mb-6">Crear nuevo portafolio</h2>
          
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold font-dm-sans text-white">Galería de plantillas</h3>
            <span className="text-[10px] bg-white/10 text-white/70 px-2 py-1 rounded font-bold tracking-wide">
              {templates.length} DISPONIBLES
            </span>
          </div>

          <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
            
            {/* Lista de plantillas (Izquierda) */}
            <div className="w-1/3 overflow-y-auto scrollbar-thin pr-2 flex flex-col gap-4">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group bg-[#0f111a] ${
                    selectedTemplateId === template.id 
                      ? 'border-src-7c6bec shadow-[0_0_15px_rgba(124,107,236,0.3)]' 
                      : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img 
                      src={template.previewUrl} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className={`p-3 text-sm font-medium ${selectedTemplateId === template.id ? 'text-src-7c6bec' : 'text-src-a7aab9'}`}>
                    {template.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Previa de Plantilla (Derecha) */}
            <div className="w-2/3 bg-[#0f111a] rounded-[20px] p-5 flex flex-col h-full border border-white/5 overflow-y-auto scrollbar-thin">
              
              <div className="w-full h-8 bg-[#171B28] rounded-t-lg border-b border-white/5 flex items-center px-4 mb-4 relative shrink-0">
                <div className="flex gap-1.5 absolute left-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="w-full text-center text-[10px] text-white/30 font-mono tracking-wider">
                  preview.portfolio.ai/{selectedTemplate.name.toLowerCase().replace(' ', '-')}
                </div>
              </div>

              <div className="w-full aspect-[16/9] bg-src-1a1c29 rounded-lg overflow-hidden mb-6 shrink-0 border border-white/5 relative group">
                <img 
                  src={selectedTemplate.previewUrl} 
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    Ver pantalla completa
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 font-dm-sans">{selectedTemplate.name}</h3>
                <p className="text-sm text-src-a7aab9 mb-4 font-inter leading-relaxed">
                  {selectedTemplate.description}
                </p>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {selectedTemplate.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-[11px] font-semibold tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {selectedTemplate.stats.map((stat, i) => (
                    <div key={i} className="bg-[#171B28] rounded-xl p-3 flex flex-col justify-center border border-white/5">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">{stat.label}</span>
                      <span className="text-sm font-bold text-white mb-0.5">{stat.value}</span>
                      <span className="text-[10px] text-src-7c6bec font-semibold">{stat.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={handleCreatePortfolio}
                    className="w-full bg-src-7c6bec hover:bg-src-6c63ff text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_14px_rgba(124,107,236,0.39)] hover:shadow-[0_6px_20px_rgba(124,107,236,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>CREAR CON ESTA PLANTILLA</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
