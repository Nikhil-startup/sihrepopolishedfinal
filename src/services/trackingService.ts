import { Order, RoadLogisticsTracking } from "@/types/farmer";
import { mockOrders, mockTrackingDetails } from "./mockData/mockOrders";
import { getStoredData, setStoredData } from "@/data/demoData";
import { createLiveStream, LiveConnectionState, LiveStreamSubscription } from "./hybridLiveClient";

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
  },

  /**
   * Real-Time Stream Subscription for Farmer Orders & Contract Updates.
   */
  subscribeToOrders(
    onUpdate: (orders: Order[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentOrders = getStoredData<Order[]>(ORDERS_STORAGE_KEY, mockOrders);

    const generateOrderFrame = () => {
      // Return the current list of orders (can simulate status advancement or verification)
      return currentOrders;
    };

    return createLiveStream<any>(
      '/ws/farmer/orders',
      (packet) => {
        if (Array.isArray(packet)) {
          currentOrders = packet;
          onUpdate(currentOrders);
        }
      },
      onStateChange,
      generateOrderFrame,
      5000
    );
  }
};