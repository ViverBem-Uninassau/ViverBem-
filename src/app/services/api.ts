// src/app/services/api.ts

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
    request<Alarme[]>(`/api/alarms/${getDeviceId()}`),

  criar: (dados: { medication: string; time: string; frequency: string; dosage?: string }) =>
    request<{ id: string }>('/api/alarms', {
      method: 'POST',
      body: JSON.stringify({ ...dados, fcm_token: 'web-token' }),
    }),

  atualizar: (id: string, dados: Partial<Alarme>) =>
    request<{ message: string }>(`/api/alarms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  remover: (id: string) =>
    request<{ message: string }>(`/api/alarms/${id}`, { method: 'DELETE' }),
};

// --- Doses ---

export const doses = {
  confirmar: (alarm_id: string, medication: string) =>
    request<{ id: string }>('/api/doses/confirm', {
      method: 'POST',
      body: JSON.stringify({ alarm_id, medication }),
    }),

  historico: () =>
    request<Dose[]>(`/api/history/${getDeviceId()}`),
};

// --- Medicamentos (Python API) ---

export const medicamentos = {
  buscar: (name: string) =>
    request<Medicamento>(`/python/medications?name=${encodeURIComponent(name)}`),
};
