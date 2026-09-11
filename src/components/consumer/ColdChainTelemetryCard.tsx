'use client';

import React from 'react';
import { ColdChainTelemetry } from '@/types/consumer';
import { Thermometer, Droplets, Clock, AlertTriangle, ShieldCheck, Snowflake } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface ColdChainTelemetryCardProps {
  telemetry: ColdChainTelemetry;
}

export const ColdChainTelemetryCard: React.FC<ColdChainTelemetryCardProps> = ({ telemetry }) => {
  const { t } = useI18n();
  const isOptimal = telemetry.riskLevel === 'Low';

  const getRiskLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return t('common.low');
      case 'medium':
        return t('common.medium');
      case 'high':
        return t('common.high');
      default:
        return level;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-cyan-500/30 shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Snowflake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              {t('consumer.coldChainTelemetry')}
              {telemetry.isSimulated && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-cyan-500/30">
                  {t('tracking.simulatedTelemetry')}
                </span>
              )}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t('consumer.reeferMonitor')}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
          isOptimal
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        }`}>
          {isOptimal ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {getRiskLabel(telemetry.riskLevel)} {t('tracking.spoilageRisk')}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> {t('temperature')}
          </div>
          <div className="text-xl font-black text-cyan-300">
            {telemetry.temperatureCelsius}°C
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {t('tracking.target')}: {telemetry.targetTempCelsius}°C
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> {t('tracking.humidity')}
          </div>
          <div className="text-xl font-black text-blue-300">
            {telemetry.humidityPercent}%
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {t('consumer.optimalRhWindow')}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t('tracking.safeFreshnessWindow')}
          </div>
          <div className="text-xl font-black text-emerald-300">
            {telemetry.safeWindowHours}h {telemetry.safeWindowMinutes}m
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {t('consumer.beforeQualityDrop')}
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 bg-zinc-800/40 p-3 rounded-xl border border-zinc-800/80">
        ℹ️ <strong className="text-zinc-200">{t('consumer.statusNote')}</strong> {telemetry.explanation}
      </p>
    </div>
  );
};

export default ColdChainTelemetryCard;

