import { ReportSubmission } from '../../domain/entities/ReportSubmission';

const BASE_URL = import.meta.env.VITE_API_URL;

export class HttpReportRepository {
  async submitReport(report: ReportSubmission): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/public/reportar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.message || 'Error al enviar el reporte');
    }
  }
}
