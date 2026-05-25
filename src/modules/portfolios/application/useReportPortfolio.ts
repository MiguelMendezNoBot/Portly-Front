// src/modules/portfolios/application/useReportPortfolio.ts
import { useState } from 'react';
import { HttpReportRepository } from '../infrastructure/repositories/HttpReportRepository';
import type { ReportSubmission } from '../domain/entities/ReportSubmission';

const repo = new HttpReportRepository();

export function useReportPortfolio() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (report: ReportSubmission) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await repo.submitReport(report);
    } catch (err: any) {
      setError(err.message || 'Error al enviar reporte');
      throw err; // permite al modal manejarlo
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error, setError };
}