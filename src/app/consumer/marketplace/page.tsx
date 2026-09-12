'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { consumerService } from '@/services/consumerService';
import { ProductItem } from '@/types/consumer';
import ProductCard from '@/components/consumer/ProductCard';
import GradeFilterTabs from '@/components/consumer/GradeFilterTabs';
import { useI18n } from '@/context/I18nContext';
import { LiveConnectionBanner } from '@/components/common/LiveConnectionState';
import { LiveConnectionState } from '@/services/hybridLiveClient';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  CheckCircle2,
  Snowflake,
  RotateCw
} from 'lucide-react';
import { LiveBadge } from '@/components/common/LiveConnectionState';

export default function ConsumerMarketplacePage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveState, setLiveState] = useState<LiveConnectionState>('LIVE');
  const [lastUpdated, setLastUpdated] = useState<string | null>(() =>
    typeof window !== 'undefined'
      ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      : 'Live Telemetry'
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [coldChainOnly, setColdChainOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'freshness'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await consumerService.getProducts();
      setProducts(data || []);
      setLiveState('LIVE');
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    } catch {
      setLiveState('LIVE');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchProducts();

    const sub = consumerService.subscribeToProducts(
      (data) => {
        if (isMounted) {
          setProducts(data || []);
          setLoading(false);
        }
      },
      (state, _err, updated) => {
        if (isMounted) {
          setLiveState(state);
          if (updated) setLastUpdated(updated);
        }
      }
    );

    return () => {
      isMounted = false;
      sub.unsubscribe();
    };
  }, [fetchProducts]);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];

  const gradeCounts = useMemo(() => {
    return {
      all: products.length,
      A: products.filter(p => p.grade === 'A').length,
      B: products.filter(p => p.grade === 'B').length,
      'Organic Certified': products.filter(p => p.grade === 'Organic Certified').length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmerStory.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmerStory.district.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      // Grade
      const matchesGrade = selectedGrade === 'all' || product.grade === selectedGrade;

      // Cold Chain
      const matchesColdChain = !coldChainOnly || product.isColdChainEligible;

      return matchesSearch && matchesCategory && matchesGrade && matchesColdChain;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'freshness') {
        const order = { 'Harvested Today': 0, 'Harvested 1 Day Ago': 1, 'Harvested 2 Days Ago': 2, 'Harvested 3 Days Ago': 3, 'Harvested 4 Days Ago': 4 };
        return (order[a.freshness] ?? 99) - (order[b.freshness] ?? 99);
      }
      return 0; // recommended default
    });
  }, [products, searchQuery, selectedCategory, selectedGrade, coldChainOnly, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('consumer.directFarmGateSourcing', 'Direct Farm-Gate Sourcing')}
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-0.5">
              {t('consumer.marketplaceTitle', 'Produce Marketplace')}
            </h1>
            <LiveBadge state={liveState} />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t('consumer.marketplaceSubtitle', 'Browse verified farm harvests with transparent road freight & direct farmer realizations')}
          </p>
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Sorter */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="recommended">{t('consumer.aiRecommended', 'AI Recommended')}</option>
              <option value="freshness">{t('consumer.freshestFirst', 'Freshest First (Harvest Date)')}</option>
              <option value="price-asc">{t('consumer.priceAsc', 'Price: Low to High')}</option>
              <option value="price-desc">{t('consumer.priceDesc', 'Price: High to Low')}</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Data Connection Status Banner */}
      <LiveConnectionBanner
        state={liveState}
        onRetry={fetchProducts}
        lastUpdated={lastUpdated ?? undefined}
        streamName="Neon PostgreSQL Farm Produce Pipeline"
      />

      {/* Grade Filter Tabs */}
      <GradeFilterTabs
        selectedGrade={selectedGrade}
        onSelectGrade={setSelectedGrade}
        counts={gradeCounts}
      />

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('consumer.searchPlaceholder', 'Search produce name, farmer, location, or origin district...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat === 'All' ? t('common.all', 'All') : t(`category.${cat.toLowerCase()}`, cat)}
            </button>
          ))}
        </div>

        {/* Cold-Chain Toggle */}
        <button
          type="button"
          onClick={() => setColdChainOnly(!coldChainOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
            coldChainOnly
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
              : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
          {t('consumer.coldChainOnly', 'Cold-Chain Only')}
        </button>
      </div>

      {/* Produce Grid / List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">{t('consumer.fetchingListings', 'Fetching verified farm listings...')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 w-14 h-14 mx-auto flex items-center justify-center text-zinc-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            {t('consumer.noProductsFound', 'No produce found matching your filters')}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {t('consumer.tryResetting', 'Try resetting your search query, changing the quality grade, or disabling specific filter criteria.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedGrade('all');
              setColdChainOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
          >
            {t('consumer.clearAllFilters', 'Clear All Filters')}
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
