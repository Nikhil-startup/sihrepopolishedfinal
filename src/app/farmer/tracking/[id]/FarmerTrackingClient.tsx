'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { trackingService } from '@/services/trackingService';
import { RoadLogisticsTracking } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Truck,
  ArrowLeft,
  Thermometer,
  Clock,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export default function FarmerTrackingClient() {
  const { t } = useI18n();
  const params = useParams();
  const id = (params?.id as string) || 'TRK-RD-9021';
  const [tracking, setTracking] = useState<RoadLogisticsTracking | null>(null);

  useEffect(() => {
    trackingService.getTrackingDetails(id).then(setTracking);
  }, [id]);

  if (!tracking) {
    return (
      <div className="py-16 text-center space-y-4">
        <Truck className="w-12 h-12 mx-auto text-emerald-500 animate-pulse" />
        <h2 className="text-xl font-bold text-slate-900">{t('consumer.fetchingGpsCoords', 'Loading Road Logistics Telemetry...')}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link href="/farmer/orders" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('farmer.backToOrders', 'Back to Orders')}
        </Link>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 shadow-sm p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-500 font-bold">{tracking.id}</span>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('farmer.roadFreightOnly', 'ROAD FREIGHT ONLY')}
            </span>
            <StatusBadge status={tracking.status} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{tracking.pickupLocation} &rarr; {tracking.destinationLocation}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carrier: <strong className="text-slate-800">{tracking.vehicleType} ({tracking.vehicleNumber})</strong> &bull; Driver: {tracking.driverName}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500 block">{t('farmer.estimatedEta', 'Estimated Arrival (ETA)')}</span>
          <span className="text-xl font-black text-emerald-700">{tracking.estimatedArrival}</span>
        </div>
      </div>

      {/* Road Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Cold chain card */}
        <Card className="bg-white border border-emerald-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-emerald-600" /> {t('logistics.liveColdChainTelemetry', 'Cold-Chain Telemetry')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Simulated GPS</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{tracking.spoilageTelemetry.temperatureCelsius}°C</div>
          <p className="text-xs text-slate-500 mt-1">
            Target: {tracking.spoilageTelemetry.targetTempCelsius}&deg;C &bull; Humidity: {tracking.spoilageTelemetry.humidityPercent}%
          </p>
        </Card>

        {/* Safe Window */}
        <Card className="bg-white border border-emerald-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> {t('farmer.spoilageSafeWindow', 'Spoilage Safe Window')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Low Risk</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {tracking.spoilageTelemetry.safeWindowHours}h {tracking.spoilageTelemetry.safeWindowMinutes}m
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('farmer.freshShelfLife', 'Produce fresh shelf-life under Reefer transit.')}</p>
        </Card>

        {/* Route Progress */}
        <Card className="bg-white border border-emerald-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> {t('farmer.routeProgress', 'Road Route Progress')}
            </span>
            <span className="text-[10px] font-bold text-emerald-700">{tracking.progressPercent}% Complete</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{tracking.distanceRemainingKm} km remaining</div>
          <p className="text-xs text-slate-500 mt-1">{t('farmer.totalTripDistance', 'Total Trip Distance: {km} km').replace('{km}', String(tracking.totalDistanceKm))}</p>
        </Card>

      </div>

      {/* Waypoint Timeline */}
      <Card className="p-6 bg-white border border-emerald-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">{t('farmer.waypointProgression', 'Road Waypoint Progression')}</h3>
        <div className="space-y-6">
          {tracking.timeline.map((point, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                point.completed
                  ? point.current
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                    : 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {point.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="flex-1 pb-4 border-b border-emerald-100 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{point.title}</span>
                  <span className="text-xs font-mono text-slate-500">{point.timestamp}</span>
                </div>
                <span className="text-xs text-slate-500 block mt-0.5">{point.location}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Return Load Matching Demo Opportunity */}
      {tracking.returnLoad && (
        <Card className="p-6 bg-[#f0fdf4] border-2 border-emerald-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center text-xl flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800">{t('logistics.returnLoadMatch', 'Return Load Matching Available')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Demo Simulation</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {tracking.returnLoad.origin} &rarr; {tracking.returnLoad.destination}
                </h4>
                <p className="text-xs text-slate-600">
                  Cargo: {tracking.returnLoad.commodity} &bull; Avoids {tracking.returnLoad.emptyDistanceAvoidedKm} km empty return run.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <span className="text-xs text-slate-500 block">{t('logistics.addedOperatorRevenue', 'Additional Carrier Earnings')}</span>
              <span className="text-lg font-black text-emerald-700">+{formatINR(tracking.returnLoad.additionalEarnings)}</span>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
