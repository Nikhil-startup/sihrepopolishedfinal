'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { useI18n } from '@/context/I18nContext';
import { Thermometer, Snowflake, Clock, ShieldCheck, Activity, Wifi } from 'lucide-react';
import { logisticsService, VehicleTelemetryDetail } from '@/services/logisticsService';
import { LiveBadge, LiveConnectionBanner } from '@/components/common/LiveConnectionState';
import { LiveConnectionState } from '@/services/hybridLiveClient';

export default function ColdChainTelemetryPage() {
  const { t } = useI18n();
  const [telemetryList, setTelemetryList] = useState<VehicleTelemetryDetail[]>([]);
  const [liveState, setLiveState] = useState<LiveConnectionState>('LIVE');
  const [lastUpdated, setLastUpdated] = useState<string | null>(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      : 'Live Telemetry'
  );

  useEffect(() => {
    const sub = logisticsService.subscribeToFleetTelemetry(
      (data) => {
        setTelemetryList(data);
      },
      (state, _err, updated) => {
        setLiveState(state);
        if (updated) setLastUpdated(updated);
      }
    );

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('logistics.liveColdChainTelemetry')}</h1>
            <LiveBadge state={liveState} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('logistics.safeWindowAudit')}
          </p>
        </div>
        {lastUpdated && (
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Telemetry Pulse: {lastUpdated}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {telemetryList.map((v) => (
          <Card key={v.vehicleId} className="p-6 space-y-4 relative overflow-hidden transition-all duration-300 hover:border-amber-500/50">
            {v.reeferActive && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{v.vehicleType}</span>
              <span className="text-xs font-mono font-bold text-amber-500">{v.vehicleNumber}</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div className={`text-3xl font-black transition-colors ${
                v.reeferActive ? 'text-emerald-500' : v.temperatureCelsius > 20 ? 'text-slate-400' : 'text-blue-400'
              }`}>
                {v.temperatureCelsius.toFixed(1)}°C
              </div>
              {v.reeferActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Snowflake className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  Reefer Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              {t('logistics.cargo')}: {v.cargo} &bull; {t('logistics.target')}: {v.targetTempCelsius.toFixed(1)}&deg;C &bull; {t('logistics.humidity')}: {v.humidityPercent}%
            </p>

            <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              v.reeferActive
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                : v.temperatureCelsius > 20
                ? 'bg-slate-800 border-slate-700 text-slate-400'
                : 'bg-blue-950/30 border-blue-500/30 text-blue-400'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {v.status === 'Available' ? (
                <span>{t('logistics.availableForDispatch')}</span>
              ) : (
                <span>
                  {t('logistics.spoilageSafeWindow')}: {t('logistics.safeWindowHrs', { hrs: v.safeWindowHours, mins: v.safeWindowMinutes })}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
