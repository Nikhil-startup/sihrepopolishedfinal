import { MarketPrice, PriceTrendPoint, User as FarmerUser } from '@/types/farmer';
import { LogisticsOperator } from '@/types/logistics';
import { ConsumerUser } from '@/types/consumer';

import { mockConsumerProducts, mockConsumerOrders, mockBulkDemands, mockRecommendations } from '@/services/mockData/mockConsumerData';
import { initialProduceList } from '@/services/mockData/mockProduce';
import { mockFleetVehicles, mockConsolidatedTrips } from '@/services/mockData/mockLogisticsData';
import { mockOrders, mockTrackingDetails } from '@/services/mockData/mockOrders';
import { mockAIRecommendations, mockDemandZones, mockProducePools } from '@/services/mockData/mockForecasts';
import { mockSIHScenario } from '@/services/mockData/sihScenarioData';
import { reviewsStore } from '@/lib/ratingsStore';

// ============================================================================
// 1. LocalStorage Helpers for Safe Client-Side Persistence
// ============================================================================

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to persist key "${key}" to localStorage:`, e);
  }
}

// ============================================================================
// 2. Enriched Demo Market Prices (Tomato, Onion, Potato, Mango, Banana, Grapes, Pomegranate)
// ============================================================================

export const demoMarketPrices: MarketPrice[] = [
  {
    id: "mp-001",
    commodity: "Tomato",
    marketName: "Hyderabad (Bowenpally)",
    district: "Hyderabad",
    state: "Telangana",
    currentPrice: 38.00,
    previousPrice: 35.50,
    change: 2.50,
    percentageChange: 7.04,
    bulkBuyerOpportunityPrice: 42.00,
    date: "2026-09-11",
  },
  {
    id: "mp-002",
    commodity: "Tomato",
    marketName: "Gaddiannaram Mandi",
    district: "Rangareddy",
    state: "Telangana",
    currentPrice: 36.50,
    previousPrice: 36.00,
    change: 0.50,
    percentageChange: 1.39,
    bulkBuyerOpportunityPrice: 41.50,
    date: "2026-09-11",
  },
  {
    id: "mp-003",
    commodity: "Onion",
    marketName: "Mahabubnagar Mandi",
    district: "Mahabubnagar",
    state: "Telangana",
    currentPrice: 28.00,
    previousPrice: 26.50,
    change: 1.50,
    percentageChange: 5.66,
    bulkBuyerOpportunityPrice: 32.00,
    date: "2026-09-11",
  },
  {
    id: "mp-004",
    commodity: "Potato",
    marketName: "Kolar Cold Hub",
    district: "Kolar",
    state: "Karnataka",
    currentPrice: 24.00,
    previousPrice: 23.00,
    change: 1.00,
    percentageChange: 4.35,
    bulkBuyerOpportunityPrice: 27.50,
    date: "2026-09-11",
  },
  {
    id: "mp-005",
    commodity: "Green Chilli",
    marketName: "Warangal Mandi",
    district: "Warangal",
    state: "Telangana",
    currentPrice: 52.00,
    previousPrice: 49.00,
    change: 3.00,
    percentageChange: 6.12,
    bulkBuyerOpportunityPrice: 58.00,
    date: "2026-09-11",
  },
  {
    id: "mp-006",
    commodity: "Mango",
    marketName: "Srinivaspur Mango Mandi",
    district: "Kolar",
    state: "Karnataka",
    currentPrice: 85.00,
    previousPrice: 80.00,
    change: 5.00,
    percentageChange: 6.25,
    bulkBuyerOpportunityPrice: 96.00,
    date: "2026-09-11",
  },
  {
    id: "mp-007",
    commodity: "Banana",
    marketName: "Solapur Fruit Market",
    district: "Solapur",
    state: "Maharashtra",
    currentPrice: 22.00,
    previousPrice: 21.00,
    change: 1.00,
    percentageChange: 4.76,
    bulkBuyerOpportunityPrice: 26.00,
    date: "2026-09-11",
  },
  {
    id: "mp-008",
    commodity: "Grapes",
    marketName: "Nashik Grape Terminal",
    district: "Nashik",
    state: "Maharashtra",
    currentPrice: 65.00,
    previousPrice: 62.00,
    change: 3.00,
    percentageChange: 4.84,
    bulkBuyerOpportunityPrice: 74.00,
    date: "2026-09-11",
  },
  {
    id: "mp-009",
    commodity: "Pomegranate",
    marketName: "Solapur APMC",
    district: "Solapur",
    state: "Maharashtra",
    currentPrice: 110.00,
    previousPrice: 104.00,
    change: 6.00,
    percentageChange: 5.77,
    bulkBuyerOpportunityPrice: 125.00,
    date: "2026-09-11",
  }
];

export const demoPriceTrendData: PriceTrendPoint[] = [
  { day: "Aug 28", currentMandi: 32, forecastedPrice: 32, buyerDemandPrice: 36 },
  { day: "Aug 30", currentMandi: 34, forecastedPrice: 34, buyerDemandPrice: 38 },
  { day: "Sep 01", currentMandi: 33, forecastedPrice: 33, buyerDemandPrice: 37 },
  { day: "Sep 03", currentMandi: 35, forecastedPrice: 35, buyerDemandPrice: 40 },
  { day: "Sep 05", currentMandi: 37, forecastedPrice: 37, buyerDemandPrice: 42 },
  { day: "Sep 07", currentMandi: 39, forecastedPrice: 39, buyerDemandPrice: 44 },
  { day: "Sep 09", currentMandi: 38, forecastedPrice: 38, buyerDemandPrice: 43 },
  { day: "Sep 11", currentMandi: 42, forecastedPrice: 42, buyerDemandPrice: 46 }
];

// ============================================================================
// 3. Demo Users Personas
// ============================================================================

export const demoFarmerUser: FarmerUser = {
  id: 'farmer-001',
  name: 'Ramesh Reddy (Shadnagar FPO)',
  phone: '+91 98480 12345',
  email: 'ramesh.reddy@fpo.in',
  role: 'farmer',
  state: 'Telangana',
  district: 'Rangareddy',
  place: 'Shadnagar',
  preferredLanguage: 'te',
  location: 'Shadnagar, Rangareddy, Telangana',
  farmName: 'Shadnagar Farmers Collective',
  farmerType: 'FPO',
  createdAt: new Date().toISOString(),
};

export const demoConsumerUser: ConsumerUser = {
  id: 'consumer-001',
  name: 'Priya Sharma (Hyderabad Wholesale)',
  phone: '+91 98480 54321',
  email: 'priya@wholesale.in',
  role: 'consumer',
  state: 'Telangana',
  district: 'Hyderabad',
  place: 'Bowenpally',
  preferredLanguage: 'ta',
  location: 'Bowenpally Wholesale Corridor, Hyderabad',
  buyerType: 'bulk-buyer',
  createdAt: new Date().toISOString(),
};

export const demoLogisticsUser: LogisticsOperator = {
  id: 'logistics-001',
  name: 'Gurdeep Singh',
  phone: '+91 98480 99881',
  email: 'gurdeep@reeferfleet.in',
  role: 'logistics',
  state: 'Telangana',
  district: 'Rangareddy',
  place: 'Shamshabad Fleet Hub',
  preferredLanguage: 'hi',
  vehicleType: 'Tata 407 Reefer',
  vehicleNumber: 'TS 08 UB 4192',
  vehicleCapacityKg: 5000,
  reeferEnabled: true,
  operatingRegion: 'Telangana & AP Perishable Corridor',
  preferredRoutes: ['Shadnagar -> Hyderabad'],
  createdAt: new Date().toISOString(),
};

// ============================================================================
// 4. Re-Exports from Domain Mocks
// ============================================================================

export {
  mockConsumerProducts as demoProducts,
  mockConsumerOrders as demoOrders,
  mockBulkDemands as demoBulkDemands,
  mockRecommendations as demoRecommendations,
  initialProduceList as demoProduceList,
  mockFleetVehicles as demoVehicles,
  mockConsolidatedTrips as demoConsolidatedTrips,
  mockOrders as demoFarmerOrders,
  mockTrackingDetails as demoTrackingDetails,
  mockAIRecommendations as demoAIRecommendations,
  mockDemandZones as demoDemandZones,
  mockProducePools as demoProducePools,
  mockSIHScenario as demoSIHScenario,
  reviewsStore as demoReviews,
};
