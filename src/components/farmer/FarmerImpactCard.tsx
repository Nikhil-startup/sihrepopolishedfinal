'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { aiService } from '@/services/aiService';
import { SIHScenarioData } from '@/types/farmer';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export function FarmerImpactCard() {
  const { t } = useI18n();
  const [scenario, setScenario] = useState<SIHScenarioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    aiService.getSIHScenario()
      .then((data) => {
        if (isMounted) setScenario(data);
      })
      .catch(() => {
        if (isMounted) setScenario(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <Card className="relative overflow-hidden bg-white border-2 border-emerald-100 shadow-sm rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {t('farmer.impact.advantage')}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{t('farmer.impact.title')}</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            {t('farmer.impact.subtitle', { commodity: scenario?.commodity || t('category.vegetables') })}
          </p>

          {loading ? (
            <div className="py-6 text-xs text-slate-400">{t('farmer.impact.loading')}</div>
          ) : !scenario ? (
            <div className="py-6 text-xs text-slate-400">
              {t('farmer.impact.subtitle', { commodity: t('category.vegetables') })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">{t('farmer.impact.conventionalMandi')}</span>
                <span className="text-lg font-black text-slate-800">{formatINR(scenario.conventionalPrice)}<span className="text-xs font-normal">/kg</span></span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
                <span className="text-[11px] text-emerald-800 block font-bold">{t('farmer.impact.agriflowPayout')}</span>
                <span className="text-xl font-black text-emerald-700">{formatINR(scenario.agriflowRealization)}<span className="text-xs font-normal">/kg</span></span>
              </div>
              <div className="bg-[#f4fbf6] rounded-xl p-3.5 border border-emerald-100">
                <span className="text-[11px] text-slate-600 block font-medium">{t('farmer.impact.priceImprovement')}</span>
                <span className="text-lg font-black text-emerald-700">+{formatINR(scenario.improvementPerKg)}/kg</span>
                <span className="text-[10px] text-emerald-800 block">{t('farmer.impact.gain', { percent: scenario.percentageImprovement })}</span>
              </div>
              <div className="bg-[#f4fbf6] rounded-xl p-3.5 border border-emerald-100">
                <span className="text-[11px] text-slate-600 block font-medium">{t('farmer.impact.totalEarnings')}</span>
                <span className="text-lg font-black text-emerald-700">+{formatINR(scenario.totalAdditionalRealization)}</span>
                <span className="text-[10px] text-slate-500 block">{t('farmer.impact.poolSize', { qty: (scenario.targetDemandKg ?? 0).toLocaleString() })}</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 bg-[#f4fbf6] rounded-xl p-4 border border-emerald-100 flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('farmer.impact.transparentTitle')}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t('farmer.impact.directBuyerPrice')}</span>
              <span className="font-bold text-slate-900">{scenario ? `₹${scenario.agriflowRealization + 3}/kg` : '--'}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t('farmer.impact.roadLogistics')}</span>
              <span>{scenario ? '-₹2.00/kg' : '--'}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t('farmer.impact.agriflowFee')}</span>
              <span>{scenario ? '-₹1.00/kg' : '--'}</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold text-emerald-800 text-sm">
              <span>{t('farmer.impact.netRealization')}</span>
              <span>{scenario ? `₹${scenario.agriflowRealization}/kg` : '--'}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>{t('farmer.impact.middlemen')}</span>
            <span className="text-emerald-700 font-bold">{t('farmer.impact.direct')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
