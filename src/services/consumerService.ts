import { BulkDemand, ConsumerOrder, ConsumerTracking, ProductDetails, Recommendation } from '@/types/consumer';
import { apiClient } from '@/lib/apiClient';

export const consumerService = {
  // ==========================================================================
  // Products (Sourced from Neon PostgreSQL produce_listings)
  // ==========================================================================
  async getProducts(): Promise<ProductDetails[]> {
    return apiClient.get<ProductDetails[]>('/api/products');
  },

  async getProductById(id: string): Promise<ProductDetails | null> {
    try {
      return await apiClient.get<ProductDetails>(`/api/products/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },

  // ==========================================================================
  // Orders (Sourced from Neon PostgreSQL orders table)
  // ==========================================================================
  async getOrders(): Promise<ConsumerOrder[]> {
    return apiClient.get<ConsumerOrder[]>('/api/orders');
  },

  async getOrderById(id: string): Promise<ConsumerOrder | null> {
    try {
      return await apiClient.get<ConsumerOrder>(`/api/orders/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },

  async createOrder(orderData: Omit<ConsumerOrder, 'id' | 'orderDate' | 'status'>): Promise<ConsumerOrder> {
    return apiClient.post<ConsumerOrder>('/api/orders', {
      total_quantity_kg: orderData.totalQuantityKg,
      total_amount: orderData.totalAmount,
      subtotal: orderData.subtotal,
      buyer_name: orderData.deliveryAddress?.name || 'Verified Buyer',
      delivery_location: `${orderData.deliveryAddress?.address || ''}, ${orderData.deliveryAddress?.city || ''}`,
      produce_name: orderData.items?.[0]?.product?.name || 'Fresh Farm Produce',
      items: orderData.items || [],
    });
  },

  // ==========================================================================
  // Highway Telemetry Tracking (Sourced from PostgreSQL trip & IoT stream)
  // ==========================================================================
  async getTracking(logisticsId: string): Promise<ConsumerTracking | null> {
    try {
      const trip = await apiClient.get<any>(`/api/logistics/trips/${encodeURIComponent(logisticsId)}`);
      return {
        id: trip.id,
        orderId: trip.orderId,
        vehicleType: trip.vehicleType,
        vehicleNumber: trip.vehicleNumber,
        driverName: trip.driverName,
        driverPhone: trip.driverPhone,
        pickupLocation: trip.pickupLocation,
        destinationLocation: trip.destinationLocation,
        currentLocationName: trip.currentLocationName,
        currentCoordinates: trip.currentCoordinates,
        pickupCoordinates: trip.pickupCoordinates,
        destinationCoordinates: trip.destinationCoordinates,
        estimatedArrival: trip.estimatedArrival,
        status: trip.status,
        progressPercent: trip.progressPercentage,
        distanceRemainingKm: trip.distanceRemainingKm,
        totalDistanceKm: trip.totalDistanceKm,
        coldChainTelemetry: {
          temperatureCelsius: trip.telemetry?.temperatureCelsius ?? 6.0,
          targetTempCelsius: trip.telemetry?.targetTempCelsius ?? 6.0,
          humidityPercent: trip.telemetry?.humidityPercent ?? 85.0,
          safeWindowHours: 4,
          safeWindowMinutes: 30,
          riskLevel: trip.telemetry?.spoilageRisk === 'HIGH' ? 'High' : trip.telemetry?.spoilageRisk === 'MEDIUM' ? 'Medium' : 'Low',
          reeferActive: trip.telemetry?.reeferActive ?? true,
          isSimulated: false,
          explanation: trip.telemetry?.explanation || 'Active IoT Telematics Cold Chain stream.',
        },
        timeline: trip.timeline || [],
        isSimulatedGPS: false,
      };
    } catch {
      throw new Error("LIVE_DATA_UNAVAILABLE");
    }
  },

  // ==========================================================================
  // Bulk Sourcing Demand (Sourced from backend intelligence endpoint)
  // ==========================================================================
  async getBulkDemands(): Promise<BulkDemand[]> {
    try {
      const zones = await apiClient.get<any[]>('/api/intelligence/demand-zones');
      return zones.map((z, i) => ({
        id: z.id,
        buyerId: `buyer-corp-${i + 1}`,
        produceName: z.primaryCrop,
        requiredQuantityKg: z.demandedQuantityKg,
        requiredGrade: 'A' as const,
        deliveryLocation: z.zoneName,
        deliveryCity: z.zoneName.split(' ')[0] || 'Hyderabad',
        preferredDeliveryDate: new Date().toISOString().split('T')[0],
        deliveryWindow: '06:00 AM - 10:00 AM',
        maxBudgetPerKg: z.avgOfferedPrice,
        matchedQuantityKg: Math.round(z.demandedQuantityKg * 0.7),
        remainingQuantityKg: Math.round(z.demandedQuantityKg * 0.3),
        matchedSuppliers: [],
        status: 'Matching' as const,
        roadRouteDetails: {
          traditionalDistanceKm: 120,
          traditionalCost: 4500,
          traditionalHours: 4.5,
          optimizedDistanceKm: 95,
          optimizedCost: 3200,
          optimizedHours: 3.2,
          distanceSavedKm: 25,
          costSavedINR: 1300,
          hoursSaved: 1.3,
        },
        createdAt: new Date().toISOString().split('T')[0],
      }));
    } catch {
      throw new Error("LIVE_DATA_UNAVAILABLE");
    }
  },

  async createBulkDemand(demand: Partial<BulkDemand>): Promise<BulkDemand> {
    const qty = demand.requiredQuantityKg || 1000;
    const newDemand: BulkDemand = {
      id: `BD-${Date.now().toString().slice(-4)}`,
      buyerId: demand.buyerId || 'consumer-001',
      produceName: demand.produceName || 'Tomato (Grade A)',
      requiredQuantityKg: qty,
      requiredGrade: demand.requiredGrade || 'A',
      deliveryLocation: demand.deliveryLocation || 'Hyderabad Central Hub',
      deliveryCity: demand.deliveryCity || 'Hyderabad',
      preferredDeliveryDate: demand.preferredDeliveryDate || new Date().toISOString().split('T')[0],
      deliveryWindow: demand.deliveryWindow || '06:00 AM - 10:00 AM',
      maxBudgetPerKg: demand.maxBudgetPerKg || 42,
      matchedQuantityKg: 0,
      remainingQuantityKg: qty,
      matchedSuppliers: [],
      status: 'Matching',
      roadRouteDetails: {
        traditionalDistanceKm: 100,
        traditionalCost: 4000,
        traditionalHours: 4,
        optimizedDistanceKm: 80,
        optimizedCost: 3000,
        optimizedHours: 2.8,
        distanceSavedKm: 20,
        costSavedINR: 1000,
        hoursSaved: 1.2,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };
    return newDemand;
  },

  // ==========================================================================
  // AI Procurement Recommendations
  // ==========================================================================
  async getRecommendations(_buyerType?: string): Promise<Recommendation[]> {
    try {
      const recs = await apiClient.get<any[]>('/api/intelligence/recommendations');
      return recs.map((r, i) => ({
        id: `rec-procure-${i + 1}`,
        produceName: r.crop,
        productId: `PROD-${r.crop.toLowerCase().replace(/[^a-z0-9]/g, '-')}-001`,
        headline: `${r.crop}: ${r.action}`,
        explanation: r.rationale,
        grade: 'A' as const,
        freshness: 'Harvested Today' as const,
        pricePerKg: 38,
        farmerName: 'Telangana Farmers Producer Organisation',
        distanceKm: 42,
        matchingScorePercent: 94,
        image: '/images/produce/tomato.png',
        suitableBuyerTypes: ['retailer', 'restaurant', 'bulk-buyer'],
      }));
    } catch {
      throw new Error("LIVE_DATA_UNAVAILABLE");
    }
  }
};
