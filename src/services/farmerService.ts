import { Produce, ProduceGrade } from "@/types/farmer";
import { apiClient } from "@/lib/apiClient";
import { initialProduceList } from "./mockData/mockProduce";

export const farmerService = {
  async getProduceList(): Promise<Produce[]> {
    try {
      return await apiClient<Produce[]>('/api/farmer/produce', { method: 'GET' });
    } catch {
      return [];
    }
  },

  async addProduce(item: Omit<Produce, "id" | "createdAt" | "status">): Promise<Produce> {
    try {
      return await apiClient<Produce>('/api/farmer/produce', {
        method: 'POST',
        body: JSON.stringify(item),
      });
    } catch {
      const newProduce: Produce = {
        id: `prod-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        status: 'Active',
        ...item,
      };
      return newProduce;
    }
  },

  async updateProduceStatus(id: string, status: Produce["status"]): Promise<Produce> {
    try {
      return await apiClient<Produce>(`/api/farmer/produce/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      const found = initialProduceList.find(p => p.id === id);
      if (found) {
        found.status = status;
        return found;
      }
      return {
        id,
        crop: "Tomato (Hybrid)",
        quantity: 1000,
        unit: "kg",
        grade: "A",
        harvestDate: new Date().toISOString().split('T')[0],
        expectedPrice: 40,
        location: "Telangana Cluster",
        status,
        createdAt: new Date().toISOString(),
      };
    }
  }
};