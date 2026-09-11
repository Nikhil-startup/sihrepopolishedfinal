import { apiClient } from '@/lib/apiClient';

export interface AdminMetrics {
  totalUsers: number;
  totalProduceListings: number;
  totalOrders: number;
  grossTransactionValue: number;
  escrowLockedValue: number;
  activeFleetVehicles: number;
  activeDispatchedTrips: number;
  apmcTrackedFeeds: number;
  verifiedReviews: number;
  data_source: string;
}

export const adminService = {
  /**
   * Fetch live SQL aggregated metrics across Neon PostgreSQL tables.
   */
  async getMetrics(): Promise<AdminMetrics> {
    return apiClient.get<AdminMetrics>('/api/admin/metrics');
  }
};
