'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { DeliveryTracking } from '@/types/delivery';
import { sharedTrackingService, TrackingSubscriptionHandle } from '@/services/sharedTrackingService';
import { LiveConnectionState } from '@/services/hybridLiveClient';

interface TrackingContextType {
  getTrip: (id: string) => DeliveryTracking | null;
  activeTrip: DeliveryTracking | null;
  setActiveTripId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshTrip: () => Promise<void>;
  liveState: LiveConnectionState;
  lastUpdated: string | null;
  reconnectLive: () => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const DEFAULT_TRIP_ID = 'TRK-CONS-ROAD-9021';

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [activeTripId, setActiveTripId] = useState<string>(DEFAULT_TRIP_ID);
  const [activeTrip, setActiveTrip] = useState<DeliveryTracking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<LiveConnectionState>('CONNECTING');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const subRef = useRef<TrackingSubscriptionHandle | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!activeTripId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await sharedTrackingService.getTracking(activeTripId);
      setActiveTrip(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch tracking data');
      setActiveTrip(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  // Subscribe to genuine real-time IoT road telematics stream (ZERO simulated fallback)
  useEffect(() => {
    if (!activeTripId) return;

    const sub = sharedTrackingService.subscribe(
      activeTripId,
      (updatedTrip) => {
        setActiveTrip(updatedTrip);
      },
      (state, _errMsg, updatedTime) => {
        setLiveState(state);
        if (updatedTime) {
          setLastUpdated(updatedTime);
        }
      }
    );

    subRef.current = sub;

    return () => {
      sub.unsubscribe();
      subRef.current = null;
    };
  }, [activeTripId]);

  const reconnectLive = useCallback(() => {
    if (subRef.current) {
      subRef.current.reconnect();
    } else {
      fetchTrip();
    }
  }, [fetchTrip]);

  const getTrip = useCallback((id: string): DeliveryTracking | null => {
    if (id === activeTrip?.id || id === activeTrip?.tripId || id === activeTrip?.orderId) {
      return activeTrip;
    }
    return null;
  }, [activeTrip]);

  return (
    <TrackingContext.Provider
      value={{
        getTrip,
        activeTrip,
        setActiveTripId,
        isLoading,
        error,
        refreshTrip: fetchTrip,
        liveState,
        lastUpdated,
        reconnectLive,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}

