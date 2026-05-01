import { Template } from '../../domain/entities/Template';
import { TemplateRepository } from '../../domain/repositories/TemplateRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

/**
 * Normaliza una plantilla que viene del backend.
 * Asegura que campos opcionales nulos no rompan los componentes.
 */
function normalizeTemplate(raw: any): Template {
  // Manejar el caso de que el schema venga como string JSON desde el backend
  let schemaObj = raw?.schema;
  if (typeof schemaObj === 'string') {
    try {
      schemaObj = JSON.parse(schemaObj);
    } catch (e) {
      schemaObj = null;
    }
  }

  // Manejar el caso de que tags venga como string o lista de objetos/strings
  let parsedTags: string[] = [];
  if (Array.isArray(raw?.tags)) {
    parsedTags = raw.tags.map((t: any) => {
      if (typeof t === 'string') return t;
      if (t && typeof t === 'object') return t.nombre || t.name || JSON.stringify(t);
      return String(t);
    }).filter(Boolean);
  } else if (typeof raw?.tags === 'string') {
    parsedTags = raw.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  return {
    id: String(raw?.id ?? ''),
    nombre: raw?.nombre ?? 'Sin nombre',
    descripcion: raw?.descripcion ?? '',
    tags: parsedTags,
    previewImageUrl: raw?.previewImageUrl ?? raw?.urlVistaPrevia ?? raw?.url_vista_previa ?? '',
    previewUrl: raw?.previewUrl ?? raw?.urlVistaPrevia ?? '',
    stats: {
      // Buscar en raw.stats o directamente en raw (soporte para estructura plana)
      secciones: raw?.stats?.secciones ?? raw?.secciones ?? 0,
      impacto: raw?.stats?.impacto ?? raw?.impacto ?? '—',
      tiempoConfiguracion: raw?.stats?.tiempoConfiguracion ?? raw?.tiempoConfiguracion ?? '—',
    },
    schema: schemaObj
      ? {
          // Si colorScheme es un objeto (personalizado), lo marcamos como 'custom' 
          // para la lógica de temas, o usamos su nombre si lo tiene.
          colorScheme: typeof schemaObj.colorScheme === 'string' 
            ? schemaObj.colorScheme 
            : (schemaObj.colorScheme?.name || 'custom'),
          fontFamily: schemaObj.fontFamily ?? 'Inter',
          sections: Array.isArray(schemaObj.sections)
            ? schemaObj.sections
                .filter((s: any) => s !== null && s !== undefined)
                .map((s: any, idx: number) => ({
                  type: s?.type ?? `section-${idx}`,
                  title: s?.title ?? '',
                  visible: s?.visible ?? true,
                  order: s?.order ?? idx,
                }))
            : [],
        }
      : {
          colorScheme: 'dark',
          fontFamily: 'Inter',
          sections: [],
        },
  };
}

export class HttpTemplateRepository implements TemplateRepository {
  private readonly PATH = '/api/plantillas';

  async getAll(): Promise<Template[]> {
    // GET /api/plantillas — endpoint real del backend
    // El PlantillaController no requiere autenticación, pero usamos getAuth
    // para enviar el token si el Spring Security lo requiere globalmente.
    const raw = await httpClient.getAuth<any[]>(
      this.PATH,
      'No se pudieron cargar las plantillas'
    );

    // Normalizar cada plantilla para manejar campos nulos del backend
    return raw.map(normalizeTemplate);
  }
}
