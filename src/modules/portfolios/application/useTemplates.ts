import { useState, useEffect, useCallback } from 'react';
import { Template } from '../domain/entities/Template';
import { TemplateRepository } from '../domain/repositories/TemplateRepository';
import { HttpTemplateRepository } from '../infrastructure/repositories/HttpTemplateRepository';

const repository: TemplateRepository = new HttpTemplateRepository();

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ALLOWED_IDS = new Set(['template-tercera-brutalist', 'template-corporate-blue']);
      const data = await repository.getAll();
      setTemplates(data.filter(t => ALLOWED_IDS.has(t.id)));
    } catch (err: any) {
      setError(err?.message || 'Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, loading, error, reload: fetchTemplates };
}
