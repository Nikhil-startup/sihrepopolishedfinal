export type LiveConnectionState = 'CONNECTING' | 'LIVE' | 'OFFLINE' | 'ERROR';

export interface LiveStreamSubscription<T> {
  unsubscribe: () => void;
  reconnect: () => void;
  getState: () => LiveConnectionState;
}

export function getBackendBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:8000';
}

export function getBackendWsUrl(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  return 'ws://localhost:8000';
}

/**
 * Strict Real-Time Live Client.
 * Connects to the genuine FastAPI WebSocket stream.
 * ZERO SIMULATED FALLBACK: If disconnected or unreachable, sets state to OFFLINE.
 * Does NOT generate fake GPS, temperature, or market ticks.
 */
export function createLiveStream<T>(
  wsPath: string,
  onData: (data: T) => void,
  onStateChange: (state: LiveConnectionState, errorMsg?: string) => void
): LiveStreamSubscription<T> {
  if (typeof window === 'undefined') {
    return {
      unsubscribe: () => {},
      reconnect: () => {},
      getState: () => 'OFFLINE',
    };
  }

  let socket: WebSocket | null = null;
  let currentState: LiveConnectionState = 'CONNECTING';
  let isIntentionallyClosed = false;

  const setState = (newState: LiveConnectionState, msg?: string) => {
    currentState = newState;
    onStateChange(newState, msg);
  };

  const connect = () => {
    isIntentionallyClosed = false;
    setState('CONNECTING');

    try {
      const baseWs = getBackendWsUrl();
      const cleanPath = wsPath.startsWith('/') ? wsPath : `/${wsPath}`;
      const wsUrl = `${baseWs}${cleanPath}`;

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setState('LIVE');
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          onData(parsed as T);
        } catch (e) {
          console.warn('Received non-JSON live stream frame:', e);
        }
      };

      socket.onerror = () => {
        setState('OFFLINE', 'Unable to connect to live data. Please try again later.');
      };

      socket.onclose = () => {
        if (!isIntentionallyClosed) {
          setState('OFFLINE', 'Live data connection closed.');
        }
      };
    } catch {
      setState('OFFLINE', 'Unable to connect to live data. Please try again later.');
    }
  };

  connect();

  return {
    unsubscribe: () => {
      isIntentionallyClosed = true;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      socket = null;
    },
    reconnect: () => {
      if (socket) {
        socket.close();
        socket = null;
      }
      connect();
    },
    getState: () => currentState,
  };
}
