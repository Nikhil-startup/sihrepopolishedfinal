'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { aiService } from '@/services/aiService';
import { ProducePool } from '@/types/farmer';
import { Users, Truck, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { translateStatus } from '@/lib/i18nHelpers';

export function GroupSellingCard() {
  const { t } = useI18n();
  const [pools, setPools] = useState<ProducePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let isMounted = true;
    aiService.getProducePools()
      .then((data) => {
        if (isMounted) setPools(data || []);
      })
      .catch(() => {
        if (isMounted) setPools([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const activePool = pools[0];

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('farmer.group.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('farmer.group.subtitle')}</p>
            </div>
          </div>
          {activePool && (
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
              {translateStatus(activePool.status, t)}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">{t('farmer.group.loading')}</div>
        ) : !activePool ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t('farmer.group.empty')}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {t('farmer.group.joinCluster', { buyerName: activePool.buyerName })}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">
                  {t('farmer.group.pooled', {
                    current: activePool.currentQuantityKg.toLocaleString(),
                    target: activePool.targetQuantityKg.toLocaleString()
                  })}
                </span>
                <span className="text-emerald-500 font-bold">
                  {t('farmer.group.targetMet', {
                    percent: Math.round((activePool.currentQuantityKg / (activePool.targetQuantityKg || 1)) * 100)
                  })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((activePool.currentQuantityKg / (activePool.targetQuantityKg || 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Participant breakdown */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{t('farmer.group.participants')}</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activePool.participants.map((p) => (
                  <div key={p.id} className={`p-2 rounded-lg border ${p.isCurrentUser ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/40 border-slate-700/60 text-slate-300'}`}>
                    <span className="font-bold block truncate">{p.farmerName}</span>
                    <span className="text-[11px] opacity-80">{p.quantityKg.toLocaleString()} kg</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings metric */}
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{t('farmer.group.sharedSavings')}</span>
              </div>
              <span className="font-bold text-emerald-400">{t('farmer.group.lowerCost', { percent: activePool.estimatedFreightSavingsPercent })}</span>
            </div>
          </>
        )}
      </div>

      {activePool && (
        <div className="flex gap-2">
          <Button
            variant={joined ? "secondary" : "primary"}
            size="sm"
            className="flex-1"
            onClick={() => setJoined(!joined)}
          >
            {joined ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t('farmer.group.joinedPool')}</> : t('farmer.group.joinPool')}
          </Button>
        </div>
      )}
    </Card>
  );
}
