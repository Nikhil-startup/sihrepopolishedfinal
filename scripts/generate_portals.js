const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Created: ' + relPath);
}

// 1. types/consumer.ts
write('src/types/consumer.ts', \
import { ProduceGrade } from './farmer';

export interface ConsumerProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Vegetables' | 'Fruits' | 'Spices' | 'Tubers';
  farmerName: string;
  farmLocation: string;
  fpoCluster?: string;
  grade: ProduceGrade;
  availableKg: number;
  minOrderKg: number;
  consumerPricePerKg: number;
  farmerRealizationPerKg: number;
  logisticsFeePerKg: number;
  platformFeePerKg: number;
  harvestDate: string;
  harvestHoursAgo: number;
  coldChainTempCelsius: number;
  freshnessScore: number;
  image: string;
  description: string;
  provenanceBatchId: string;
}

export interface CartItem {
  product: ConsumerProduct;
  quantityKg: number;
}

export interface BulkDemandPost {
  id: string;
  buyerName: string;
  buyerType: string;
  commodity: string;
  requiredQuantityKg: number;
  maxTargetPricePerKg: number;
  deliveryLocation: string;
  targetDate: string;
  allocatedFarmers: {
    farmerName: string;
    location: string;
    allocatedKg: number;
    grade: ProduceGrade;
  }[];
  status: 'Open' | 'Consolidated' | 'Dispatched' | 'Completed';
  createdAt: string;
}
\);

// 2. types/logistics.ts
write('src/types/logistics.ts', \
import { DeliveryStatus, RoadVehicleType, SpoilageRiskLevel } from './delivery';

export interface LogisticsFleetVehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: RoadVehicleType;
  capacityKg: number;
  currentLoadKg: number;
  driverName: string;
  driverPhone: string;
  status: 'Available' | 'Assigned' | 'In Transit' | 'Loading' | 'Maintenance';
  reeferActive: boolean;
  currentTempCelsius: number;
  currentLocation: string;
  currentLat: number;
  currentLng: number;
  assignedTripId?: string;
}

export interface ConsolidatedTrip {
  id: string;
  tripCode: string;
  vehicle: LogisticsFleetVehicle;
  sourceHub: string;
  destinationHub: string;
  totalDistanceKm: number;
  distanceCompletedKm: number;
  commodity: string;
  totalKg: number;
  pickups: {
    fpoName: string;
    location: string;
    qtyKg: number;
    status: 'Pending' | 'Loaded';
  }[];
  status: DeliveryStatus;
  estimatedArrival: string;
  coldChainTemp: number;
  spoilageRisk: SpoilageRiskLevel;
  returnLoad?: {
    id: string;
    route: string;
    commodity: string;
    weightKg: number;
    additionalEarnings: number;
    emptyDistanceAvoidedKm: number;
    isClaimed: boolean;
  };
}
\);

console.log('Types written!');
