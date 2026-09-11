import { Order, RoadLogisticsTracking } from "@/types/farmer";
import { mockOrders, mockTrackingDetails } from "./mockData/mockOrders";

export const trackingService = {
  async getOrders(): Promise<Order[]> {
    return mockOrders;
  },

  async getTrackingDetails(logisticsId: string): Promise<RoadLogisticsTracking | null> {
    return mockTrackingDetails[logisticsId] || mockTrackingDetails["TRK-RD-9021"] || null;
  }
};