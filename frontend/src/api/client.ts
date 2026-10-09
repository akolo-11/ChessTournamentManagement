const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  listTournaments: () => request('/tournaments'),
  getTournament: (id: string) => request(`/tournaments/${id}`),
  createTournament: (data: unknown) =>
    request('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
  addPlayer: (id: string, data: unknown) =>
    request(`/tournaments/${id}/players`, { method: 'POST', body: JSON.stringify(data) }),
  removePlayer: (tid: string, pid: string) =>
    request<void>(`/tournaments/${tid}/players/${pid}`, { method: 'DELETE' }),
  startTournament: (id: string) =>
    request(`/tournaments/${id}/start`, { method: 'POST' }),
  updateResult: (tid: string, mid: string, result: string) =>
    request(`/tournaments/${tid}/matches/${mid}/result`, {
      method: 'PUT',
      body: JSON.stringify({ result }),
    }),
  finishRound: (tid: string, n: number) =>
    request(`/tournaments/${tid}/rounds/${n}/finish`, { method: 'POST' }),
  finishTournament: (id: string) =>
  request<unknown>(`/tournaments/${id}/finish`, { method: 'POST' }),
  generatePairings: (tid: string, roundNumber: number) =>
  request<unknown>(`/tournaments/${tid}/rounds/${roundNumber}/pairings`, {
    method: 'POST',
  }),
};