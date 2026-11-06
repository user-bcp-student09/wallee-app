import { useEffect, useState } from 'react';
import { fetchHealth } from './api/health';

type BackendState = { kind: 'loading' } | { kind: 'ok'; service: string } | { kind: 'error'; message: string };

export default function App() {
  const [backend, setBackend] = useState<BackendState>({ kind: 'loading' });

  useEffect(() => {
    let active = true;
    fetchHealth()
      .then((health) => active && setBackend({ kind: 'ok', service: health.service }))
      .catch((error: Error) => active && setBackend({ kind: 'error', message: error.message }));
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="app">
      <h1>Wallee</h1>
      {backend.kind === 'loading' && <p role="status">Conectando con el backend…</p>}
      {backend.kind === 'ok' && <p role="status">Backend conectado: {backend.service}</p>}
      {backend.kind === 'error' && <p role="alert">No se pudo conectar con el backend: {backend.message}</p>}
    </main>
  );
}
