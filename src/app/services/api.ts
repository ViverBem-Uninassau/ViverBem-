// src/app/services/api.ts

const NODE_API = import.meta.env.VITE_NODE_API_URL ?? '/api';
const PYTHON_API = import.meta.env.VITE_PYTHON_API_URL ?? '/python';

function getDeviceId(): string {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('device_id', id);
  }
  return id;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': getDeviceId(),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.detail || 'Erro na requisição');
  return data as T;
}

// --- Tipos ---

export interface Alarme {
  id: string;
  medication: string;
  time: string;
  frequency: string;
  dosage?: string;
  active: boolean;
}

export interface Dose {
  id: string;
  alarm_id: string;
  medication: string;
  status: 'confirmed' | 'skipped';
  confirmed_at?: string;
  created_at: { _seconds: number };
}

export interface Medicamento {
  name: string;
  active_ingredient: string;
  dosage: string;
}

// --- Alarmes ---

export const alarmes = {
  listar: () =>
    request<Alarme[]>(`${NODE_API}/alarms/${getDeviceId()}`),

  criar: (dados: { medication: string; time: string; frequency: string; dosage?: string }) =>
    request<{ id: string }>(`${NODE_API}/alarms`, {
      method: 'POST',
      body: JSON.stringify({ ...dados, fcm_token: 'web-token' }),
    }),

  atualizar: (id: string, dados: Partial<Alarme>) =>
    request<{ message: string }>(`${NODE_API}/alarms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  remover: (id: string) =>
    request<{ message: string }>(`${NODE_API}/alarms/${id}`, { method: 'DELETE' }),
};

// --- Doses ---

export const doses = {
  confirmar: (alarm_id: string, medication: string) =>
    request<{ id: string }>(`${NODE_API}/doses/confirm`, {
      method: 'POST',
      body: JSON.stringify({ alarm_id, medication }),
    }),

  historico: () =>
    request<Dose[]>(`${NODE_API}/history/${getDeviceId()}`),
};

// --- Medicamentos (Python API) ---

export const medicamentos = {
  buscar: (name: string) =>
    request<Medicamento>(`${PYTHON_API}/medications?name=${encodeURIComponent(name)}`),
};
