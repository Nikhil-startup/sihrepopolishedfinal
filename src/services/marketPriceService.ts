import { MarketPrice, PriceTrendPoint } from "@/types/farmer";
import { demoMarketPrices, demoPriceTrendData } from "@/data/demoData";

export const marketPriceService = {
  async getMarketPrices(): Promise<MarketPrice[]> {
    return demoMarketPrices;
  },

  async getPriceTrends(_commodity: string): Promise<PriceTrendPoint[]> {
    return demoPriceTrendData;
  }
};