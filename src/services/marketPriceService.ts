import { MarketPrice, PriceTrendPoint } from "@/types/farmer";
import { apiClient } from "@/lib/apiClient";
import { createLiveStream, LiveConnectionState, LiveStreamSubscription } from "./hybridLiveClient";

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
  /**
   * Fetch authoritative APMC mandi benchmark prices from FastAPI / Neon PostgreSQL.
   * STRICT ZERO MOCK FALLBACK: Throws error if backend is unavailable.
   */
  async getMarketPrices(): Promise<MarketPrice[]> {
    const data = await apiClient.get<any[]>('/api/prices');
    if (!Array.isArray(data)) {
      throw new Error('LIVE_DATA_UNAVAILABLE');
    }
    return data.map(mapApmcRecordToMarketPrice);
  },

  /**
   * Fetch 7-day price trends from backend.
   */
  async getPriceTrends(commodity: string): Promise<PriceTrendPoint[]> {
    try {
      return await apiClient.get<PriceTrendPoint[]>(`/api/prices/trends/${encodeURIComponent(commodity)}`);
    } catch {
      throw new Error('LIVE_DATA_UNAVAILABLE');
    }
  },

  /**
   * Real-Time WebSocket stream for APMC Mandi Auction Records.
   * Receives initial snapshot from PostgreSQL on connection.
   * Reports OFFLINE if disconnected, with ZERO simulated fake ticks.
   */
  subscribeToPrices(
    onUpdate: (prices: MarketPrice[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentPrices: MarketPrice[] = [];
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
          const idx = currentPrices.findIndex(
            p => p.id === updated.id || (p.commodity === updated.commodity && p.marketName === updated.marketName)
          );
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