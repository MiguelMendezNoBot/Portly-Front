// src/modules/admin/applications/useAdminComplaint.ts

import { useState, useEffect, useCallback } from 'react';
import { ComplaintGroup } from '../domain/entities/Complaint';
import { HttpAdminComplaintRepository } from '../infrastructure/repositories/HttpAdminComplaintRepository';

const repo = new HttpAdminComplaintRepository();

export function useAdminComplaint() {
  const [complaints, setComplaints] = useState<ComplaintGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.getAll();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar denuncias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  return { complaints, isLoading, error, reload: loadComplaints };
}