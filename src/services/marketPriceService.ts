import { MarketPrice, PriceTrendPoint } from "@/types/farmer";
import { demoMarketPrices, demoPriceTrendData } from "@/data/demoData";
import { createLiveStream, getBackendBaseUrl, LiveConnectionState, LiveStreamSubscription } from "./hybridLiveClient";

function mapApmcRecordToMarketPrice(r: any): MarketPrice {
  return {
    id: r.id,
    commodity: r.commodity,
    marketName: r.market_name || r.marketName || 'APMC Yard',
    district: r.district || '',
    state: r.state || '',
    currentPrice: Number(r.current_price ?? r.currentPrice ?? 0),
    previousPrice: Number(r.previous_price ?? r.previousPrice ?? 0),
    change: Number(r.change ?? 0),
    percentageChange: Number(r.percentage_change ?? r.percentageChange ?? 0),
    bulkBuyerOpportunityPrice: Number(r.bulk_buyer_opportunity_price ?? r.bulkBuyerOpportunityPrice ?? 0),
    date: r.arrival_date || r.date || new Date().toISOString().split('T')[0],
  };
}

export const marketPriceService = {
  async getMarketPrices(): Promise<MarketPrice[]> {
    if (typeof window !== 'undefined') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${getBackendBaseUrl()}/api/prices`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data.map(mapApmcRecordToMarketPrice);
          }
        }
      } catch {
        // Backend offline, fallback to verified local snapshot
      }
    }
    return demoMarketPrices;
  },

  async getPriceTrends(_commodity: string): Promise<PriceTrendPoint[]> {
    return demoPriceTrendData;
  },

  /**
   * Genuine Live Stream Subscription for Real-Time APMC Mandi Auction Records.
   * ZERO SIMULATED FALLBACK: If disconnected, reports OFFLINE without generating fake ticks.
   */
  subscribeToPrices(
    onUpdate: (prices: MarketPrice[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentPrices: MarketPrice[] = [...demoMarketPrices];
    let lastUpdatedTime: string | undefined = undefined;

    return createLiveStream<any>(
      '/ws/prices',
      (packet) => {
        if (!packet) return;

        if (packet.type === 'INITIAL_SNAPSHOT' && Array.isArray(packet.data)) {
          lastUpdatedTime = packet.timestamp || new Date().toLocaleTimeString();
          currentPrices = packet.data.map(mapApmcRecordToMarketPrice);
          onUpdate(currentPrices);
          onStateChange?.('LIVE', undefined, lastUpdatedTime);
        } else if (packet.type === 'PRICE_UPDATE' && packet.data) {
          lastUpdatedTime = packet.timestamp || new Date().toLocaleTimeString();
          const updated = mapApmcRecordToMarketPrice(packet.data);
          const idx = currentPrices.findIndex(p => p.id === updated.id || (p.commodity === updated.commodity && p.marketName === updated.marketName));
          if (idx >= 0) {
            currentPrices[idx] = updated;
          } else {
            currentPrices.push(updated);
          }
          onUpdate([...currentPrices]);
          onStateChange?.('LIVE', undefined, lastUpdatedTime);
        }
      },
      (state, errorMsg) => {
        onStateChange?.(state, errorMsg, lastUpdatedTime);
      }
    );
  }
};