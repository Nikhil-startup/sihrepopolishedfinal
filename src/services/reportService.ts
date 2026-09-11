import { CreateReportPayload, ReportEntity } from '@/types/review';
import { apiClient } from '@/lib/apiClient';

export const reportService = {
  /**
   * Submit an incident or violation report directly to Neon PostgreSQL.
   */
  async submitReport(payload: CreateReportPayload): Promise<{ success: boolean; reportId?: string; status?: string; message?: string; error?: string }> {
    try {
      const res = await apiClient.post<any>('/api/reports', payload);
      return {
        success: true,
        reportId: res.reportId,
        status: res.status,
        message: 'Your report has been recorded in the verified safety registry.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to submit report. Please try again.',
      };
    }
  },

  /**
   * Fetch submitted reports by user from PostgreSQL.
   */
  async getMyReports(userId: string): Promise<ReportEntity[]> {
    try {
      return await apiClient.get<ReportEntity[]>(`/api/reports?userId=${encodeURIComponent(userId)}`);
    } catch {
      return [];
    }
  },
};
