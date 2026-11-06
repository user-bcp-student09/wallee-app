export interface Health {
  status: string;
  service: string;
}

// En desarrollo Vite redirige /api al backend; en contenedor lo hace nginx.
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function fetchHealth(): Promise<Health> {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error(`El backend respondió ${response.status}`);
  }
  return (await response.json()) as Health;
}
