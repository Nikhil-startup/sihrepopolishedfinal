'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { logisticsService } from '@/services/logisticsService';
import { LogisticsFleetVehicle, ConsolidatedTrip } from '@/types/logistics';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatINR } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { translateDeliveryStatus } from '@/lib/i18nHelpers';
import {
  Truck,
  Thermometer,
  RotateCcw,
  MapPin,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  AlertTriangle
} from 'lucide-react';

export default function LogisticsDashboard() {
  const { t } = useI18n();
  const [fleet, setFleet] = useState<LogisticsFleetVehicle[]>([]);
  const [trips, setTrips] = useState<ConsolidatedTrip[]>([]);

  useEffect(() => {
    logisticsService.getFleet().then(setFleet);
    logisticsService.getTrips().then(setTrips);
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Exact match to Farmer Command Center */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">{t('logistics.roadFreightCommand')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('logistics.welcomeFleet')}</span>
            <Truck className="w-6 h-6 text-amber-500 shrink-0" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('logistics.depotNotice')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/logistics/trips">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
              <Navigation className="w-4 h-4 mr-1.5" />
              <span>{t('logistics.activeRoadTrips')}</span>
            </Button>
          </Link>
          <Link href="/logistics/return-loads">
            <Button variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4 mr-1.5 text-amber-500" />
              <span>{t('logistics.returnLoadAI')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* TODAY'S TOP LOGISTICS RETURN LOAD ALERT - Mirroring Farmer Top Alert */}
      <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">{t('logistics.highOptimization')}</span>
              <span className="text-xs font-bold text-amber-300">Bowenpally &rarr; Shadnagar Corridor</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Empty Return Haul Matched (1,200 kg Organic Compost & Seedlings)</h2>
            <p className="text-xs text-slate-300">Driver Mohammed Ismail can earn <strong>+₹2,800 added revenue</strong> and avoid 68 km of empty deadhead miles.</p>
          </div>
        </div>
        <Link href="/logistics/return-loads">
          <Button variant="primary" size="sm" className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
            <span>{t('logistics.acceptReturnLoad')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Road Logistics Efficiency & Revenue Advantage - Matching FarmerImpactCard */}
      <Card variant="highlight" className="relative overflow-hidden bg-gradient-to-r from-amber-950/90 to-slate-900 border-amber-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Corridor Optimization Benchmark
            </div>
            <h3 className="text-xl font-extrabold text-white">{t('logistics.efficiencyAdvantage')}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Eliminating deadhead returns, tracking cold-chain spoilage telemetry (6.2°C), and consolidating multi-farm loads.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">{t('logistics.standardEmptyRuns')}</span>
                <span className="text-lg font-black text-slate-300">42% <span className="text-xs font-normal">{t('logistics.deadhead')}</span></span>
              </div>
              <div className="bg-amber-950/60 rounded-xl p-3.5 border border-amber-500/40">
                <span className="text-[11px] text-amber-300 block font-bold">{t('logistics.agriflowFleetLoad')}</span>
                <span className="text-xl font-black text-amber-400">91% <span className="text-xs font-normal">{t('logistics.utilized')}</span></span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">{t('logistics.addedIncomePerRun')}</span>
                <span className="text-lg font-black text-emerald-400">+₹2,800</span>
                <span className="text-[10px] text-emerald-300 block">+38% {t('logistics.netProfit')}</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">{t('logistics.reeferClimate')}</span>
                <span className="text-lg font-black text-emerald-400">6.2°C</span>
                <span className="text-[10px] text-slate-400 block">{t('logistics.lowSpoilageRisk')}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> {t('logistics.dispatchPerformance')}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{t('logistics.activeCommercialVehicles')}:</span>
                <span className="font-semibold text-white">3 Units</span>
              </div>
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>↳ {t('logistics.onTimeDeliveryRate')}:</span>
                <span>98.4%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>↳ {t('logistics.avgHighwayReeferTemp')}:</span>
                <span>6.2°C</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>↳ {t('logistics.fuelTollSavings')}:</span>
                <span className="text-emerald-400 font-bold">₹14,200{t('logistics.perMonth')}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t('logistics.vehicleHealth')}:</span>
              <span className="text-emerald-400 font-bold">100% {t('logistics.verified')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Fleet List - Clean Farmer Style Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('logistics.dedicatedFleetStatus')}</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {t('logistics.vehiclesInOps', { count: fleet.length })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleet.map((veh) => (
            <Card key={veh.id} className="p-6 space-y-4 hover:border-amber-500/50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{veh.vehicleType}</h3>
                  <span className="font-mono text-xs font-bold text-slate-400">{veh.vehicleNumber}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  veh.status === 'In Transit' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                }`}>
                  {translateDeliveryStatus(veh.status)}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{t('logistics.assignedDriver')}:</span>
                  <strong className="text-slate-900 dark:text-white">{veh.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('logistics.capacityLoad')}:</span>
                  <strong className="text-slate-900 dark:text-white">{veh.currentLoadKg} / {veh.capacityKg} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('logistics.reeferClimate')}:</span>
                  <span className="font-bold text-emerald-500">{veh.reeferActive ? `${t('logistics.activeReefer')} (${veh.currentTempCelsius}°C)` : t('logistics.ambientReefer')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('logistics.currentHub')}:</span>
                  <span className="truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-300">{veh.currentLocation}</span>
                </div>
              </div>

              {veh.assignedTripId ? (
                <Link href={`/consumer/tracking/${veh.assignedTripId}`}>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <Navigation className="w-3.5 h-3.5 mr-1" /> {t('logistics.liveHighwayTelemetry')}
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="secondary" className="w-full mt-2">
                  {t('logistics.assignNewDispatch')}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
