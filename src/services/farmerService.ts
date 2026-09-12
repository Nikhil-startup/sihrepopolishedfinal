import { Produce } from "@/types/farmer";
import { initialProduceList } from "./mockData/mockProduce";
import { getStoredData, setStoredData } from "@/data/demoData";

const STORAGE_KEY = 'agriflow_farmer_produce';

export const farmerService = {
  async getProduceList(): Promise<Produce[]> {
    return getStoredData<Produce[]>(STORAGE_KEY, initialProduceList);
  },

  async addProduce(item: Omit<Produce, "id" | "createdAt" | "status">): Promise<Produce> {
    const current = getStoredData<Produce[]>(STORAGE_KEY, initialProduceList);
    const newProduce: Produce = {
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'Active',
      ...item,
    };
    const updated = [newProduce, ...current];
    setStoredData(STORAGE_KEY, updated);
    return newProduce;
  },

  async updateProduceStatus(id: string, status: Produce["status"]): Promise<Produce> {
    const current = getStoredData<Produce[]>(STORAGE_KEY, initialProduceList);
    let updatedItem: Produce | null = null;
    const updated = current.map((p) => {
      if (p.id === id) {
        updatedItem = { ...p, status };
        return updatedItem;
      }
      return p;
    });

    if (updatedItem) {
      setStoredData(STORAGE_KEY, updated);
      return updatedItem;
    }

    const fallback: Produce = {
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
    setStoredData(STORAGE_KEY, [fallback, ...current]);
    return fallback;
  }
};