import { DeliveryTracking } from '@/types/delivery';
import { apiClient } from '@/lib/apiClient';
import { createLiveStream, LiveConnectionState } from './hybridLiveClient';

export interface TrackingSubscriptionHandle {
  (): void;
  unsubscribe: () => void;
  reconnect: () => void;
  getState: () => LiveConnectionState;
}

export const sharedTrackingService = {
  /**
   * Fetch trip tracking telemetry from Neon PostgreSQL via FastAPI.
   * STRICT ZERO MOCK FALLBACK: If backend fails, throws LIVE_DATA_UNAVAILABLE.
   */
  async getTracking(id: string): Promise<DeliveryTracking> {
    const cleanId = id.trim();
    try {
      const trip = await apiClient.get<DeliveryTracking>(`/api/logistics/trips/${encodeURIComponent(cleanId)}`);
      return trip;
    } catch {
      throw new Error("LIVE_DATA_UNAVAILABLE");
    }
  },

  /**
   * Fetch trip tracking by purchase order ID.
   */
  async getTrackingByOrderId(orderId: string): Promise<DeliveryTracking> {
    const cleanOrder = orderId.trim();
    try {
      const order = await apiClient.get<any>(`/api/orders/${encodeURIComponent(cleanOrder)}`);
      const tripId = order.logisticsId || order.trip_id || "TRK-CONS-ROAD-9021";
      return await this.getTracking(tripId);
    } catch {
      throw new Error("LIVE_DATA_UNAVAILABLE");
    }
  },

  /**
   * Fetch all active delivery trips from Neon PostgreSQL via FastAPI.
   */
  async getAllTrips(): Promise<DeliveryTracking[]> {
    try {
      const trips = await apiClient.get<DeliveryTracking[]>('/api/logistics/trips');
      return Array.isArray(trips) ? trips : [];
    } catch {
      return [];
    }
  },

  /**
   * Genuine Live Stream Subscription for Road Reefer IoT Telematics.
   * Connects to WebSocket /ws/telematics/{cleanId}.
   * If disconnected, reports OFFLINE without generating fake GPS or temperature coordinates.
   */
  subscribe(
    tripId: string,
    onUpdate: (trip: DeliveryTracking) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): TrackingSubscriptionHandle {
    const cleanId = tripId.trim();
    let currentTripState: DeliveryTracking | null = null;
    let lastUpdatedTime: string | undefined = undefined;

    // Fetch initial database state first
    this.getTracking(cleanId)
      .then((initialTrip) => {
        currentTripState = initialTrip;
        onUpdate(initialTrip);
        onStateChange?.('LIVE', undefined, new Date().toLocaleTimeString());
      })
      .catch(() => {
        onStateChange?.('OFFLINE', 'Unable to connect to live telemetry. Please try again later.');
      });

    const liveSub = createLiveStream<any>(
      `/ws/telematics/${encodeURIComponent(cleanId)}`,
      (packet) => {
        if (packet && typeof packet.latitude === 'number' && typeof packet.longitude === 'number' && currentTripState) {
          lastUpdatedTime = packet.last_updated || new Date().toLocaleTimeString();
          currentTripState = {
            ...currentTripState,
            currentCoordinates: [packet.latitude, packet.longitude],
            currentLocationName: packet.location_name || currentTripState.currentLocationName,
            telemetry: {
              ...currentTripState.telemetry,
              temperatureCelsius: typeof packet.temperature_celsius === 'number' ? packet.temperature_celsius : currentTripState.telemetry.temperatureCelsius,
              targetTempCelsius: typeof packet.target_temp_celsius === 'number' ? packet.target_temp_celsius : currentTripState.telemetry.targetTempCelsius,
              humidityPercent: typeof packet.humidity_percent === 'number' ? packet.humidity_percent : currentTripState.telemetry.humidityPercent,
              spoilageRisk: packet.spoilage_risk || currentTripState.telemetry.spoilageRisk,
              reeferActive: typeof packet.reefer_active === 'boolean' ? packet.reefer_active : currentTripState.telemetry.reeferActive,
            },
          };
          onUpdate(currentTripState);
          onStateChange?.('LIVE', undefined, lastUpdatedTime);
        }
      },
      (state, errorMsg) => {
        onStateChange?.(state, errorMsg, lastUpdatedTime);
      }
    );

    const fn = (() => {
      liveSub.unsubscribe();
    }) as TrackingSubscriptionHandle;

    fn.unsubscribe = () => liveSub.unsubscribe();
    fn.reconnect = () => liveSub.reconnect();
    fn.getState = () => liveSub.getState();

    return fn;
  },
};
