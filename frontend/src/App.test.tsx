import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

function mockFetch(response: Partial<Response> | Error) {
  const fetchMock = response instanceof Error ? vi.fn().mockRejectedValue(response) : vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the backend as connected', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ status: 'ok', service: 'wallee-backend' }) });

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Conectando');
    expect(await screen.findByText('Backend conectado: wallee-backend')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/health');
  });

  it('shows an error when the backend answers with a failure', async () => {
    mockFetch({ ok: false, status: 503 });

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('El backend respondió 503');
  });

  it('shows an error when the backend is unreachable', async () => {
    mockFetch(new Error('Failed to fetch'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to fetch');
  });

  it('ignores the result once unmounted', () => {
    mockFetch({ ok: true, json: async () => ({ status: 'ok', service: 'wallee-backend' }) });

    const { unmount } = render(<App />);

    expect(() => unmount()).not.toThrow();
  });
});
