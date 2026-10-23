const BASE = '/api';

let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(`${BASE}${path}`, { headers, ...init });

  // Пробуем обновить access token, если он истёк
  if (res.status === 401 && refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(`${BASE}${path}`, { headers, ...init });
    } else {
      clearTokens();
    }
  }

  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? (undefined as T) : res.json();
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  // auth
  register: (username: string, password: string) =>
    request<unknown>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  login: (username: string, password: string) =>
    request<{ access_token: string; refresh_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<{ id: string; username: string; role: string }>('/auth/me'),
  
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
  createJudge: (data: any) => request('/auth/judges', { method: 'POST', body: JSON.stringify(data) }),
  getJudges: () => request('/auth/judges', { method: 'GET' }), // если добавите эндпоинт списка судей на бэкенде
  assignJudge: (tid: string, judgeId: string) => request(`/tournaments/${tid}/assign-judge`, { method: 'POST', body: JSON.stringify({ judge_id: judgeId }) }),
};