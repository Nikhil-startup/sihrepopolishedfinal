const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Created: ' + relPath);
}

// 1. types/consumer.ts
write('src/types/consumer.ts', `import { ProduceGrade } from './farmer';

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
`);

// 2. types/logistics.ts
write('src/types/logistics.ts', `import { DeliveryStatus, RoadVehicleType, SpoilageRiskLevel } from './delivery';

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
`);

// 3. services/mockData/mockConsumerProducts.ts
write('src/services/mockData/mockConsumerProducts.ts', `import { ConsumerProduct, BulkDemandPost } from '@/types/consumer';

export const mockConsumerProducts: ConsumerProduct[] = [
  {
    id: 'prod-cons-01',
    name: 'Tomato (Hybrid Desi)',
    hindiName: 'टमाटर (देसी संकर)',
    category: 'Vegetables',
    farmerName: 'Ramesh Reddy & Shadnagar FPO',
    farmLocation: 'Shadnagar Cluster, Rangareddy, Telangana',
    fpoCluster: 'Shadnagar Organic Growers FPO',
    grade: 'A',
    availableKg: 2400,
    minOrderKg: 50,
    consumerPricePerKg: 42.00,
    farmerRealizationPerKg: 36.50,
    logisticsFeePerKg: 3.50,
    platformFeePerKg: 2.00,
    harvestDate: '2026-09-06',
    harvestHoursAgo: 14,
    coldChainTempCelsius: 6.2,
    freshnessScore: 96,
    image: '🍅',
    description: 'Fresh farm-gate harvested hybrid tomatoes. Zero artificial ripening. Packed in aerated food-grade crates with cold-chain provenance.',
    provenanceBatchId: 'BATCH-TS-SHAD-9021',
  },
  {
    id: 'prod-cons-02',
    name: 'Green Chilli (G4 Spicy)',
    hindiName: 'हरी मिर्च (जी4)',
    category: 'Spices',
    farmerName: 'Venkatesh Rao & Guntur Cluster',
    farmLocation: 'Guntur Rural, Andhra Pradesh',
    fpoCluster: 'Andhra Spice Growers Collective',
    grade: 'A-',
    availableKg: 1200,
    minOrderKg: 25,
    consumerPricePerKg: 58.00,
    farmerRealizationPerKg: 50.00,
    logisticsFeePerKg: 5.00,
    platformFeePerKg: 3.00,
    harvestDate: '2026-09-05',
    harvestHoursAgo: 22,
    coldChainTempCelsius: 8.5,
    freshnessScore: 92,
    image: '🌶️',
    description: 'Export-grade spicy G4 green chillies. Machine sorted for length and stem freshness. Direct dispatch via insulated Bolero freight.',
    provenanceBatchId: 'BATCH-AP-GNT-8812',
  },
  {
    id: 'prod-cons-03',
    name: 'Nashik Red Onion (Medium)',
    hindiName: 'लाल प्याज (नासिक)',
    category: 'Vegetables',
    farmerName: 'Medak Farmer Producer Group',
    farmLocation: 'Medak FPO Hub, Telangana',
    fpoCluster: 'Medak Vegetable Federation',
    grade: 'B',
    availableKg: 5000,
    minOrderKg: 100,
    consumerPricePerKg: 28.00,
    farmerRealizationPerKg: 23.50,
    logisticsFeePerKg: 3.00,
    platformFeePerKg: 1.50,
    harvestDate: '2026-09-04',
    harvestHoursAgo: 48,
    coldChainTempCelsius: 14.0,
    freshnessScore: 88,
    image: '🧅',
    description: 'Cured red onions with tight skins, optimal for institutional bulk kitchens, catering, and retail distribution.',
    provenanceBatchId: 'BATCH-TS-MDK-7721',
  },
  {
    id: 'prod-cons-04',
    name: 'Potato (Jyoti Fresh Table)',
    hindiName: 'आलू (ज्योति)',
    category: 'Tubers',
    farmerName: 'Zaheerabad Farm Center',
    farmLocation: 'Zaheerabad, Sangareddy, Telangana',
    fpoCluster: 'Deccan Tuber Collective',
    grade: 'A',
    availableKg: 3500,
    minOrderKg: 100,
    consumerPricePerKg: 22.00,
    farmerRealizationPerKg: 18.00,
    logisticsFeePerKg: 2.50,
    platformFeePerKg: 1.50,
    harvestDate: '2026-09-05',
    harvestHoursAgo: 30,
    coldChainTempCelsius: 12.0,
    freshnessScore: 94,
    image: '🥔',
    description: 'Clean washed table potatoes, uniform 55mm+ sizing, low sugar content ideal for institutional cooking and fry usage.',
    provenanceBatchId: 'BATCH-TS-ZHB-6632',
  }
];

export const mockBulkDemands: BulkDemandPost[] = [
  {
    id: 'DEM-HYD-5000',
    buyerName: 'Bowenpally Institutional Wholesale & Retail Consortium',
    buyerType: 'Bulk Retail & Commercial Buyer',
    commodity: 'Tomato (Hybrid Desi)',
    requiredQuantityKg: 5000,
    maxTargetPricePerKg: 42.00,
    deliveryLocation: 'Bowenpally Agri Terminal Gate 3, Hyderabad',
    targetDate: '2026-09-07',
    status: 'Consolidated',
    allocatedFarmers: [
      { farmerName: 'Ramesh Reddy (Shadnagar FPO)', location: 'Shadnagar, Telangana', allocatedKg: 2400, grade: 'A' },
      { farmerName: 'Suresh Kumar (Chevella Unit)', location: 'Chevella, Telangana', allocatedKg: 1600, grade: 'A' },
      { farmerName: 'Laxmi Farmers Self-Help Group', location: 'Farooqnagar, Telangana', allocatedKg: 1000, grade: 'A-' },
    ],
    createdAt: '2026-09-05T08:00:00Z',
  },
  {
    id: 'DEM-VJA-3000',
    buyerName: 'Andhra Food Processors Ltd',
    buyerType: 'Food Processor & Pickles',
    commodity: 'Green Chilli (G4)',
    requiredQuantityKg: 3000,
    maxTargetPricePerKg: 58.00,
    deliveryLocation: 'Autonagar Industrial Hub, Vijayawada',
    targetDate: '2026-09-08',
    status: 'Open',
    allocatedFarmers: [
      { farmerName: 'Guntur Spice Cluster A', location: 'Guntur, AP', allocatedKg: 1200, grade: 'A-' },
      { farmerName: 'Krishna Valley Growers', location: 'Tenali, AP', allocatedKg: 600, grade: 'A' },
    ],
    createdAt: '2026-09-06T10:00:00Z',
  }
];
`);

// 4. services/mockData/mockLogisticsData.ts
write('src/services/mockData/mockLogisticsData.ts', `import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';

export const mockFleetVehicles: LogisticsFleetVehicle[] = [
  {
    id: 'veh-01',
    vehicleNumber: 'TS 08 UB 4192',
    vehicleType: 'Tata 407 Reefer',
    capacityKg: 3500,
    currentLoadKg: 2400,
    driverName: 'Mohammed Ismail',
    driverPhone: '+91 98480 22341',
    status: 'In Transit',
    reeferActive: true,
    currentTempCelsius: 6.2,
    currentLocation: 'Shamshabad ORR Corridor, Hyderabad',
    currentLat: 17.2403,
    currentLng: 78.4294,
    assignedTripId: 'TRK-RD-9021',
  },
  {
    id: 'veh-02',
    vehicleNumber: 'TS 07 EA 8831',
    vehicleType: 'Mahindra Bolero Maxi Truck',
    capacityKg: 1500,
    currentLoadKg: 1200,
    driverName: 'K. Venkateshwarlu',
    driverPhone: '+91 98480 55412',
    status: 'In Transit',
    reeferActive: false,
    currentTempCelsius: 8.5,
    currentLocation: 'Jangaon Highway Mile 42, Telangana',
    currentLat: 17.7214,
    currentLng: 79.1554,
    assignedTripId: 'TRK-RD-8812',
  },
  {
    id: 'veh-03',
    vehicleNumber: 'TS 09 XY 1029',
    vehicleType: 'Tata Ace',
    capacityKg: 1000,
    currentLoadKg: 0,
    driverName: 'Ravi Teja',
    driverPhone: '+91 98480 77319',
    status: 'Available',
    reeferActive: false,
    currentTempCelsius: 24.0,
    currentLocation: 'Bowenpally Logistics Hub Park, Hyderabad',
    currentLat: 17.4729,
    currentLng: 78.4842,
  }
];

export const mockConsolidatedTrips: ConsolidatedTrip[] = [
  {
    id: 'TRK-RD-9021',
    tripCode: 'TRIP-HYD-TOMATO-9021',
    vehicle: mockFleetVehicles[0],
    sourceHub: 'Shadnagar FPO Cluster Hub',
    destinationHub: 'Bowenpally Agri Terminal, Hyderabad',
    totalDistanceKm: 74,
    distanceCompletedKm: 46,
    commodity: 'Tomato (Hybrid Desi)',
    totalKg: 2400,
    pickups: [
      { fpoName: 'Shadnagar Organic Growers FPO', location: 'Shadnagar Gate 1', qtyKg: 1400, status: 'Loaded' },
      { fpoName: 'Chevella Smallholders Unit', location: 'Chevella Road Post', qtyKg: 1000, status: 'Loaded' },
    ],
    status: 'IN TRANSIT',
    estimatedArrival: 'Today, 05:45 PM',
    coldChainTemp: 6.2,
    spoilageRisk: 'LOW',
    returnLoad: {
      id: 'RET-HYD-WGL-01',
      route: 'Hyderabad Agri Terminal → Warangal Produce Hub',
      commodity: 'Organic Fertilizer Sacks & Nursery Seedlings',
      weightKg: 2200,
      additionalEarnings: 2800,
      emptyDistanceAvoidedKm: 142,
      isClaimed: false,
    }
  },
  {
    id: 'TRK-RD-8812',
    tripCode: 'TRIP-WGL-CHILLI-8812',
    vehicle: mockFleetVehicles[1],
    sourceHub: 'Guntur Rural Spice Hub',
    destinationHub: 'Warangal Commercial Mandi Hub',
    totalDistanceKm: 185,
    distanceCompletedKm: 185,
    commodity: 'Green Chilli (G4)',
    totalKg: 1200,
    pickups: [
      { fpoName: 'Guntur Spice Cluster A', location: 'Guntur South', qtyKg: 1200, status: 'Loaded' }
    ],
    status: 'DELIVERED',
    estimatedArrival: 'Delivered at 02:30 PM',
    coldChainTemp: 8.5,
    spoilageRisk: 'LOW',
  }
];
`);

// 5. services/consumerService.ts
write('src/services/consumerService.ts', `import { ConsumerProduct, CartItem, BulkDemandPost } from '@/types/consumer';
import { mockConsumerProducts, mockBulkDemands } from './mockData/mockConsumerProducts';

const CART_KEY = 'agriflow_consumer_cart';

export const consumerService = {
  getProducts(): Promise<ConsumerProduct[]> {
    return Promise.resolve(mockConsumerProducts);
  },

  getProductById(id: string): Promise<ConsumerProduct | null> {
    const item = mockConsumerProducts.find(p => p.id === id) || null;
    return Promise.resolve(item);
  },

  getBulkDemands(): Promise<BulkDemandPost[]> {
    return Promise.resolve(mockBulkDemands);
  },

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [
        { product: mockConsumerProducts[0], quantityKg: 100 }
      ];
    } catch {
      return [{ product: mockConsumerProducts[0], quantityKg: 100 }];
    }
  },

  addToCart(product: ConsumerProduct, quantityKg: number): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(c => c.product.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantityKg += quantityKg;
    } else {
      cart.push({ product, quantityKg });
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    return cart;
  },

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter(c => c.product.id !== productId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    return cart;
  },

  clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_KEY);
    }
  }
};
`);

// 6. services/logisticsService.ts
write('src/services/logisticsService.ts', `import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { mockFleetVehicles, mockConsolidatedTrips } from './mockData/mockLogisticsData';

export const logisticsService = {
  getFleet(): Promise<LogisticsFleetVehicle[]> {
    return Promise.resolve(mockFleetVehicles);
  },

  getTrips(): Promise<ConsolidatedTrip[]> {
    return Promise.resolve(mockConsolidatedTrips);
  },

  getTripById(id: string): Promise<ConsolidatedTrip | null> {
    const trip = mockConsolidatedTrips.find(t => t.id === id || t.tripCode === id) || null;
    return Promise.resolve(trip);
  }
};
`);

// 7. app/consumer/layout.tsx
write('src/app/consumer/layout.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Store, LayoutDashboard, Truck, FileText, ArrowLeft, Sun, Moon, Sparkles, User, PackageCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { consumerService } from '@/services/consumerService';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(1);

  React.useEffect(() => {
    const items = consumerService.getCart();
    setCartCount(items.reduce((acc, c) => acc + (c.quantityKg > 0 ? 1 : 0), 0));
  }, [pathname]);

  const publicRoutes = ['/consumer', '/consumer/login', '/consumer/register'];
  const isPublic = publicRoutes.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Marketplace', href: '/consumer/marketplace', icon: Store },
    { label: 'Bulk Procurement', href: '/consumer/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', href: '/consumer/orders', icon: PackageCheck },
    { label: 'Live Delivery', href: '/consumer/tracking/TRK-RD-9021', icon: Truck },
    { label: 'Cart', href: '/consumer/cart', icon: ShoppingCart, badge: cartCount },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar */}
      <div className="bg-blue-950 text-blue-200 text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between border-b border-blue-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>AgriFlow AI • Verified Bulk Buyer & Institutional Consumer Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3 h-3" /> Gateway
          </Link>
          <Link href="/farmer" className="hover:text-white text-emerald-400 font-bold">
            🌾 Farmer Portal
          </Link>
          <Link href="/logistics" className="hover:text-white text-amber-400 font-bold">
            🚚 Logistics Portal
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/consumer/marketplace" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/30">
              🛒
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">AgriFlow <span className="text-blue-500">Buyer</span></span>
              <span className="text-[10px] block font-medium text-slate-400">Direct Farm Gate Procurement</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-blue-500' : 'text-slate-400')} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/consumer/cart"
              className="relative p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 md:hidden"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                B
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">FreshDirect Retail</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 AgriFlow AI Buyer Portal • Verified Farm-Gate Traceability • Multi-Farmer Consolidation</p>
      </footer>
    </div>
  );
}
`);

// 8. app/consumer/page.tsx (Consumer Landing)
write('src/app/consumer/page.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck, Truck, TrendingUp, Sparkles, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function ConsumerLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 flex items-center justify-between text-slate-400">
        <Link href="/" className="hover:text-blue-400 flex items-center gap-1 font-semibold transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem Gateway
        </Link>
        <span className="text-blue-400 font-bold">Institutional Buyer & Bulk Procurement Platform</span>
      </div>

      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
              🛒
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">AgriFlow <span className="text-blue-400">Buyer</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">Farm Gate Direct</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/consumer/login">
              <Button variant="ghost" size="sm">Buyer Login</Button>
            </Link>
            <Link href="/consumer/marketplace">
              <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500">
                <span>Enter Marketplace</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/50 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Direct Farm Gate B2B & Bulk Institutional Sourcing
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mb-6">
          Procure Grade-A fresh produce direct from verified farms with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">transparent batch provenance</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Zero middleman adulteration. Transparent cost breakdowns showing exact farmer realization, cold-chain telemetry, and automated multi-farmer order fulfillment.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/consumer/marketplace" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base px-8 py-4 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/40">
              <span>Browse Farm Marketplace</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/consumer/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-base px-8 py-4">
              <span>Post Bulk Demand (5 Ton+)</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Traceable Provenance</h3>
            <p className="text-xs text-slate-400">View farmer names, geo-tagged farm coordinates, harvest timestamps, and AI defect inspection scores.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cold-Chain Reefer Telemetry</h3>
            <p className="text-xs text-slate-400">Track highway transit temperature (6°C optimal) with live spoilage risk indicators and simulated GPS.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Price Transparency Receipt</h3>
            <p className="text-xs text-slate-400">Exact itemized receipts: see 87% going directly to the farmer bank account, with transparent freight & platform fees.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
`);

// 9. app/consumer/login/page.tsx
write('src/app/consumer/login/page.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ArrowLeft } from 'lucide-react';

export default function ConsumerLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('buyer@freshdirect.in');
  const [password, setPassword] = useState('demo_password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/consumer/marketplace');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <Link href="/consumer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Buyer Portal
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <Card className="bg-slate-900 border-slate-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto mb-3 font-black text-xl">
              🛒
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Bulk Buyer / Consumer Login</h1>
            <p className="text-xs text-slate-400 mt-1">Access verified direct farm listings and track reefer freight.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Buyer Email or Phone</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500">
              Login to Buyer Platform
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
            💡 <em>Demo pre-loaded for FreshDirect Retail buyer account. Click Login to proceed.</em>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        AgriFlow AI • Buyer & Institutional Platform
      </div>
    </div>
  );
}
`);

// 10. app/consumer/marketplace/page.tsx
write('src/app/consumer/marketplace/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { consumerService } from '@/services/consumerService';
import { ConsumerProduct } from '@/types/consumer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { ShoppingCart, ShieldCheck, Thermometer, Clock, Sparkles, Filter, Check, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const [products, setProducts] = useState<ConsumerProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    consumerService.getProducts().then(setProducts);
  }, []);

  const handleAddToCart = (product: ConsumerProduct) => {
    consumerService.addToCart(product, product.minOrderKg);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const filtered = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Farm-Gate B2B Marketplace</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Direct Verified Harvests 🥦</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grade-A produce direct from farmer producer organizations with transparent price breakdowns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/consumer/dashboard">
            <Button variant="secondary" size="sm">
              <span>Post Bulk Demand (5 Ton+)</span>
            </Button>
          </Link>
          <Link href="/consumer/cart">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Vegetables', 'Spices', 'Tubers', 'Fruits'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={\`px-4 py-2 rounded-xl text-xs font-bold transition \${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }\`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((prod) => (
          <Card key={prod.id} className="p-6 flex flex-col justify-between hover:border-blue-500/50 transition shadow-sm space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-2xl flex-shrink-0">
                    {prod.image}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{prod.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{prod.hindiName} • {prod.farmLocation}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black">
                  Grade {prod.grade}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 my-3">
                {prod.description}
              </p>

              {/* Provenance & Telemetry bar */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400 text-[10px] block">Freshness</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {prod.freshnessScore}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Harvested</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {prod.harvestHoursAgo}h ago
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Transit Temp</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> {prod.coldChainTempCelsius}°C
                  </span>
                </div>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Buyer Price:</span>
                  <span className="text-base text-blue-600 dark:text-blue-400 font-black">{formatINR(prod.consumerPricePerKg)}/kg</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>↳ Net to Farmer ({Math.round(prod.farmerRealizationPerKg / prod.consumerPricePerKg * 100)}%):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(prod.farmerRealizationPerKg)}/kg</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>↳ Road Logistics & Cold-Chain:</span>
                  <span>{formatINR(prod.logisticsFeePerKg)}/kg</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>↳ AgriFlow Platform & Escrow:</span>
                  <span>{formatINR(prod.platformFeePerKg)}/kg</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link href={\`/consumer/product/\${prod.id}\`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Provenance Details
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={() => handleAddToCart(prod)}
                className={\`flex-1 \${addedId === prod.id ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}\`}
              >
                {addedId === prod.id ? (
                  <>
                    <Check className="w-4 h-4 mr-1" /> Added ({prod.minOrderKg}kg)
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-1" /> Add Min ({prod.minOrderKg}kg)
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

// 11. app/consumer/product/[id]/page.tsx
write('src/app/consumer/product/[id]/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { consumerService } from '@/services/consumerService';
import { ConsumerProduct } from '@/types/consumer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { ArrowLeft, ShieldCheck, Thermometer, Sparkles, MapPin, Truck, Check, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<ConsumerProduct | null>(null);
  const [qty, setQty] = useState<number>(100);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      consumerService.getProductById(id).then(p => {
        if (p) {
          setProduct(p);
          setQty(p.minOrderKg);
        }
      });
    }
  }, [id]);

  if (!product) {
    return <div className="p-12 text-center text-slate-400">Loading produce provenance...</div>;
  }

  const handleAdd = () => {
    consumerService.addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/consumer/marketplace" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-4xl">
                  {product.image}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">{product.name}</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{product.hindiName} • Batch: <span className="font-mono text-blue-500">{product.provenanceBatchId}</span></p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black">
                Grade {product.grade} Certified
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Farm Origin & Provenance */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" /> Farm Gate Traceability & Farmer Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Cultivating Farmer:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.farmerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Farm Cluster & District:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.farmLocation}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">FPO Affiliation:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.fpoCluster || 'Direct Individual Cluster'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Harvest Timestamp:</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{product.harvestDate} ({product.harvestHoursAgo} hours ago)</strong>
                </div>
              </div>
            </div>

            {/* Quality and Cold Chain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> AI Computer-Vision Inspection
                </span>
                <p className="text-slate-600 dark:text-slate-300">Skin integrity: 96% • Ripeness: Optimal • Rejection Risk: &lt; 1.2%</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/30 text-xs space-y-1">
                <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4" /> Cold-Chain Telemetry
                </span>
                <p className="text-slate-600 dark:text-slate-300">Carrier Temp: {product.coldChainTempCelsius}°C • Humidity: 88% RH • Safe Window: 72h+</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Purchase Card */}
        <div>
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Procurement</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Order Quantity (kg)</label>
                <input
                  type="number"
                  min={product.minOrderKg}
                  step={25}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Min order: {product.minOrderKg} kg • Available: {product.availableKg.toLocaleString()} kg</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Unit Price:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatINR(product.consumerPricePerKg)}/kg</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Farmer Realization:</span>
                  <span className="text-emerald-500 font-bold">{formatINR(product.farmerRealizationPerKg * qty)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Road Freight (Tata Reefer):</span>
                  <span>{formatINR(product.logisticsFeePerKg * qty)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Total Procurement Value:</span>
                  <span className="text-blue-600 dark:text-blue-400 text-base">{formatINR(product.consumerPricePerKg * qty)}</span>
                </div>
              </div>

              <Button
                onClick={handleAdd}
                className={\`w-full py-3 \${added ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}\`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" /> Added to Procurement Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-1.5" /> Add {qty} kg to Cart
                  </>
                )}
              </Button>

              <Link href="/consumer/cart" className="block text-center text-xs text-blue-500 hover:underline font-bold mt-2">
                Proceed to Checkout →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
`);

// 12. app/consumer/cart/page.tsx
write('src/app/consumer/cart/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { consumerService } from '@/services/consumerService';
import { CartItem } from '@/types/consumer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(consumerService.getCart());
  }, []);

  const handleRemove = (productId: string) => {
    const updated = consumerService.removeFromCart(productId);
    setCart(updated);
  };

  const totalKg = cart.reduce((acc, item) => acc + item.quantityKg, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.quantityKg * item.product.consumerPricePerKg), 0);
  const totalFarmerPayout = cart.reduce((acc, item) => acc + (item.quantityKg * item.product.farmerRealizationPerKg), 0);
  const totalLogistics = cart.reduce((acc, item) => acc + (item.quantityKg * item.product.logisticsFeePerKg), 0);
  const totalPlatform = cart.reduce((acc, item) => acc + (item.quantityKg * item.product.platformFeePerKg), 0);

  if (cart.length === 0) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto space-y-4">
        <ShoppingCart className="w-12 h-12 mx-auto text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Procurement Cart is Empty</h2>
        <p className="text-xs text-slate-400">Discover fresh harvest batches direct from verified farmer clusters.</p>
        <Link href="/consumer/marketplace">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
            Browse Marketplace
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Procurement Cart</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your direct farm purchase contracts and transparent cost distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.product.image}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.product.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      Grade {item.product.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Farmer: {item.product.farmerName} • {item.product.farmLocation}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">
                    {formatINR(item.product.consumerPricePerKg)}/kg × {item.quantityKg.toLocaleString()} kg = {formatINR(item.quantityKg * item.product.consumerPricePerKg)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white sm:hidden">
                  {formatINR(item.quantityKg * item.product.consumerPricePerKg)}
                </span>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary & Escrow Breakdown */}
        <div>
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Cost & Impact Transparency Receipt</h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Total Weight:</span>
                <span className="font-bold text-slate-900 dark:text-white">{totalKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>✓ Net Direct to Farmer (Bank):</span>
                <span>{formatINR(totalFarmerPayout)}</span>
              </div>
              <div className="flex justify-between">
                <span>Road Cold Logistics:</span>
                <span>{formatINR(totalLogistics)}</span>
              </div>
              <div className="flex justify-between">
                <span>AgriFlow Smart Escrow & Platform:</span>
                <span>{formatINR(totalPlatform)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between font-black text-base text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-blue-600 dark:text-blue-400">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
              🔒 <strong>Smart Escrow Protected:</strong> Payout released to farmer bank only after digital QR weighment scan at destination.
            </div>

            <Link href="/consumer/checkout">
              <Button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
`);

// 13. app/consumer/checkout/page.tsx
write('src/app/consumer/checkout/page.tsx', `'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { consumerService } from '@/services/consumerService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const cart = consumerService.getCart();
  const totalAmount = cart.reduce((acc, item) => acc + (item.quantityKg * item.product.consumerPricePerKg), 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setComplete(true);
    consumerService.clearCart();
  };

  if (complete) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl font-black">
          ✓
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">Order Confirmed</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Farm Direct Contract Executed</h2>
          <p className="text-xs text-slate-400 mt-2">
            Trip assigned: <strong className="text-white font-mono">TRK-RD-9021</strong> (Tata 407 Reefer • Driver Mohammed Ismail)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left space-y-2 text-slate-300">
          <div className="flex justify-between"><span>Order Reference:</span> <strong className="text-white font-mono">ORD-78921</strong></div>
          <div className="flex justify-between"><span>Escrow Lock:</span> <strong className="text-emerald-400">Active (Released on QR POD Scan)</strong></div>
          <div className="flex justify-between"><span>Estimated Delivery:</span> <strong className="text-white">Today, 05:45 PM</strong></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => router.push('/consumer/tracking/TRK-RD-9021')} className="flex-1 bg-blue-600 hover:bg-blue-500">
            <Truck className="w-4 h-4 mr-1.5" /> Track Live Reefer Freight
          </Button>
          <Button variant="secondary" onClick={() => router.push('/consumer/orders')} className="flex-1">
            View My Orders
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Confirm Farm Procurement</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lock contract escrow and schedule regional road logistics dispatch.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Destination Delivery Hub</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Receiving Facility</label>
              <input
                type="text"
                defaultValue="Bowenpally Agri Terminal Gate 3, Hyderabad"
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Receiving Manager & Phone</label>
              <input
                type="text"
                defaultValue="K. Ramana Rao (+91 98480 66712)"
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Payment & Smart Escrow Deposit</h3>
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Escrow Account: {formatINR(totalAmount || 100800)}</span>
            </div>
            <p className="text-slate-300">
              Funds are held securely in escrow and automatically released to farmer accounts upon electronic weighment verification.
            </p>
          </div>
        </Card>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full py-4 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40"
        >
          <Lock className="w-4 h-4 mr-2" /> Authorize Escrow & Dispatch Logistics ({formatINR(totalAmount || 100800)})
        </Button>
      </form>
    </div>
  );
}
`);

// 14. app/consumer/dashboard/page.tsx (Bulk Demand Hub)
write('src/app/consumer/dashboard/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { consumerService } from '@/services/consumerService';
import { BulkDemandPost } from '@/types/consumer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { Users, Plus, ShieldCheck, CheckCircle2, ArrowRight, Truck } from 'lucide-react';

export default function ConsumerDashboard() {
  const [demands, setDemands] = useState<BulkDemandPost[]>([]);

  useEffect(() => {
    consumerService.getBulkDemands().then(setDemands);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Bulk Procurement Management</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Multi-Farmer Demand Hub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aggregate high-tonnage purchase orders (5,000+ kg) that dynamically consolidate across regional farmer groups.
          </p>
        </div>
        <Link href="/consumer/marketplace">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
            <span>Marketplace Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Demands List */}
      <div className="space-y-6">
        {demands.map((demand) => (
          <Card key={demand.id} className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-400">{demand.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30 text-xs font-bold">
                    {demand.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{demand.commodity} • {demand.requiredQuantityKg.toLocaleString()} kg</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Destination: {demand.deliveryLocation}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Target Rate:</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatINR(demand.maxTargetPricePerKg)}/kg</span>
              </div>
            </div>

            {/* Allocated Farmers Pooling */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500" /> Multi-Farmer Fulfillment Allocation ({demand.allocatedFarmers.length} FPOs)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {demand.allocatedFarmers.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">{f.farmerName}</span>
                    <span className="text-[11px] text-slate-400 block">{f.location}</span>
                    <div className="flex justify-between items-center pt-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <span>{f.allocatedKg.toLocaleString()} kg</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Grade {f.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Consolidated freight savings: <strong className="text-emerald-500">38% reduction vs single farm pickup</strong></span>
              <Link href="/consumer/tracking/TRK-RD-9021">
                <Button size="sm" variant="outline">
                  <Truck className="w-4 h-4 mr-1.5" /> Track Consolidated Trip
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

// 15. app/consumer/orders/page.tsx
write('src/app/consumer/orders/page.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { Truck, ArrowRight, PackageCheck, CheckCircle2 } from 'lucide-react';

export default function ConsumerOrdersPage() {
  const orders = [
    {
      id: 'ORD-78921',
      produce: 'Tomato (Hybrid Desi)',
      quantityKg: 2400,
      grade: 'A',
      totalValue: 100800,
      farmer: 'Ramesh Reddy (Shadnagar FPO)',
      destination: 'Bowenpally Terminal Gate 3, Hyderabad',
      status: 'In Transit',
      logisticsId: 'TRK-RD-9021',
      date: '2026-09-05',
    },
    {
      id: 'ORD-78410',
      produce: 'Green Chilli (G4)',
      quantityKg: 1200,
      grade: 'A-',
      totalValue: 69600,
      farmer: 'Venkatesh Rao & Guntur Cluster',
      destination: 'Warangal Commercial Mandi Hub',
      status: 'Delivered',
      logisticsId: 'TRK-RD-8812',
      date: '2026-09-04',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Buyer Purchase Orders</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor your active road shipments, delivery proofs, and escrow settlement status.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <Card key={o.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{o.id}</span>
                <span className={\`px-2.5 py-0.5 rounded-full text-xs font-bold \${o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}\`}>
                  {o.status}
                </span>
                <span className="text-xs text-slate-400">• {o.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{o.produce} ({o.quantityKg.toLocaleString()} kg)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supplier: <strong className="text-slate-700 dark:text-slate-300">{o.farmer}</strong> • Destination: {o.destination}
              </p>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                Total Contract: {formatINR(o.totalValue)}
              </p>
            </div>

            <Link href={\`/consumer/tracking/\${o.logisticsId}\`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                <Truck className="w-4 h-4 mr-1.5" />
                <span>Track Road Shipment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

// 16. app/consumer/tracking/[id]/page.tsx
write('src/app/consumer/tracking/[id]/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { trackingService } from '@/services/trackingService';
import { RoadLogisticsTracking } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Truck, ArrowLeft, Thermometer, Clock, MapPin, CheckCircle2, ShieldCheck, RotateCcw } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function ConsumerTrackingPage() {
  const params = useParams();
  const id = (params?.id as string) || 'TRK-RD-9021';
  const [tracking, setTracking] = useState<RoadLogisticsTracking | null>(null);

  useEffect(() => {
    trackingService.getTrackingDetails(id).then(setTracking);
  }, [id]);

  if (!tracking) {
    return <div className="p-12 text-center text-slate-400">Loading delivery telemetry...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/consumer/orders" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-400 font-bold">{tracking.id}</span>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
              INCOMING COLD FREIGHT
            </span>
            <StatusBadge status={tracking.status} />
          </div>
          <h1 className="text-2xl font-black">{tracking.pickupLocation} → {tracking.destinationLocation}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vehicle: <strong className="text-white">{tracking.vehicleType} ({tracking.vehicleNumber})</strong> • Driver: {tracking.driverName}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Estimated Arrival (ETA)</span>
          <span className="text-xl font-black text-blue-400">{tracking.estimatedArrival}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-blue-400" /> Cold-Chain Climate
          </span>
          <div className="text-2xl font-black text-blue-400 mt-2">{tracking.spoilageTelemetry.temperatureCelsius}°C</div>
          <span className="text-[10px] text-slate-400">Target: {tracking.spoilageTelemetry.targetTempCelsius}°C • Low Spoilage Risk</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Safe Freshness Window
          </span>
          <div className="text-2xl font-black text-white mt-2">{tracking.spoilageTelemetry.safeWindowHours}h {tracking.spoilageTelemetry.safeWindowMinutes}m</div>
          <span className="text-[10px] text-slate-400">Humidity: {tracking.spoilageTelemetry.humidityPercent}% RH</span>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" /> Highway Progress
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-2">{tracking.progressPercent}% Complete</div>
          <span className="text-[10px] text-slate-400">{tracking.distanceRemainingKm} km remaining of {tracking.totalDistanceKm} km</span>
        </Card>
      </div>

      {/* Waypoints */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Highway Waypoint Progression</h3>
        <div className="space-y-5">
          {tracking.timeline.map((point, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 \${
                point.completed
                  ? point.current
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
                    : 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-500'
              }\`}>
                {point.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="flex-1 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{point.title}</span>
                  <span className="text-xs font-mono text-slate-400">{point.timestamp}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{point.location}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
`);

// 17. app/logistics/layout.tsx
write('src/app/logistics/layout.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Navigation, Activity, ArrowLeft, Sun, Moon, RotateCcw, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function LogisticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const publicRoutes = ['/logistics', '/logistics/login'];
  const isPublic = publicRoutes.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Fleet & Road Dispatch', href: '/logistics/dashboard', icon: Truck },
    { label: 'Active Trips', href: '/logistics/trips', icon: Navigation },
    { label: 'Live Cold-Chain Telemetry', href: '/logistics/telemetry', icon: Activity },
    { label: 'Return Load Matching', href: '/logistics/return-loads', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar */}
      <div className="bg-amber-950 text-amber-200 text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between border-b border-amber-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>AgriFlow AI • Road Logistics & Fleet Telemetry Network (Tata Ace / 407 Reefer / Mahindra Bolero)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-white flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3 h-3" /> Gateway
          </Link>
          <Link href="/farmer" className="hover:text-white text-emerald-400 font-bold">
            🌾 Farmer Portal
          </Link>
          <Link href="/consumer" className="hover:text-white text-blue-400 font-bold">
            🛒 Buyer Portal
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/logistics/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/30">
              🚚
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">AgriFlow <span className="text-amber-500">Logistics</span></span>
              <span className="text-[10px] block font-medium text-slate-400">Road Freight & Return Load AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-amber-500' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                L
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Deccan Reefer Freight</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 AgriFlow AI Logistics • Dedicated Road Freight • Zero Empty Return Hauls • Cold-Chain Integrity</p>
      </footer>
    </div>
  );
}
`);

// 18. app/logistics/page.tsx (Logistics Landing)
write('src/app/logistics/page.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Thermometer, ShieldCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function LogisticsLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 flex items-center justify-between text-slate-400">
        <Link href="/" className="hover:text-amber-400 flex items-center gap-1 font-semibold transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ecosystem Gateway
        </Link>
        <span className="text-amber-400 font-bold">Carrier & Road Fleet Platform</span>
      </div>

      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              🚚
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">AgriFlow <span className="text-amber-400">Logistics</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">Fleet Dispatch</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/logistics/login">
              <Button variant="ghost" size="sm">Carrier Login</Button>
            </Link>
            <Link href="/logistics/dashboard">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                <span>Enter Fleet Portal</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/50 border border-amber-700/60 text-amber-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> For Road Transport Operators, Reefer Trucks & Fleet Owners
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mb-6">
          Maximize vehicle utilization with automated load consolidation and <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">zero empty return hauls</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage Tata Ace, Tata 407 Reefer & Mahindra Bolero freight fleets. Monitor real-time cold-chain temperature telemetry and claim AI-matched return loads.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/logistics/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xl shadow-amber-900/40">
              <span>Open Fleet Command Center</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/logistics/return-loads" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-base px-8 py-4">
              <span>View Return Loads (Earn +₹2,800)</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Return Load Matching</h3>
            <p className="text-xs text-slate-400">Never drive back empty. Match returning reefers with fertilizer, seeds, and retail dry freight to add +₹2,800/trip.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Cold-Chain Telemetry</h3>
            <p className="text-xs text-slate-400">Maintain Reefer cargo at optimal 6°C. Live humidity and spoilage window telemetry eliminates transit damage disputes.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Stop Farm Gate Pooling</h3>
            <p className="text-xs text-slate-400">Optimized route sequence for collecting from multiple neighbor FPOs in a single corridor run.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
`);

// 19. app/logistics/login/page.tsx
write('src/app/logistics/login/page.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ArrowLeft } from 'lucide-react';

export default function LogisticsLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('+91 98480 22341');
  const [pass, setPass] = useState('demo_password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/logistics/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <Link href="/logistics" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Logistics Portal
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <Card className="bg-slate-900 border-slate-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 font-black text-xl">
              🚚
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Logistics Operator Login</h1>
            <p className="text-xs text-slate-400 mt-1">Manage dispatch fleets, driver assignments, and cold telemetry.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Carrier Phone / ID</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full py-3.5 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              Login to Fleet Management
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
            💡 <em>Pre-loaded for Deccan Reefer Transport operator (Mohammed Ismail). Click to enter.</em>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        AgriFlow AI • Road Freight Logistics Portal
      </div>
    </div>
  );
}
`);

// 20. app/logistics/dashboard/page.tsx (Fleet Command)
write('src/app/logistics/dashboard/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { logisticsService } from '@/services/logisticsService';
import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { Truck, Thermometer, RotateCcw, MapPin, Navigation, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LogisticsDashboard() {
  const [fleet, setFleet] = useState<LogisticsFleetVehicle[]>([]);
  const [trips, setTrips] = useState<ConsolidatedTrip[]>([]);

  useEffect(() => {
    logisticsService.getFleet().then(setFleet);
    logisticsService.getTrips().then(setTrips);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Road Freight Command Center</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Fleet & Dispatch Control</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dedicated road logistics for perishable farm-gate corridors (Tata 407 Reefer, Tata Ace, Mahindra Bolero).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/logistics/return-loads">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Return Load AI Match</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Road Vehicles</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">3 Vehicles</div>
          <span className="text-xs text-amber-500 font-semibold mt-1 block">2 In Transit • 1 Available</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Cold-Chain Reefer Status</span>
          <div className="text-3xl font-black text-emerald-500 mt-1">100% Optimal</div>
          <span className="text-xs text-slate-400 mt-1 block">Active unit at 6.2°C (Tomato safe)</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Return Miles Optimized</span>
          <div className="text-3xl font-black text-amber-400 mt-1">142 km saved</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">+{formatINR(2800)} added revenue/run</span>
        </Card>
      </div>

      {/* Active Fleet List */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Dedicated Road Vehicle Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fleet.map((veh) => (
            <Card key={veh.id} className="p-5 space-y-4 hover:border-amber-500/50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{veh.vehicleType}</h3>
                  <span className="font-mono text-xs font-bold text-slate-400">{veh.vehicleNumber}</span>
                </div>
                <span className={\`px-2.5 py-0.5 rounded-full text-xs font-bold \${
                  veh.status === 'In Transit' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                }\`}>
                  {veh.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <strong className="text-slate-900 dark:text-white">{veh.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Capacity / Load:</span>
                  <strong className="text-slate-900 dark:text-white">{veh.currentLoadKg} / {veh.capacityKg} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span>Reefer Cold Climate:</span>
                  <span className="font-bold text-emerald-500">{veh.reeferActive ? \`Active (\${veh.currentTempCelsius}°C)\` : 'Ambient'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="truncate max-w-[160px]">{veh.currentLocation}</span>
                </div>
              </div>

              {veh.assignedTripId ? (
                <Link href={\`/consumer/tracking/\${veh.assignedTripId}\`}>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <Navigation className="w-3.5 h-3.5 mr-1" /> Live Highway GPS
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="secondary" className="w-full mt-2">
                  Assign New Dispatch
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
`);

// 21. app/logistics/trips/page.tsx
write('src/app/logistics/trips/page.tsx', `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { logisticsService } from '@/services/logisticsService';
import { ConsolidatedTrip } from '@/types/logistics';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Truck, ArrowRight, Navigation, CheckCircle2 } from 'lucide-react';

export default function LogisticsTripsPage() {
  const [trips, setTrips] = useState<ConsolidatedTrip[]>([]);

  useEffect(() => {
    logisticsService.getTrips().then(setTrips);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Active Consolidated Trips</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor multi-stop farm pickups, transit progress, and destination arrivals.
        </p>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{trip.tripCode}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold">
                  {trip.status}
                </span>
                <span className="text-xs text-slate-400">• Carrier: {trip.vehicle.vehicleNumber}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{trip.sourceHub} → {trip.destinationHub}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-slate-400">Commodity</span>
                  <strong className="text-slate-900 dark:text-white">{trip.commodity} ({trip.totalKg} kg)</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Reefer Climate</span>
                  <strong className="text-emerald-500">{trip.coldChainTemp}°C (Low Risk)</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Distance</span>
                  <strong className="text-slate-900 dark:text-white">{trip.distanceCompletedKm} / {trip.totalDistanceKm} km</strong>
                </div>
                <div>
                  <span className="block text-slate-400">ETA</span>
                  <strong className="text-amber-500">{trip.estimatedArrival}</strong>
                </div>
              </div>
            </div>

            <Link href={\`/consumer/tracking/\${trip.id}\`}>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                <Navigation className="w-4 h-4 mr-1.5" />
                <span>Live GPS Map</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

// 22. app/logistics/telemetry/page.tsx
write('src/app/logistics/telemetry/page.tsx', `'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { Thermometer, Snowflake, Clock, ShieldCheck, Activity } from 'lucide-react';

export default function ColdChainTelemetryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Live Cold-Chain Telemetry</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Perishable safe-window tracking, reefer temperature auditing, and sensor logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tata 407 Reefer</span>
            <span className="text-xs font-mono font-bold text-amber-500">TS 08 UB 4192</span>
          </div>
          <div className="text-3xl font-black text-emerald-500">6.2°C</div>
          <p className="text-xs text-slate-400">Cargo: Tomato (Hybrid Desi) • Target: 6.0°C • Humidity: 88%</p>
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Spoilage Safe Window: 4h 32m (Low Risk)
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mahindra Bolero</span>
            <span className="text-xs font-mono font-bold text-amber-500">TS 07 EA 8831</span>
          </div>
          <div className="text-3xl font-black text-blue-400">8.5°C</div>
          <p className="text-xs text-slate-400">Cargo: Green Chilli (G4) • Target: 8.0°C • Humidity: 75%</p>
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Insulated Vent Active: Safe Window 96h+
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tata Ace</span>
            <span className="text-xs font-mono font-bold text-slate-400">TS 09 XY 1029</span>
          </div>
          <div className="text-3xl font-black text-slate-400">24.0°C</div>
          <p className="text-xs text-slate-400">Cargo: Empty (In Depot Park) • Ambient ventilated</p>
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-400">
            Available for immediate farm gate dispatch
          </div>
        </Card>
      </div>
    </div>
  );
}
`);

// 23. app/logistics/return-loads/page.tsx
write('src/app/logistics/return-loads/page.tsx', `'use client';

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { RotateCcw, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function ReturnLoadsPage() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});

  const opportunities = [
    {
      id: 'RET-HYD-WGL-01',
      route: 'Bowenpally Terminal (Hyderabad) → Warangal Hub',
      commodity: 'Organic Fertilizer Sacks & Seedlings',
      weightKg: 2200,
      additionalEarnings: 2800,
      emptyDistanceAvoidedKm: 142,
      vehicleMatch: 'Tata 407 Reefer (TS 08 UB 4192)',
    },
    {
      id: 'RET-WGL-GNT-02',
      route: 'Warangal Commercial Mandi → Guntur Agriculture Park',
      commodity: 'Clean HDPE Harvest Packaging Crates',
      weightKg: 1000,
      additionalEarnings: 1900,
      emptyDistanceAvoidedKm: 110,
      vehicleMatch: 'Mahindra Bolero (TS 07 EA 8831)',
    }
  ];

  const handleClaim = (id: string) => {
    setClaimed(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Return Load Matching AI</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Eliminate deadhead mileage by claiming non-perishable return cargo for vehicles returning to origin clusters.
        </p>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <Card key={opp.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-amber-500/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{opp.id}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold">
                  Matched for {opp.vehicleMatch}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{opp.route}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Return Cargo: <strong className="text-slate-700 dark:text-slate-200">{opp.commodity}</strong> ({opp.weightKg.toLocaleString()} kg) • Avoids <strong className="text-emerald-500">{opp.emptyDistanceAvoidedKm} km empty return haul</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
              <div className="text-left lg:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Added Operator Revenue</span>
                <span className="text-xl font-black text-emerald-500">+{formatINR(opp.additionalEarnings)}</span>
              </div>

              <Button
                onClick={() => handleClaim(opp.id)}
                className={\`\${claimed[opp.id] ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'}\`}
              >
                {claimed[opp.id] ? (
                  <>
                    <Check className="w-4 h-4 mr-1" /> Return Load Locked
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-1" /> Claim Return Load
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

// 24. app/page.tsx (Unified Gateway with all 3 portals active)
write('src/app/page.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Tractor, ShoppingCart, Truck, ShieldCheck, TrendingUp, Sparkles, Network, RotateCcw } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 text-xs py-2 px-4 text-center text-emerald-300 font-medium">
        ✨ Smart India Hackathon Live Ecosystem: <span className="text-white font-semibold">AgriFlow AI Demand, Direct Buyer & Cold Logistics Network</span>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-blue-600 to-amber-500 flex items-center justify-center text-white font-black shadow-lg">
              🌾
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">AgriFlow<span className="text-emerald-400">AI</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">Unified Gateway</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/farmer"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-950/40 transition"
            >
              Farmer
            </Link>
            <Link
              href="/consumer"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-950/40 transition"
            >
              Buyer / Consumer
            </Link>
            <Link
              href="/logistics"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-950/40 transition"
            >
              Logistics Fleet
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Direct Demand Discovery • Zero Middleman Waste • Cold-Chain Road Freight
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            One Unified Platform Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300">Farmers, Bulk Buyers & Logistics</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Choose your portal below. AgriFlow AI integrates computer-vision produce grading, direct farm-gate procurement, and optimized road logistics.
          </p>
        </div>

        {/* 3 Main Integrated Portals Gateway */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* 1. Farmer Portal Card */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/60 p-8 flex flex-col justify-between transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-950/40 hover:-translate-y-1">
            <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Active Portal
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Tractor className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Farmer / FPO Portal</h2>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                List harvests, run AI quality grading, compare mandi prices, pool produce with neighbor farmers, and track outgoing road dispatches.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>AI Quality Inspection (A, A-, B)</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Mandi Price Arbitrage & Demand Heatmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Multi-Farmer Group Produce Pooling</span>
                </li>
              </ul>
            </div>

            <Link
              href="/farmer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-950/40"
            >
              <span>Enter Farmer Experience</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* 2. Consumer / Bulk Buyer Portal */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500/60 p-8 flex flex-col justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-950/40 hover:-translate-y-1">
            <div className="absolute -top-3 right-6 bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Active Portal
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Buyer / Consumer Portal</h2>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Direct farm-gate B2B procurement, batch provenance verification, transparent receipts (87% to farmer), and smart escrow protection.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Farm Gate Traceability & Batch ID</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Price Transparency & Impact Receipt</span>
                </li>
                <li className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Post 5-Ton Bulk Procurement Demand</span>
                </li>
              </ul>
            </div>

            <Link
              href="/consumer"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-blue-950/40"
            >
              <span>Enter Buyer Experience</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* 3. Logistics Operator Portal */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 p-8 flex flex-col justify-between transition-all duration-300 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1">
            <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Active Portal
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Logistics Operator Portal</h2>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Fleet dispatch for Tata Ace, Tata 407 Reefer & Mahindra Bolero carriers with live cold-chain climate telemetry and return-load matching.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Return Load AI Match (+₹2,800/trip)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Live 6°C Cold-Chain & Spoilage Window</span>
                </li>
                <li className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Multi-Farm Consolidation Road Route</span>
                </li>
              </ul>
            </div>

            <Link
              href="/logistics"
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-amber-950/40"
            >
              <span>Enter Fleet Experience</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>

        {/* SIH Scenario Highlight Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-500/30 flex-shrink-0">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">Live Case Study</span>
                <span className="text-xs font-bold text-emerald-400">Hyderabad Tomato Value Chain</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Shadnagar FPO → Bowenpally Hub (5,000 kg Bulk Order)</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Farmer earns <strong className="text-emerald-400">+₹6.00/kg (+16.7%)</strong> over traditional mandi; Buyer saves on commission; Carrier avoids 142 km empty return haul.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <Link href="/farmer" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition">
              Farmer View
            </Link>
            <Link href="/consumer" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition">
              Buyer View
            </Link>
            <Link href="/logistics" className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition">
              Logistics View
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <p>© 2026 AgriFlow AI Ecosystem. Built for Smart India Hackathon. Fully Integrated Multi-Portal Platform.</p>
      </footer>
    </div>
  );
}
`);

console.log('All portals generated successfully!');
