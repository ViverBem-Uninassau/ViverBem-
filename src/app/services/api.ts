// src/app/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Device ID — identificador único do dispositivo (UUID v4 gerado uma vez)
// ---------------------------------------------------------------------------
export function getDeviceId(): string {
  let id = localStorage.getItem('vb_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('vb_device_id', id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Scan — envia foto da embalagem para o backend identificar o medicamento
// ---------------------------------------------------------------------------
export async function scanMedication(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    headers: { 'x-device-id': getDeviceId() },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao escanear medicamento');
  return data as {
    id: string;
    name: string;
    active_ingredient: string;
    dosage: string;
    indications: string[];
    contraindications: string[];
    disclaimer: string;
  };
}

// ---------------------------------------------------------------------------
// Chat — envia mensagem de voz transcrita para a IA responder
// ---------------------------------------------------------------------------
export async function sendChat(message: string, context?: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': getDeviceId(),
    },
    body: JSON.stringify({ message, context }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao processar mensagem');
  return data as {
    response: string;
    medication_referenced: string | null;
  };
}

// ---------------------------------------------------------------------------
// Histórico — busca os últimos 15 medicamentos consultados pelo dispositivo
// ---------------------------------------------------------------------------
export async function getMedicationHistory() {
  const deviceId = getDeviceId();
  const res = await fetch(`${API_URL}/medication-history/${deviceId}`, {
    headers: { 'x-device-id': deviceId },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar histórico');
  return data as Array<{
    id: string;
    name: string;
    active_ingredient: string;
    dosage: string;
    indications: string[];
    contraindications: string[];
    disclaimer: string;
    source: 'scan' | 'chat';
  }>;
}
