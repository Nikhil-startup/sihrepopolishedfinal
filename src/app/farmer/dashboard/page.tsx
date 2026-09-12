'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { farmerService } from '@/services/farmerService';
import { trackingService } from '@/services/trackingService';
import { aiService } from '@/services/aiService';
import { Produce, Order, AIRecommendation } from '@/types/farmer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  TrendingUp,
  Sprout,
  Plus,
  ArrowRight,
  Truck,
  MapPin,
  Sparkles,
  BarChart3,
  PackageCheck,
  CheckCircle2,
  Thermometer
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { translateQualityGrade, translateOrderStatus, translateDeliveryStatus } from '@/lib/i18nHelpers';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    farmerService.getProduceList()
      .then(data => {
        if (isMounted) {
          setProduceList(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduceList([]);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const topRec = recommendations[0];
  const activeOrder = orders.find(o => o.status === 'In Transit') || orders[0];

  const displayName = (user?.name || 'Farmer').replace(/[\uD800-\uDFFF]|[\u2600-\u27BF]|\u00f0[^\s]*|\u00e2[^\s]*/g, '').trim() || 'Farmer';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{t('farmer.commandCenter')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('farmer.namaste')}, {displayName}</span>
            <Sprout className="w-6 h-6 text-emerald-500 shrink-0" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center flex-wrap gap-1">
            {user?.farmName && (
              <>
                <span>{user.farmName}</span>
                <span className="text-slate-400">&bull;</span>
              </>
            )}
            <span>{user?.location || t('farmer.directFarm')}</span>
          </p>
        </div>
        <div>
          <Link href="/farmer/analytics">
            <Button variant="outline" size="sm" className="font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
              <BarChart3 className="w-4 h-4 mr-1.5 text-emerald-500" />
              <span>{t('farmer.viewAnalytics')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. REAL-TIME AI DEMAND ALERT */}
      <div className="bg-gradient-to-r from-emerald-900/80 to-slate-900 border-2 border-emerald-500/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-2xl flex-shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">{t('farmer.highOpportunity')}</span>
              <span className="text-xs font-bold text-emerald-300">Hyderabad Urban Corridor</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Tomato demand is 18% above local supply (1,800 kg deficit)</h2>
            <p className="text-xs text-slate-300">Bowenpally direct buyer offering <strong>₹42.00/kg</strong> vs current mandi ₹38.00/kg.</p>
          </div>
        </div>
        <Link href="/farmer/recommendations" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto flex-shrink-0">
            <span>{t('farmer.viewOpportunity')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('farmer.quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/farmer/produce" className="block">
            <div className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition transform active:scale-95 h-28">
              <Plus className="w-7 h-7 mb-1.5" />
              <span className="font-bold text-sm">{t('farmer.addProduce')}</span>
            </div>
          </Link>
          <Link href="/farmer/market-prices" className="block">
            <div className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-700 transition transform active:scale-95 h-28">
              <TrendingUp className="w-7 h-7 mb-1.5 text-emerald-400" />
              <span className="font-bold text-sm">{t('nav.marketPrices')}</span>
            </div>
          </Link>
          <Link href="/farmer/demand-map" className="block">
            <div className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-700 transition transform active:scale-95 h-28">
              <MapPin className="w-7 h-7 mb-1.5 text-blue-400" />
              <span className="font-bold text-sm">{t('nav.demandMap')}</span>
            </div>
          </Link>
          <Link href="/farmer/recommendations" className="block">
            <div className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-700 transition transform active:scale-95 h-28">
              <Sparkles className="w-7 h-7 mb-1.5 text-amber-400" />
              <span className="font-bold text-sm">{t('nav.recommendations')}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. ACTIVE ROAD TELEMETRY */}
      <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t('farmer.activeLogistics')}</h3>
              <p className="text-xs text-slate-400">Tata 407 Reefer (TS 08 UB 4192) &bull; Driver: Mohammed Ismail</p>
            </div>
          </div>
          <Link href="/farmer/tracking/TRK-9821">
            <Button size="sm" variant="outline" className="text-xs border-slate-700 hover:bg-slate-800">
              {t('farmer.liveMap')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">{t('farmer.currentStatus')}</span>
            <span className="text-sm font-bold text-amber-400 block mt-0.5">{translateDeliveryStatus('IN_TRANSIT')} (ORR Tollway)</span>
            <span className="text-[10px] text-slate-400">{t('farmer.speed')}: 52 km/h</span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">{t('farmer.coldChainTemp')}</span>
            <span className="text-sm font-bold text-emerald-400 block mt-0.5 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" /> 6.2°C ({t('common.optimal')})
            </span>
            <span className="text-[10px] text-slate-400">{t('farmer.targetTemp')}: 6.0°C</span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">{t('farmer.remainingSafeWindow')}</span>
            <span className="text-sm font-bold text-white block mt-0.5">4h 30m</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block uppercase">{t('farmer.distanceRemaining')}</span>
            <span className="font-bold text-white text-xs mt-0.5 block">38 km</span>
          </div>
        </div>
      </Card>

      {/* 4. MY PRODUCE PREVIEW */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('farmer.myProduceInventory')}</h3>
              <span className="text-xs text-slate-400">{t('farmer.activeProduceListings', { count: produceList.length })}</span>
            </div>
          </div>
          <Link href="/farmer/produce" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
            <span>{t('farmer.viewAllWithCount', { count: produceList.length })}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">{t('farmer.loadingInventory')}</div>
        ) : produceList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <p>{t('farmer.noProduceYet')}</p>
            <Link href="/farmer/produce">
              <Button size="sm" className="bg-emerald-600 text-white">{t('farmer.addFirstCrop')}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {produceList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.crop}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                        {translateQualityGrade(item.grade)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('farmer.availableQty')}: <strong className="text-slate-700 dark:text-slate-300">{item.quantity?.toLocaleString()} {item.unit}</strong> &bull; {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block">{t('farmer.expectedPrice')}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatINR(item.expectedPrice)}/{item.unit}
                    </span>
                  </div>
                  <Link href="/farmer/produce">
                    <Button size="sm" variant="secondary" className="px-3 py-1.5 text-xs">
                      {t('farmer.edit')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 5. ACTIVE ORDERS */}
      {activeOrder && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('farmer.activeOrders')}</h3>
                <span className="text-xs text-slate-400">{t('farmer.roadDeliveryInProgress')}</span>
              </div>
            </div>
            <Link href="/farmer/orders">
              <Button size="sm" variant="outline">
                <span>{t('farmer.viewAllWithCount', { count: orders.length })}</span>
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-slate-400 font-bold">{activeOrder.id}</span>
                <h4 className="text-base font-bold text-white">{activeOrder.produceName} ({activeOrder.quantityKg?.toLocaleString()} kg)</h4>
                <p className="text-xs text-slate-300">{t('farmer.buyer')}: {activeOrder.buyerName}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">{t('farmer.orderValue')}:</span>
                <span className="text-lg font-black text-emerald-400">{formatINR(activeOrder.totalOrderValue)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">{t('farmer.currentStatus')}: <strong className="text-white">{translateOrderStatus(activeOrder.status)}</strong></span>
                <span className="text-slate-500">&bull; {activeOrder.destinationCity}</span>
              </div>
              <Link href={`/farmer/tracking/${activeOrder.logisticsId}`} className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Truck className="w-3.5 h-3.5 mr-1.5" /> {t('farmer.trackDelivery')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* 6. IMPORTANT RECOMMENDATION */}
      {topRec && (
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t('farmer.importantAiRec')}</h3>
              <span className="text-xs text-slate-400">{t('farmer.optimalSellingWindow')}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{t('farmer.recommendedAction')}</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{topRec.actionText}</h4>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">{t('farmer.why')}</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{topRec.summary}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {t('farmer.expectedImprovement')}: +{formatINR(topRec.expectedImprovementPerKg)}/kg
              </span>
              <Link href="/farmer/recommendations">
                <Button size="sm" variant="outline">
                  {t('farmer.viewFullRecs')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* 7. VIEW ANALYTICS FOOTER CTA */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('farmer.analyticsCtaTitle')}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {t('farmer.analyticsCtaDesc')}
        </p>
        <Link href="/farmer/analytics" className="inline-block">
          <Button variant="outline" size="sm" className="font-bold flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 mr-1 text-emerald-500" />
            <span>{t('farmer.openAnalytics')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

    </div>
  );
}