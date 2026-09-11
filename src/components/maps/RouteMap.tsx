'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DeliveryTracking } from '@/types/delivery';
import { MapPin, PhoneCall, MessageSquare, AlertTriangle, Radio, Check, Copy, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { translateStatus } from '@/lib/i18nHelpers';

// Dynamically import Leaflet map with SSR turned off
const LiveTrackingMap = dynamic(() => import('@/components/maps/LiveTrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
        Loading...
      </span>
    </div>
  ),
});

interface RouteMapProps {
  trip: DeliveryTracking;
  isLowBandwidth?: boolean;
}

export default function RouteMap({ trip, isLowBandwidth = false }: RouteMapProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showDesperateMode, setShowDesperateMode] = useState(false);

  const smsTrackingBody = `AGRIFLOW STATUS: Trip ${trip.id} | Vehicle: ${trip.vehicleNumber} | Cargo: ${trip.produceName} (${trip.totalQuantityKg}kg) | Driver: ${trip.driverName} (${trip.driverPhone}) | Last Point: ${trip.currentLocationName} | Status: ${trip.status} | ETA: ${trip.estimatedArrival}`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsTrackingBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLowBandwidth || showDesperateMode) {
    return (
      <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {showDesperateMode ? t('tracking.maps.zeroInternetEmergency') : t('tracking.maps.lowBandwidthTextRoute')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {t('tracking.maps.bandwidthOptimized')}
            </span>
            <button
              onClick={() => setShowDesperateMode(!showDesperateMode)}
              className={`text-[10px] px-2 py-0.5 rounded font-bold border transition ${
                showDesperateMode
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              {showDesperateMode ? t('tracking.maps.backToText') : t('tracking.maps.gpsDownQuestion')}
            </button>
          </div>
        </div>

        {/* 1. Normal Low-Bandwidth Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('tracking.maps.currentPosition')}:</span>
            <strong className="text-white block mt-0.5 text-sm">{trip.currentLocationName}</strong>
            <span className="text-emerald-400 font-mono text-[11px] block mt-1">
              {t('tracking.maps.coords')}: {trip.currentCoordinates[0]}&deg; N, {trip.currentCoordinates[1]}&deg; E
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">{t('tracking.maps.nextWaypoint')}:</span>
            <strong className="text-white block mt-0.5 text-sm">
              {trip.waypoints.find((w) => !w.completed)?.title || t('tracking.maps.finalDestination')}
            </strong>
            <span className="text-slate-400 text-[11px] block mt-1">
              {t('tracking.maps.targetArrival')}: {trip.estimatedArrival}
            </span>
          </div>
        </div>

        {/* 2. Route Progress summary */}
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            {t('tracking.maps.routeProgress')}: <strong className="text-white">{trip.progressPercentage}%</strong> ({t('tracking.maps.remainingKm', { distance: String(trip.distanceRemainingKm) })})
          </span>
          <span className="font-bold text-emerald-400">{translateStatus(trip.status, t)}</span>
        </div>

        {/* 3. LAST DESPERATE RESORT / ZERO INTERNET / CELLULAR SMS & CALL FALLBACK */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-rose-950/30 border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
              {t('tracking.maps.emergencyZeroInternetTitle')}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {t('tracking.maps.emergencyZeroInternetDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Direct Driver Call */}
            <a
              href={`tel:${trip.driverPhone || '+919876543210'}`}
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/40 hover:bg-emerald-900/70 text-emerald-200 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{t('tracking.maps.directCallDriver')}</span>
                  <span className="text-[10px] text-emerald-400/80 block truncate">{trip.driverName} ({trip.driverPhone || '+91 98765 43210'})</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shrink-0">
                {t('tracking.maps.callNow')}
              </span>
            </a>

            {/* Offline SMS Gateway */}
            <a
              href={`sms:${trip.driverPhone || '+919876543210'}?body=${encodeURIComponent(smsTrackingBody)}`}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-900/40 border border-amber-500/40 hover:bg-amber-900/70 text-amber-200 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{t('tracking.maps.offlineSmsDispatch')}</span>
                  <span className="text-[10px] text-amber-400/80 block truncate">{t('tracking.maps.sendTrackingPing')}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 shrink-0">
                {t('tracking.maps.sendSms')}
              </span>
            </a>
          </div>

          {/* Copyable SMS Manifest */}
          <div className="pt-1 flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
            <span className="truncate">{smsTrackingBody}</span>
            <button
              onClick={handleCopySMS}
              className="shrink-0 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-sans font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('tracking.maps.copied') : t('tracking.maps.copyText')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <LiveTrackingMap trip={trip} />
      <div className="flex justify-end">
        <button
          onClick={() => setShowDesperateMode(true)}
          className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('tracking.maps.gpsBlindspotNotice')}</span>
        </button>
      </div>
    </div>
  );
}
