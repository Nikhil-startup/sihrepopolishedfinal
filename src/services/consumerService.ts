import { BulkDemand, ConsumerOrder, ConsumerTracking, ProductDetails, Recommendation } from '@/types/consumer';
import { 
  mockConsumerProducts, 
  mockConsumerOrders, 
  mockBulkDemands, 
  mockRecommendations 
} from './mockData/mockConsumerData';
import { getStoredData, setStoredData } from '@/data/demoData';

const ORDERS_STORAGE_KEY = 'agriflow_consumer_orders';
const BULK_DEMANDS_STORAGE_KEY = 'agriflow_consumer_bulk_demands';

export const consumerService = {
  // Products
  async getProducts(): Promise<ProductDetails[]> {
    return mockConsumerProducts;
  },

  async getProductById(id: string): Promise<ProductDetails | null> {
    return mockConsumerProducts.find(p => p.id === id) || mockConsumerProducts[0] || null;
  },

  // Orders
  async getOrders(): Promise<ConsumerOrder[]> {
    return getStoredData<ConsumerOrder[]>(ORDERS_STORAGE_KEY, mockConsumerOrders);
  },

  async getOrderById(id: string): Promise<ConsumerOrder | null> {
    const orders = getStoredData<ConsumerOrder[]>(ORDERS_STORAGE_KEY, mockConsumerOrders);
    return orders.find(o => o.id === id) || mockConsumerOrders.find(o => o.id === id) || null;
  },

  async createOrder(orderData: Omit<ConsumerOrder, 'id' | 'orderDate' | 'status'>): Promise<ConsumerOrder> {
    const currentOrders = getStoredData<ConsumerOrder[]>(ORDERS_STORAGE_KEY, mockConsumerOrders);
    const newOrder: ConsumerOrder = {
      id: `ORD-CONS-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Confirmed',
      ...orderData,
      logisticsId: 'TRK-CONS-ROAD-9021',
      estimatedDeliveryDate: 'Within 6 Hours',
    };
    const updatedOrders = [newOrder, ...currentOrders];
    setStoredData(ORDERS_STORAGE_KEY, updatedOrders);
    return newOrder;
  },

  // Tracking
  async getTracking(logisticsId: string): Promise<ConsumerTracking | null> {
    return {
      id: logisticsId || 'TRK-CONS-ROAD-9021',
      orderId: 'ORD-HYD-5000',
      vehicleType: 'Tata 407 Reefer',
      vehicleNumber: 'TS 08 UB 4192',
      driverName: 'Mohammed Ismail',
      driverPhone: '+91 98480 22341',
      pickupLocation: 'Shadnagar FPO Cluster Hub',
      destinationLocation: 'Bowenpally Wholesale Terminal, Hyderabad',
      currentLocationName: 'Shamshabad Outer Ring Road, Hyderabad',
      currentCoordinates: [17.2403, 78.4294],
      pickupCoordinates: [17.0684, 78.2078],
      destinationCoordinates: [17.4729, 78.4842],
      estimatedArrival: 'Today, 05:45 PM',
      status: 'In Transit',
      progressPercent: 68,
      distanceRemainingKm: 28,
      totalDistanceKm: 74,
      coldChainTelemetry: {
        temperatureCelsius: 5.8,
        targetTempCelsius: 6.0,
        humidityPercent: 86,
        safeWindowHours: 4,
        safeWindowMinutes: 30,
        riskLevel: 'Low',
        reeferActive: true,
        isSimulated: true,
        explanation: 'Reefer active at optimal 5.8C. Humidity calibrated at 86% to preserve produce freshness.',
      },
      timeline: [
        { id: 'wp-1', title: 'Produce Loaded', location: 'Shadnagar Hub', timestamp: '08:30 AM', completed: true },
        { id: 'wp-2', title: 'Reefer Cold Seal Verified', location: 'Pre-Cool Station', timestamp: '09:15 AM', completed: true },
        { id: 'wp-3', title: 'In Transit (NH 44)', location: 'Shamshabad Corridor', timestamp: '03:15 PM', completed: true },
        { id: 'wp-4', title: 'Destination Delivery', location: 'Bowenpally Terminal', timestamp: '05:45 PM', completed: false },
      ],
      isSimulatedGPS: true,
    };
  },

  // Bulk Demand
  async getBulkDemands(): Promise<BulkDemand[]> {
    return getStoredData<BulkDemand[]>(BULK_DEMANDS_STORAGE_KEY, mockBulkDemands);
  },

  async createBulkDemand(demand: Partial<BulkDemand>): Promise<BulkDemand> {
    const currentDemands = getStoredData<BulkDemand[]>(BULK_DEMANDS_STORAGE_KEY, mockBulkDemands);
    const qty = demand.requiredQuantityKg || 1000;
    const newDemand: BulkDemand = {
      id: `BD-${Math.floor(100 + Math.random() * 900)}`,
      buyerId: demand.buyerId || 'consumer-001',
      produceName: demand.produceName || 'Tomato (Grade A)',
      requiredQuantityKg: qty,
      requiredGrade: demand.requiredGrade || 'A',
      deliveryLocation: demand.deliveryLocation || 'Bowenpally Hub, Hyderabad',
      deliveryCity: demand.deliveryCity || 'Hyderabad',
      preferredDeliveryDate: demand.preferredDeliveryDate || 'Tomorrow',
      deliveryWindow: demand.deliveryWindow || 'Morning',
      maxBudgetPerKg: demand.maxBudgetPerKg || 30,
      matchedQuantityKg: demand.matchedQuantityKg ?? Math.round(qty * 0.6),
      remainingQuantityKg: demand.remainingQuantityKg ?? Math.round(qty * 0.4),
      matchedSuppliers: demand.matchedSuppliers || [],
      status: demand.status || 'Matching',
      roadRouteDetails: demand.roadRouteDetails || {
        traditionalDistanceKm: 180,
        traditionalCost: 4200,
        traditionalHours: 12,
        optimizedDistanceKm: 120,
        optimizedCost: 2800,
        optimizedHours: 7,
        distanceSavedKm: 60,
        costSavedINR: 1400,
        hoursSaved: 5,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStoredData(BULK_DEMANDS_STORAGE_KEY, [newDemand, ...currentDemands]);
    return newDemand;
  },

  // Cart
  async addToCart(_productId: string, _quantityKg: number): Promise<{ success: boolean }> {
    return { success: true };
  },

  // Recommendations
  async getRecommendations(buyerType?: string): Promise<Recommendation[]> {
    if (!buyerType) return mockRecommendations;
    return mockRecommendations.filter(r => !buyerType || (r.suitableBuyerTypes && r.suitableBuyerTypes.includes(buyerType as any)) || true);
  },
};
