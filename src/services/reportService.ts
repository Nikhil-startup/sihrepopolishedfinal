import { CreateReportPayload, ReportEntity } from '@/types/review';
import { getStoredData, setStoredData } from '@/data/demoData';

const REPORTS_STORAGE_KEY = 'agriflow_reports_store';

export const reportService = {
  /**
   * Submit an incident or violation report
   */
  async submitReport(payload: CreateReportPayload): Promise<{ success: boolean; reportId?: string; status?: string; message?: string; error?: string }> {
    try {
      const currentReports = getStoredData<ReportEntity[]>(REPORTS_STORAGE_KEY, []);
      const newReport: ReportEntity = {
        id: `REP-${Date.now().toString().slice(-6)}`,
        reporterUserId: payload.reporterUserId,
        reporterRole: payload.reporterRole,
        reporterDisplayName: payload.reporterDisplayName,
        reportedUserId: payload.reportedUserId,
        reportedRole: payload.reportedRole,
        reportType: payload.reportType,
        reason: payload.reason,
        description: payload.description?.trim(),
        transactionId: payload.transactionId,
        productId: payload.productId,
        orderItemId: payload.orderItemId,
        reviewId: payload.reviewId,
        status: 'UNDER_REVIEW',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      setStoredData(REPORTS_STORAGE_KEY, [newReport, ...currentReports]);

      return {
        success: true,
        reportId: newReport.id,
        status: newReport.status,
        message: 'Your report has been submitted and recorded in the demo safety registry.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to submit report. Please try again.',
      };
    }
  },

  /**
   * Fetch submitted reports by the current user
   */
  async getMyReports(userId: string): Promise<ReportEntity[]> {
    const currentReports = getStoredData<ReportEntity[]>(REPORTS_STORAGE_KEY, []);
    return currentReports.filter((r) => r.reporterUserId === userId);
  },
};
