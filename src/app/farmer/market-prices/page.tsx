'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marketPriceService } from '@/services/marketPriceService';
import { MarketPrice } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { formatINR } from '@/lib/utils';
import { useBandwidth } from '@/context/BandwidthContext';
import { LiveConnectionBanner, LiveBadge } from '@/components/common/LiveConnectionState';
import { LiveConnectionState, LiveStreamSubscription } from '@/services/hybridLiveClient';
import { useI18n } from '@/context/I18nContext';

export default function MandiPricesPage() {
  const { t } = useI18n();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [liveState, setLiveState] = useState<LiveConnectionState>('LIVE');
  const [lastUpdated, setLastUpdated] = useState<string | null>(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      : 'Live Telemetry'
  );
  const subRef = useRef<LiveStreamSubscription<any> | null>(null);
  const { isLowBandwidth } = useBandwidth();

  const initPrices = useCallback(() => {
    marketPriceService.getMarketPrices()
      .then(setPrices)
      .catch(() => {
        // Retain existing prices
      });
    if (subRef.current) {
      subRef.current.unsubscribe();
    }
    subRef.current = marketPriceService.subscribeToPrices(
      (updated) => {
        setPrices(updated);
      },
      (state, _errMsg, updatedTime) => {
        setLiveState(state);
        if (updatedTime) setLastUpdated(updatedTime);
      }
    );
  }, []);

  useEffect(() => {
    initPrices();
    return () => {
      if (subRef.current) subRef.current.unsubscribe();
    };
  }, [initPrices]);

  const filtered = prices.filter(p => {
    const matchComm = selectedCommodity === 'All' || p.commodity.toLowerCase() === selectedCommodity.toLowerCase();
    const matchState = selectedState === 'All' || p.state.toLowerCase() === selectedState.toLowerCase();
    return matchComm && matchState;
  });

  const chartData = filtered.map(p => ({
    name: p.marketName.replace(' Mandi', '').replace(' (Bowenpally)', ''),
    mandiPrice: p.currentPrice,
    buyerOpportunity: p.bulkBuyerOpportunityPrice,
  }));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('farmer.mandiPricesTitle', 'Mandi Market Prices & Arbitrage')}</h1>
            <LiveBadge state={liveState} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('farmer.mandiPricesSubtitle', 'Compare daily mandi benchmarks against AgriFlow direct bulk-buyer procurement opportunities.')}
          </p>
        </div>
      </div>

      {/* Strict Real-Time Live Feed Status Banner */}
      <LiveConnectionBanner
        state={liveState}
        onRetry={() => {
          if (subRef.current) {
            subRef.current.reconnect();
          } else {
            initPrices();
          }
        }}
        lastUpdated={lastUpdated || undefined}
        streamName="APMC Mandi Auction Live Stream"
      />


      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">{t('farmer.commodity', 'Commodity')}</label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none shadow-xs"
          >
            <option value="All">{t('farmer.allCommodities', 'All Commodities')}</option>
            <option value="Tomato">{t('crop.tomato', 'Tomato')}</option>
            <option value="Green Chilli">{t('crop.greenChilli', 'Green Chilli')}</option>
            <option value="Onion">{t('crop.onion', 'Onion')}</option>
            <option value="Potato">{t('crop.potato', 'Potato')}</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 block mb-1">{t('farmer.state', 'State')}</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none shadow-xs"
          >
            <option value="All">{t('farmer.allStates', 'All States')}</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>
      </div>

      {/* Comparison Chart */}
      {!isLowBandwidth && chartData.length > 0 && (
        <Card className="p-6 bg-white border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('farmer.mandiVsBuyer', 'Mandi vs AgriFlow Buyer Realization (₹/kg)')}</h3>
              <p className="text-xs text-slate-500">{t('farmer.greenBarNote', 'Green bar represents potential higher realization through direct buyer demand')}</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.7} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 65]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#bbf7d0', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  formatter={(val: unknown) => [`₹${Number(val) || 0}/kg`, 'Price']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="mandiPrice" fill="#94a3b8" radius={[4, 4, 0, 0]} name={t('farmer.localMandiPrice', 'Local Mandi Price')} />
                <Bar dataKey="buyerOpportunity" fill="#16a34a" radius={[4, 4, 0, 0]} name={t('farmer.buyerOpportunity', 'AgriFlow Buyer Opportunity')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Mandi Table */}
      <Card className="p-6 bg-white border border-emerald-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">{t('farmer.regionalMandiBoard', 'Regional Mandi Price Board')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-100 text-slate-500">
                <th className="pb-3 font-semibold">{t('farmer.commodity', 'Commodity')}</th>
                <th className="pb-3 font-semibold">{t('farmer.marketName', 'Market Name')}</th>
                <th className="pb-3 font-semibold">{t('farmer.districtState', 'District, State')}</th>
                <th className="pb-3 font-semibold">{t('farmer.currentMandi', 'Current Mandi')}</th>
                <th className="pb-3 font-semibold">{t('farmer.change24h', '24h Change')}</th>
                <th className="pb-3 font-semibold">{t('farmer.agriflowBuyerPrice', 'AgriFlow Buyer Price')}</th>
                <th className="pb-3 font-semibold">{t('farmer.potentialGain', 'Potential Gain')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filtered.map((item) => {
                const diff = item.bulkBuyerOpportunityPrice - item.currentPrice;
                return (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{item.commodity}</td>
                    <td className="py-3 font-medium text-slate-800">{item.marketName}</td>
                    <td className="py-3 text-slate-500">{item.district}, {item.state}</td>
                    <td className="py-3 font-bold text-slate-800">{formatINR(item.currentPrice)}/kg</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-0.5 font-bold ${item.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.percentageChange}%)
                      </span>
                    </td>
                    <td className="py-3 font-black text-emerald-600 text-sm">{formatINR(item.bulkBuyerOpportunityPrice)}/kg</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        +{formatINR(diff)}/kg
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
