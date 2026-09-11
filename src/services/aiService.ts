import { AIRecommendation, DemandZone, ProducePool, SIHScenarioData } from "@/types/farmer";
import { mockAIRecommendations, mockDemandZones, mockProducePools } from "./mockData/mockForecasts";
import { mockSIHScenario } from "./mockData/sihScenarioData";

export const aiService = {
  async getRecommendations(): Promise<AIRecommendation[]> {
    return mockAIRecommendations;
  },

  async getDemandZones(): Promise<DemandZone[]> {
    return mockDemandZones;
  },

  async getProducePools(): Promise<ProducePool[]> {
    return mockProducePools;
  },

  async getSIHScenario(): Promise<SIHScenarioData> {
    return mockSIHScenario;
  }
};