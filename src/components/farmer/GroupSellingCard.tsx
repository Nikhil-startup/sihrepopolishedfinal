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
    <Card className="flex flex-col justify-between bg-white border border-emerald-100 shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t('farmer.group.title')}</h3>
              <p className="text-xs text-slate-500">{t('farmer.group.subtitle')}</p>
            </div>
          </div>
          {activePool && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
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
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('farmer.group.joinCluster', { buyerName: activePool.buyerName })}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">
                  {t('farmer.group.pooled', {
                    current: (activePool.currentQuantityKg ?? 0).toLocaleString(),
                    target: (activePool.targetQuantityKg ?? 0).toLocaleString()
                  })}
                </span>
                <span className="text-emerald-700 font-bold">
                  {t('farmer.group.targetMet', {
                    percent: Math.round(((activePool.currentQuantityKg ?? 0) / (activePool.targetQuantityKg || 1)) * 100)
                  })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-emerald-100/70 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round(((activePool.currentQuantityKg ?? 0) / (activePool.targetQuantityKg || 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Participant breakdown */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">{t('farmer.group.participants')}</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activePool.participants.map((p) => (
                  <div key={p.id} className={`p-2 rounded-lg border ${p.isCurrentUser ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-bold' : 'bg-[#f4fbf6] border-emerald-100 text-slate-700'}`}>
                    <span className="font-bold block truncate">{p.farmerName}</span>
                    <span className="text-[11px] opacity-80">{(p.quantityKg ?? 0).toLocaleString()} kg</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings metric */}
            <div className="bg-[#f0fdf4] border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">{t('farmer.group.sharedSavings')}</span>
              </div>
              <span className="font-black text-emerald-700">{t('farmer.group.lowerCost', { percent: activePool.estimatedFreightSavingsPercent })}</span>
            </div>
          </>
        )}
      </div>

      {activePool && (
        <div className="flex gap-2">
          <Button
            variant={joined ? "secondary" : "primary"}
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            onClick={() => setJoined(!joined)}
          >
            {joined ? <><CheckCircle2 className="w-4 h-4 text-emerald-300" /> {t('farmer.group.joinedPool')}</> : t('farmer.group.joinPool')}
          </Button>
        </div>
      )}
    </Card>
  );
}
