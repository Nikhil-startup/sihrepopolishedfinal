import { Order, RoadLogisticsTracking } from "@/types/farmer";
import { mockOrders, mockTrackingDetails } from "./mockData/mockOrders";
import { getStoredData } from "@/data/demoData";

const ORDERS_STORAGE_KEY = 'agriflow_farmer_orders';

export const trackingService = {
  /**
   * Fetch purchase orders from client storage or mock orders.
   */
  async getOrders(): Promise<Order[]> {
    return getStoredData<Order[]>(ORDERS_STORAGE_KEY, mockOrders);
  },

  /**
   * Fetch road logistics telemetry details for a trip.
   */
  async getTrackingDetails(logisticsId: string): Promise<RoadLogisticsTracking | null> {
    return mockTrackingDetails[logisticsId] || mockTrackingDetails["TRK-CONS-ROAD-9021"] || mockTrackingDetails["TRK-RD-9021"] || null;
  }
};