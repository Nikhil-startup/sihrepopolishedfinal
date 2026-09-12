'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { aiService } from '@/services/aiService';
import { DemandZone } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useBandwidth } from '@/context/BandwidthContext';
import { MapPin, Sparkles, TrendingUp, AlertCircle, Users, ArrowRight, Lightbulb } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export default function DemandMapPage() {
  const { t } = useI18n();
  const [zones, setZones] = useState<DemandZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DemandZone | null>(null);
  const { isLowBandwidth, toggleLowBandwidth } = useBandwidth();

  useEffect(() => {
    aiService.getDemandZones().then((res) => {
      setZones(res);
      setSelectedZone(res[0]);
    });
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('farmer.demandMapTitle', 'Agricultural Demand Intelligence Map')}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('farmer.demandMapSubtitle', 'Real-time supply deficits, bulk buyer concentrations, and regional price arbitrage across India.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isLowBandwidth ? "primary" : "secondary"} size="sm" onClick={toggleLowBandwidth}>
            {isLowBandwidth ? t('farmer.lowBandwidthActive', 'Low-Bandwidth Table Mode (Active)') : t('farmer.switchToTable', 'Switch to Table View')}
          </Button>
        </div>
      </div>

      {/* Main Map + Side Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Leaflet Map or Fallback Table */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden h-[500px] flex flex-col justify-between bg-white border border-emerald-100 shadow-sm">
            {!isLowBandwidth ? (
              <div className="relative w-full h-full bg-[#f4faf5] flex flex-col items-center justify-center p-6 text-center">
                {/* Simulated Interactive SVG Agricultural Regional Map */}
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-white to-[#e8f7ec] p-6 flex flex-col justify-between border border-emerald-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {t('farmer.liveRegionalHubs', 'Live India Regional Hubs')}
                    </span>
                    <span className="text-slate-400">{t('farmer.clientRendered', 'Client Rendered (Zero Latency)')}</span>
                  </div>

                  {/* Hotspots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                    {zones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedZone?.id === zone.id
                            ? 'bg-white border-2 border-emerald-500 shadow-md shadow-emerald-600/10 scale-[1.02]'
                            : 'bg-white/90 border border-emerald-100 hover:border-emerald-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{zone.region}</span>
                          <StatusBadge status={zone.opportunityLevel} />
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1">
                          <div className="flex justify-between"><span>{t('farmer.demand', 'Demand')}:</span> <strong className="text-slate-900">{(zone.demandKg ?? 0).toLocaleString()} kg</strong></div>
                          <div className="flex justify-between"><span>{t('farmer.localSupply', 'Local Supply')}:</span> <span className="text-slate-700">{(zone.supplyKg ?? 0).toLocaleString()} kg</span></div>
                          <div className="flex justify-between font-bold text-emerald-700"><span>{t('farmer.supplyGap', 'Supply Gap')}:</span> <span>{(zone.gapKg ?? 0) > 0 ? `+${(zone.gapKg ?? 0).toLocaleString()} kg` : t('farmer.excessSupply', 'Excess Supply')}</span></div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-emerald-100">
                    <span>{t('common.selected', 'Selected')}: <strong className="text-slate-900">{selectedZone?.region || 'None'}</strong></span>
                    <span className="text-emerald-700 font-bold">{t('farmer.activeBidders', '{count} Active Direct Bidders').replace('{count}', String(selectedZone?.buyerCount || 0))}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Low-Bandwidth Fallback Table */
              <div className="p-6 overflow-y-auto h-full bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-3">{t('farmer.regionalDemandData', 'Regional Demand Data (Low-Bandwidth Mode)')}</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-100 text-slate-500">
                      <th className="pb-2">{t('farmer.region', 'Region')}</th>
                      <th className="pb-2">{t('farmer.commodity', 'Commodity')}</th>
                      <th className="pb-2">{t('farmer.demand', 'Demand')}</th>
                      <th className="pb-2">{t('farmer.localSupply', 'Supply')}</th>
                      <th className="pb-2">{t('farmer.deficitGap', 'Deficit Gap')}</th>
                      <th className="pb-2">{t('farmer.opportunity', 'Opportunity')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50">
                    {zones.map((z) => (
                      <tr key={z.id} onClick={() => setSelectedZone(z)} className="cursor-pointer hover:bg-emerald-50/50 transition-colors">
                        <td className="py-2.5 font-bold text-slate-900">{z.region}</td>
                        <td className="py-2.5 text-slate-700">{z.commodity}</td>
                        <td className="py-2.5 text-slate-900 font-semibold">{(z.demandKg ?? 0).toLocaleString()} kg</td>
                        <td className="py-2.5 text-slate-600">{(z.supplyKg ?? 0).toLocaleString()} kg</td>
                        <td className="py-2.5 font-bold text-emerald-700">{(z.gapKg ?? 0) > 0 ? `+${(z.gapKg ?? 0).toLocaleString()} kg` : 'Surplus'}</td>
                        <td className="py-2.5"><StatusBadge status={z.opportunityLevel} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Selected Hub Side Panel */}
        <div>
          {selectedZone ? (
            <Card className="p-6 space-y-4 bg-white border-2 border-emerald-200 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('farmer.opportunityIntel', 'Opportunity Intel')}</span>
                <StatusBadge status={selectedZone.opportunityLevel} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedZone.region}</h3>
                <span className="text-xs text-slate-500">{selectedZone.state} &bull; {t('farmer.commodity', 'Commodity')}: <strong className="text-slate-800">{selectedZone.commodity}</strong></span>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-emerald-100">
                <div className="flex justify-between text-slate-600">
                  <span>{t('farmer.buyerInflow', 'Buyer Inflow Demand')}:</span>
                  <span className="font-bold text-slate-900">{(selectedZone.demandKg ?? 0).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t('farmer.localHubSupply', 'Local Hub Supply')}:</span>
                  <span className="text-slate-700">{(selectedZone.supplyKg ?? 0).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 text-sm">
                  <span>{t('farmer.deficitGap', 'Supply Deficit Gap')}:</span>
                  <span>+{(selectedZone.gapKg ?? 0).toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-2 border-t border-emerald-100">
                  <span>{t('farmer.offeredPrice', 'Offered Price')}:</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(selectedZone.pricePerKg ?? 0)}/kg</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('farmer.smartRec', 'Smart Recommendation')}:</span>
                </span>
                <p>Consolidate Shadnagar Tomato harvest. Dispatch via Tata 407 Reefer to capture +₹4.00/kg premium over local mandi.</p>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <span>{t('farmer.dispatchLotTo', 'Dispatch Lot to {region}').replace('{region}', (selectedZone.region || 'Hub').split(' ')[0])}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          ) : (
            <Card className="p-6 text-center text-slate-500 bg-white border border-emerald-100">{t('farmer.selectZonePrompt', 'Select a zone on the map')}</Card>
          )}
        </div>

      </div>

    </div>
  );
}
