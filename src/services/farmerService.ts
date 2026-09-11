import { Produce } from "@/types/farmer";
import { apiClient } from "@/lib/apiClient";

export const farmerService = {
  /**
   * Fetch live farmer produce listings from FastAPI / Neon PostgreSQL.
   */
  async getProduceList(): Promise<Produce[]> {
    return apiClient.get<Produce[]>('/api/produce');
  },

  /**
   * Insert new farmer produce listing into Neon PostgreSQL via FastAPI.
   */
  async addProduce(item: Omit<Produce, "id" | "createdAt" | "status">): Promise<Produce> {
    return apiClient.post<Produce>('/api/produce', item);
  },

  /**
   * Update status of produce listing in Neon PostgreSQL.
   */
  async updateProduceStatus(id: string, status: Produce["status"]): Promise<Produce> {
    return apiClient.patch<Produce>(`/api/produce/${encodeURIComponent(id)}/status`, { status });
  }
};