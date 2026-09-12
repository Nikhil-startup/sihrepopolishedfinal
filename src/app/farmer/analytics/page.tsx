'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { marketPriceService } from '@/services/marketPriceService';
import { aiService } from '@/services/aiService';
import { PriceTrendPoint, SIHScenarioData } from '@/types/farmer';
import { formatINR } from '@/lib/utils';
import {
  ArrowLeft,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useI18n } from '@/context/I18nContext';

export default function FarmerAnalyticsPage() {
  const { t } = useI18n();
  const [priceTrends, setPriceTrends] = useState<PriceTrendPoint[]>([]);
  const [sihData, setSihData] = useState<SIHScenarioData | null>(null);
  const [activeTab, setActiveTab] = useState<'trends' | 'realization'>('trends');

  useEffect(() => {
    marketPriceService.getPriceTrends('Tomato').then(setPriceTrends);
    aiService.getSIHScenario().then(setSihData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Back to Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 shadow-sm p-6 rounded-2xl">
        <div>
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('common.back', 'Back')}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-emerald-600" /> {t('farmer.marketAnalyticsTitle', 'Market Analytics & Forecasts')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('farmer.marketAnalyticsSubtitle', 'Real market prices, AI 7-day surge projections, and transparent net realization comparisons.')}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-[#f4faf5] p-1.5 rounded-xl border border-emerald-100">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'trends'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {t('farmer.priceTrends', 'Price Trends')}
          </button>
          <button
            onClick={() => setActiveTab('realization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'realization'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {t('farmer.realization', 'Realization')}
          </button>
        </div>
      </div>

      {/* Tab 1: Price Trends & AI Forecast */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-emerald-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tomato (Hybrid Desi) - 7-Day Mandi vs. Direct Buyer Surge</h3>
                <p className="text-xs text-slate-500">Comparing forecasted Mandi market price with direct institutional contract rates.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t('farmer.optimalWindowDay', 'Optimal Selling Window: Day +4')}
                </span>
              </div>
            </div>

            {priceTrends.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.7} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[30, 48]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#bbf7d0',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }}
                      formatter={(val: unknown) => [formatINR(Number(val) || 0) + '/kg', 'Price']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="currentMandi" stroke="#94a3b8" strokeWidth={2} name="Historic Mandi (INR/kg)" />
                    <Line type="monotone" dataKey="forecastedPrice" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="AI Forecast Mandi (INR/kg)" />
                    <Line type="monotone" dataKey="buyerDemandPrice" stroke="#16a34a" strokeWidth={2.5} strokeDasharray="4 4" name="Direct Buyer Offer (INR/kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No analytics data available yet.</div>
            )}
          </Card>

          {/* Forecast Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-white border border-emerald-100 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">{t('farmer.benchmarkMandiRate', 'Benchmark Mandi Rate')}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(38.00)}/kg</div>
              <span className="text-xs text-slate-500 mt-1 block">Bowenpally / Chevella Mandi</span>
            </Card>

            <Card className="p-5 bg-white border border-emerald-100 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">{t('farmer.surgeWindowPeak', 'Surge Window Peak (Day +4)')}</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{formatINR(41.20)}/kg</div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">+{formatINR(3.20)}/kg (+8.4%) price lift</span>
            </Card>

            <Card className="p-5 bg-white border border-emerald-100 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">{t('farmer.directBuyerRate', 'Direct Buyer Institutional Rate')}</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">{formatINR(42.00)}/kg</div>
              <span className="text-xs text-slate-500 mt-1 block">Net payout after cold freight</span>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Realization Comparison */}
      {activeTab === 'realization' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-emerald-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Conventional Intermediary vs. AgriFlow Direct Realization</h3>
            <p className="text-xs text-slate-500 mb-6">Itemized comparison on 5,000 kg lot showing net farmer bank deposits.</p>

            {sihData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-3">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Traditional Mandi Intermediary Route</span>
                  <div className="text-3xl font-black text-slate-900">{formatINR(sihData.conventionalPrice)}/kg</div>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-rose-200">
                    <div className="flex justify-between"><span>Middlemen commission (3 levels):</span> <span className="text-rose-600 font-semibold">-{formatINR(6.00)}/kg</span></div>
                    <div className="flex justify-between"><span>Unregulated weighment deductions:</span> <span className="text-rose-600 font-semibold">-{formatINR(3.00)}/kg</span></div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1"><span>Total Gross Realization (5,000 kg):</span> <span>{formatINR(sihData.conventionalPrice * 5000)}</span></div>
                  </div>
                </div>

                <div className="bg-[#f0fdf4] p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">AgriFlow Direct Institutional Route</span>
                  <div className="text-3xl font-black text-emerald-700">{formatINR(sihData.agriflowRealization)}/kg</div>
                  <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-emerald-200">
                    <div className="flex justify-between"><span>Buyer Agreed Contract Price:</span> <span className="font-bold text-slate-900">{formatINR(45.00)}/kg</span></div>
                    <div className="flex justify-between"><span>Consolidated Road Cold Freight:</span> <span>-{formatINR(2.00)}/kg</span></div>
                    <div className="flex justify-between"><span>Platform & Escrow Fee:</span> <span>-{formatINR(1.00)}/kg</span></div>
                    <div className="flex justify-between font-bold text-emerald-800 pt-1 text-sm">
                      <span>Total Net Farmer Deposit (5,000 kg):</span>
                      <span>{formatINR(sihData.agriflowRealization * 5000)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">Realization benchmark data unavailable.</div>
            )}

            {sihData && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Total Added Net Income for Farmer on this lot:</span>
                <span className="text-base font-black text-emerald-800">+{formatINR(sihData.totalAdditionalRealization)} (+{sihData.percentageImprovement}%)</span>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}