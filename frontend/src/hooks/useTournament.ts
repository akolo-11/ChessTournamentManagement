import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { mapTournament } from '../api/mappers';
import type { Tournament } from '../types';

interface State {
  tournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

export function useTournament(id: string | undefined) {
  const [state, setState] = useState<State>({ tournament: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce(n => n + 1), []);

  useEffect(() => {
    if (!id) {
      setState({ tournament: null, loading: false, error: 'Не указан ID' });
      return;
    }
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    api.getTournament(id)
      .then(raw => {
        if (cancelled) return;
        setState({ tournament: mapTournament(raw as never), loading: false, error: null });
      })
      .catch(err => {
        if (cancelled) return;
        setState({ tournament: null, loading: false, error: String(err) });
      });

    return () => { cancelled = true; };
  }, [id, nonce]);

  return { ...state, refetch };
}