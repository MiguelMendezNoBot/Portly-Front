export interface ReportSubmission {
  portfolioId: string | number;
  reason: string;
  description?: string;
  reportedBy?: string; // anónimo por defecto
}