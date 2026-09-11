import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { apiClient } from '@/lib/apiClient';

export const logisticsService = {
  /**
   * Fetch road logistics fleet vehicles from Neon PostgreSQL.
   */
  async getFleet(): Promise<LogisticsFleetVehicle[]> {
    return apiClient.get<LogisticsFleetVehicle[]>('/api/logistics/fleet');
  },

  /**
   * Fetch active consolidated highway trips from Neon PostgreSQL.
   */
  async getTrips(): Promise<ConsolidatedTrip[]> {
    return apiClient.get<ConsolidatedTrip[]>('/api/logistics/trips');
  },

  /**
   * Fetch single trip details by ID from Neon PostgreSQL.
   */
  async getTripById(id: string): Promise<ConsolidatedTrip | null> {
    try {
      return await apiClient.get<ConsolidatedTrip>(`/api/logistics/trips/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },

  /**
   * Claim backhaul return load in PostgreSQL to prevent empty deadhead miles.
   */
  async acceptReturnLoad(tripId: string, _returnLoadId?: string): Promise<boolean> {
    await apiClient.post('/api/logistics/return-loads/claim', { tripId });
    return true;
  }
};