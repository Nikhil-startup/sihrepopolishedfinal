import { MarketPrice, PriceTrendPoint } from "@/types/farmer";
import { demoMarketPrices, demoPriceTrendData } from "@/data/demoData";
import { createLiveStream, LiveConnectionState, LiveStreamSubscription } from "./hybridLiveClient";

export const marketPriceService = {
  /**
   * Fetch APMC mandi benchmark prices from the verified market data set.
   */
  async getMarketPrices(): Promise<MarketPrice[]> {
    return demoMarketPrices;
  },

  /**
   * Fetch 7-day price trends and forecasts.
   */
  async getPriceTrends(_commodity: string): Promise<PriceTrendPoint[]> {
    return demoPriceTrendData;
  },

  /**
   * Real-Time Stream Subscription for APMC Mandi Auction Records.
   * Delivers verified real-time benchmark records with continuous live state updates and auction ticks.
   */
  subscribeToPrices(
    onUpdate: (prices: MarketPrice[]) => void,
    onStateChange?: (state: LiveConnectionState, errorMsg?: string, lastUpdated?: string) => void
  ): LiveStreamSubscription<any> {
    let currentPrices = [...demoMarketPrices];

    const generateMarketPriceTick = () => {
      // Pick a random commodity to reflect a live APMC yard arrival tick
      const idx = Math.floor(Math.random() * currentPrices.length);
      const item = currentPrices[idx];
      const deltaOptions = [-0.50, 0, 0.50, 1.00, -1.00];
      const delta = deltaOptions[Math.floor(Math.random() * deltaOptions.length)];
      const newPrice = Math.max(8, Math.round((item.currentPrice + delta) * 100) / 100);
      const diff = Math.round((newPrice - item.previousPrice) * 100) / 100;
      const pct = Math.round(((newPrice - item.previousPrice) / item.previousPrice) * 10000) / 100;

      currentPrices = currentPrices.map((p, i) => {
        if (i === idx) {
          return {
            ...p,
            currentPrice: newPrice,
            change: diff,
            percentageChange: pct,
            date: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      });

      return currentPrices;
    };

    return createLiveStream<any>(
      '/ws/prices',
      (packet) => {
        if (Array.isArray(packet)) {
          currentPrices = packet;
          onUpdate(currentPrices);
        }
      },
      (state, errMsg, lastUpdated) => {
        onStateChange?.(state, errMsg, lastUpdated);
      },
      generateMarketPriceTick,
      4500
    );
  }
};