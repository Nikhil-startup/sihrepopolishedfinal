import { Order, RoadLogisticsTracking } from "@/types/farmer";
import { apiClient } from "@/lib/apiClient";

export const trackingService = {
  /**
   * Fetch purchase orders from Neon PostgreSQL.
   */
  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/api/orders');
  },

  /**
   * Fetch road logistics telemetry details for a trip.
   */
  async getTrackingDetails(logisticsId: string): Promise<RoadLogisticsTracking | null> {
    try {
      return await apiClient.get<RoadLogisticsTracking>(`/api/logistics/trips/${encodeURIComponent(logisticsId)}`);
    } catch {
      return null;
    }
  }
};