// src/app/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Device ID — identificador único do dispositivo (UUID v4 gerado uma vez)
// ---------------------------------------------------------------------------
export function getDeviceId(): string {
  // Mantém compatibilidade com a chave antiga ('device_id') usada antes desta versão
  let id = localStorage.getItem('device_id') || localStorage.getItem('vb_device_id');
  if (!id) {
    id = crypto.randomUUID();
  }
  localStorage.setItem('device_id', id);
  return id;
}

// ---------------------------------------------------------------------------
// Helper interno para requisições JSON autenticadas
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
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
  status: 'confirmed' | 'missed';
  confirmed_at?: string;
  created_at: { _seconds: number };
}

export interface Medicamento {
  id: string;
  name: string;
  active_ingredient: string;
  dosage: string;
  indications: string[];
  contraindications: string[];
  disclaimer: string;
  source?: 'scan' | 'chat';
}

// ---------------------------------------------------------------------------
// Scan — envia foto da embalagem para o backend identificar o medicamento
// ---------------------------------------------------------------------------
export async function scanMedication(file: File): Promise<Medicamento> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    headers: { 'x-device-id': getDeviceId() },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao escanear medicamento');
  return data as Medicamento;
}

// ---------------------------------------------------------------------------
// Chat — envia mensagem de voz transcrita para a IA responder
// ---------------------------------------------------------------------------
export async function sendChat(
  message: string,
  context?: string
): Promise<{ response: string; medication_referenced: string | null }> {
  return request(`${API_URL}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

// ---------------------------------------------------------------------------
// Histórico de bulas — últimos 15 medicamentos consultados pelo dispositivo
// ---------------------------------------------------------------------------
export async function getMedicationHistory(): Promise<Medicamento[]> {
  return request(`${API_URL}/medication-history/${getDeviceId()}`);
}

// ---------------------------------------------------------------------------
// Alarmes
// ---------------------------------------------------------------------------
export const alarmes = {
  listar: () =>
    request<Alarme[]>(`${API_URL}/alarms/${getDeviceId()}`),

  criar: (dados: { medication: string; time: string; frequency: string; dosage?: string }) =>
    request<{ id: string }>(`${API_URL}/alarms`, {
      method: 'POST',
      body: JSON.stringify({ ...dados, fcm_token: 'web-token' }),
    }),

  atualizar: (id: string, dados: Partial<Alarme>) =>
    request<{ message: string }>(`${API_URL}/alarms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  remover: (id: string) =>
    request<{ message: string }>(`${API_URL}/alarms/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Doses
// ---------------------------------------------------------------------------
export const doses = {
  confirmar: (alarm_id: string, medication: string) =>
    request<{ id: string }>(`${API_URL}/doses/confirm`, {
      method: 'POST',
      body: JSON.stringify({ alarm_id, medication }),
    }),

  historico: () =>
    request<Dose[]>(`${API_URL}/history/${getDeviceId()}`),
};
