'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { marketPriceService } from '@/services/marketPriceService';
import { PriceTrendPoint } from '@/types/farmer';
import { Clock, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useBandwidth } from '@/context/BandwidthContext';
import { useI18n } from '@/context/I18nContext';

export function BestTimeToSellCard() {
  const { t } = useI18n();
  const { isLowBandwidth } = useBandwidth();
  const [trends, setTrends] = useState<PriceTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    marketPriceService.getPriceTrends('Tomato')
      .then((data) => {
        if (isMounted) setTrends(data || []);
      })
      .catch(() => {
        if (isMounted) setTrends([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('farmer.bestTime.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('farmer.bestTime.subtitle')}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            {t('farmer.bestTime.liveConnected')}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">{t('farmer.bestTime.loading')}</div>
        ) : trends.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t('farmer.bestTime.empty')}
          </div>
        ) : (
          <>
            {!isLowBandwidth ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: unknown) => [`₹${Number(val) || 0}/kg`, t('market.price') || 'Price']}
                    />
                    <Line type="monotone" dataKey="forecastedPrice" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name={t('farmer.bestTime.forecastedMandi')} />
                    <Line type="monotone" dataKey="buyerDemandPrice" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" name={t('farmer.bestTime.buyerDirect')} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-slate-800/40 rounded-xl p-3 text-xs space-y-1.5 border border-slate-700">
                <div className="font-semibold text-slate-300">{t('farmer.bestTime.lowBandwidth')}</div>
                {trends.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-400">
                    <span>{item.day}:</span> <span>₹{item.forecastedPrice}/kg</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <p className="flex items-center gap-1.5 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('farmer.bestTime.realtimeNotice')}</span>
        </p>
      </div>
    </Card>
  );
}
