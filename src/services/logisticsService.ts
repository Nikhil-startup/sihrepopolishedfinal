import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { mockFleetVehicles, mockConsolidatedTrips } from './mockData/mockLogisticsData';
import { getStoredData, setStoredData } from '@/data/demoData';
import { createLiveStream, LiveConnectionState, LiveStreamSubscription } from './hybridLiveClient';

const FLEET_STORAGE_KEY = 'agriflow_logistics_fleet';
const TRIPS_STORAGE_KEY = 'agriflow_logistics_trips';

export interface VehicleTelemetryDetail {
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  temperatureCelsius: number;
  targetTempCelsius: number;
  humidityPercent: number;
  safeWindowHours: number;
  safeWindowMinutes: number;
  cargo: string;
  status: 'In Transit' | 'Available' | 'Maintenance' | 'Loading';
  reeferActive: boolean;
  spoilageRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  lastUpdated: string;
}

export const logisticsService = {
  async getFleet(): Promise<LogisticsFleetVehicle[]> {
    return getStoredData<LogisticsFleetVehicle[]>(FLEET_STORAGE_KEY, mockFleetVehicles);
  },

  async getTrips(): Promise<ConsolidatedTrip[]> {
    return getStoredData<ConsolidatedTrip[]>(TRIPS_STORAGE_KEY, mockConsolidatedTrips);
  },

  async getTripById(id: string): Promise<ConsolidatedTrip | null> {
    const trips = getStoredData<ConsolidatedTrip[]>(TRIPS_STORAGE_KEY, mockConsolidatedTrips);
    return trips.find(t => t.id === id) || mockConsolidatedTrips.find(t => t.id === id) || null;
  },

  async acceptReturnLoad(tripId: string, _returnLoadId?: string): Promise<boolean> {
    const trips = getStoredData<ConsolidatedTrip[]>(TRIPS_STORAGE_KEY, mockConsolidatedTrips);
    const updated = trips.map(trip => {
      if (trip.id === tripId && trip.returnLoad) {
        return {
          ...trip,
          returnLoad: {
            ...trip.returnLoad,
            isClaimed: true,
          }
        };
      }
      return trip;
    });
    setStoredData(TRIPS_STORAGE_KEY, updated);
    return true;
  },

  /**
   * Real-Time Stream Subscription for Fleet Cold-Chain Telemetry.
   * Emits live sensor readings (temperature, humidity, safe window) for active fleet vehicles.
   */
  subscribeToFleetTelemetry(
    onUpdate: (telemetry: VehicleTelemetryDetail[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentData: VehicleTelemetryDetail[] = [
      {
        vehicleId: 'veh-01',
        vehicleNumber: 'TS 08 UB 4192',
        vehicleType: 'Tata 407 Reefer',
        driverName: 'Mohammed Ismail',
        temperatureCelsius: 6.2,
        targetTempCelsius: 6.0,
        humidityPercent: 88,
        safeWindowHours: 4,
        safeWindowMinutes: 32,
        cargo: 'Tomato (Hybrid Desi)',
        status: 'In Transit',
        reeferActive: true,
        spoilageRisk: 'LOW',
        lastUpdated: 'Live Telemetry',
      },
      {
        vehicleId: 'veh-02',
        vehicleNumber: 'TS 07 EA 8831',
        vehicleType: 'Mahindra Bolero Maxi Truck',
        driverName: 'K. Venkateshwarlu',
        temperatureCelsius: 8.5,
        targetTempCelsius: 8.0,
        humidityPercent: 75,
        safeWindowHours: 96,
        safeWindowMinutes: 0,
        cargo: 'Green Chilli (G4)',
        status: 'In Transit',
        reeferActive: false,
        spoilageRisk: 'LOW',
        lastUpdated: 'Live Telemetry',
      },
      {
        vehicleId: 'veh-03',
        vehicleNumber: 'TS 09 XY 1029',
        vehicleType: 'Tata Ace',
        driverName: 'Ravi Teja',
        temperatureCelsius: 24.0,
        targetTempCelsius: 24.0,
        humidityPercent: 62,
        safeWindowHours: 120,
        safeWindowMinutes: 0,
        cargo: 'Empty (In Depot Park)',
        status: 'Available',
        reeferActive: false,
        spoilageRisk: 'LOW',
        lastUpdated: 'Live Telemetry',
      }
    ];

    const generateTelemetryFrame = () => {
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      currentData = currentData.map((v) => {
        if (v.status === 'In Transit' && v.reeferActive) {
          const delta = (Math.random() * 0.4) - 0.2;
          const newTemp = Math.max(5.4, Math.min(6.8, Math.round((v.temperatureCelsius + delta) * 10) / 10));
          const humDelta = Math.floor(Math.random() * 3) - 1;
          const newHum = Math.max(82, Math.min(91, v.humidityPercent + humDelta));
          const minsDec = Math.random() > 0.6 ? 1 : 0;
          let newMins = v.safeWindowMinutes - minsDec;
          let newHrs = v.safeWindowHours;
          if (newMins < 0) {
            newMins = 59;
            newHrs = Math.max(1, newHrs - 1);
          }
          return {
            ...v,
            temperatureCelsius: newTemp,
            humidityPercent: newHum,
            safeWindowHours: newHrs,
            safeWindowMinutes: newMins,
            lastUpdated: now,
          };
        } else if (v.status === 'In Transit') {
          const delta = (Math.random() * 0.2) - 0.1;
          const newTemp = Math.round((v.temperatureCelsius + delta) * 10) / 10;
          return {
            ...v,
            temperatureCelsius: newTemp,
            lastUpdated: now,
          };
        }
        return { ...v, lastUpdated: now };
      });
      return currentData;
    };

    return createLiveStream<any>(
      '/ws/logistics/telemetry',
      (packet) => {
        if (Array.isArray(packet)) {
          currentData = packet;
          onUpdate(currentData);
        }
      },
      onStateChange,
      generateTelemetryFrame,
      3500
    );
  },

  /**
   * Real-Time Stream Subscription for Active Consolidated Road Freight Trips.
   */
  subscribeToTrips(
    onUpdate: (trips: ConsolidatedTrip[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentTrips = getStoredData<ConsolidatedTrip[]>(TRIPS_STORAGE_KEY, mockConsolidatedTrips);

    const generateTripTick = () => {
      currentTrips = currentTrips.map((trip) => {
        if (trip.status === 'IN TRANSIT') {
          const addedKm = 1;
          const newCompleted = Math.min(trip.totalDistanceKm, trip.distanceCompletedKm + addedKm);
          const remaining = Math.max(0, trip.totalDistanceKm - newCompleted);
          const tempDelta = (Math.random() * 0.2) - 0.1;
          const newTemp = trip.coldChainTemp ? Math.round((trip.coldChainTemp + tempDelta) * 10) / 10 : 6.0;

          return {
            ...trip,
            distanceCompletedKm: newCompleted,
            coldChainTemp: newTemp,
            status: newCompleted >= trip.totalDistanceKm ? 'DELIVERED' : 'IN TRANSIT',
            estimatedArrival: remaining <= 5 ? 'Arriving within 10 mins' : trip.estimatedArrival,
          };
        }
        return trip;
      });
      return currentTrips;
    };

    return createLiveStream<any>(
      '/ws/logistics/trips',
      (packet) => {
        if (Array.isArray(packet)) {
          currentTrips = packet;
          onUpdate(currentTrips);
        }
      },
      onStateChange,
      generateTripTick,
      4000
    );
  }
};