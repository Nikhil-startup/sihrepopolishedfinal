import { AIRecommendation, DemandZone, ProducePool, SIHScenarioData } from "@/types/farmer";
import { apiClient } from "@/lib/apiClient";

export const aiService = {
  /**
   * Fetch harvest and sell recommendations from Backend Recommendation Engine.
   */
  async getRecommendations(): Promise<AIRecommendation[]> {
    return apiClient.get<AIRecommendation[]>('/api/intelligence/recommendations');
  },

  /**
   * Fetch regional demand zones aggregated in backend from orders and mandi volumes.
   */
  async getDemandZones(): Promise<DemandZone[]> {
    return apiClient.get<DemandZone[]>('/api/intelligence/demand-zones');
  },

  /**
   * Fetch FPO aggregation pools computed from active produce listings.
   */
  async getProducePools(): Promise<ProducePool[]> {
    return apiClient.get<ProducePool[]>('/api/intelligence/produce-pools');
  },

  /**
   * Fetch SIH hackathon benchmark scenario parameters for weather shock simulation.
   */
  async getSIHScenario(): Promise<SIHScenarioData> {
    return apiClient.get<SIHScenarioData>('/api/intelligence/sih-scenario');
  }
};