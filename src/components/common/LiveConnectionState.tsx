'use client';

import React from 'react';
import { AlertTriangle, RotateCw, Wifi, WifiOff } from 'lucide-react';
import { LiveConnectionState } from '@/services/hybridLiveClient';
import { useI18n } from '@/context/I18nContext';

interface LiveConnectionBannerProps {
  state: LiveConnectionState;
  onRetry?: () => void;
  lastUpdated?: string;
  streamName?: string;
}

export function LiveConnectionBanner({
  state,
  onRetry,
  lastUpdated,
  streamName,
}: LiveConnectionBannerProps) {
  const { t } = useI18n();
  const effectiveStream = streamName || t('common.liveDataFeed');

  if (state === 'LIVE') {
    return (
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Wifi className="w-3.5 h-3.5" />
          <span>{effectiveStream} — <strong>{t('common.live')}</strong></span>
        </div>
        {lastUpdated && (
          <span className="text-[11px] text-emerald-500/80 font-normal">
            {t('common.onlineTooltip', { time: lastUpdated })}
          </span>
        )}
      </div>
    );
  }

  if (state === 'CONNECTING') {
    return (
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 animate-pulse">
        <div className="flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
          <span>{t('common.connectingToStream', { stream: effectiveStream })}</span>
        </div>
      </div>
    );
  }

  // OFFLINE or ERROR state
  return (
    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3 shadow-sm">
      <div className="flex items-start sm:items-center gap-2.5">
        <div className="p-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-amber-800 dark:text-amber-100 flex items-center gap-2">
            <span>{t('common.unableConnectLive')}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {t('common.offline')}
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
            {lastUpdated ? t('common.cachedFallback', { time: lastUpdated }) : t('common.offlineTooltip')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t('common.reconnectRetry')}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function LiveBadge({ state }: { state: LiveConnectionState }) {
  const { t } = useI18n();

  if (state === 'LIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        {t('common.live')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
      <WifiOff className="w-3 h-3" />
      {t('common.offline')}
    </span>
  );
}

