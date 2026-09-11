import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { mockFleetVehicles, mockConsolidatedTrips } from './mockData/mockLogisticsData';
import { getStoredData, setStoredData } from '@/data/demoData';

const FLEET_STORAGE_KEY = 'agriflow_logistics_fleet';
const TRIPS_STORAGE_KEY = 'agriflow_logistics_trips';

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

  async acceptReturnLoad(tripId: string, _returnLoadId: string): Promise<boolean> {
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
  }
};