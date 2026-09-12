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
    <Card className="flex flex-col justify-between bg-white border border-emerald-100 shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t('farmer.bestTime.title')}</h3>
              <p className="text-xs text-slate-500">{t('farmer.bestTime.subtitle')}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.7} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bbf7d0', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                      formatter={(val: unknown) => [`₹${Number(val) || 0}/kg`, t('market.price') || 'Price']}
                    />
                    <Line type="monotone" dataKey="forecastedPrice" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name={t('farmer.bestTime.forecastedMandi')} />
                    <Line type="monotone" dataKey="buyerDemandPrice" stroke="#16a34a" strokeWidth={2} strokeDasharray="4 4" name={t('farmer.bestTime.buyerDirect')} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-[#f0fdf4] rounded-xl p-3 text-xs space-y-1.5 border border-emerald-100">
                <div className="font-semibold text-slate-800">{t('farmer.bestTime.lowBandwidth')}</div>
                {trends.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>{item.day}:</span> <span className="font-bold text-slate-900">₹{item.forecastedPrice}/kg</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-100 text-xs text-slate-500 space-y-1">
        <p className="flex items-center gap-1.5 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('farmer.bestTime.realtimeNotice')}</span>
        </p>
      </div>
    </Card>
  );
}
