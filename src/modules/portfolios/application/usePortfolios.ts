import { useState, useEffect, useCallback } from 'react';
import { Portfolio, CreatePortfolioDto, UpdateVisibilidadDto } from '../domain/entities/Portfolio';
import { PortfolioRepository } from '../domain/repositories/PortfolioRepository';
import { HttpPortfolioRepository } from '../infrastructure/repositories/HttpPortfolioRepository';

const repository: PortfolioRepository = new HttpPortfolioRepository();

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repository.getAll();
      setPortfolios(data);
    } catch (err: any) {
      // Si el backend no existe aún, lista vacía silenciosamente
      setPortfolios([]);
      console.warn('No se pudieron cargar portafolios:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const createPortfolio = useCallback(
    async (dto: CreatePortfolioDto): Promise<Portfolio> => {
      setCreating(true);
      try {
        const newPortfolio = await repository.create(dto);
        setPortfolios((prev) => [newPortfolio, ...prev]);
        return newPortfolio;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  const deletePortfolio = useCallback(async (id: string) => {
    await repository.delete(id);
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateVisibilidad = useCallback(
    async (id: string, dto: UpdateVisibilidadDto): Promise<Portfolio> => {
      const updated = await repository.updateVisibilidad(id, dto);
      setPortfolios((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      return updated;
    },
    []
  );

  return {
    portfolios,
    loading,
    error,
    creating,
    reload: fetchPortfolios,
    createPortfolio,
    deletePortfolio,
    updateVisibilidad,
  };
}
