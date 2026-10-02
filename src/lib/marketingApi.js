const apiBase = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000';

export function postMarketing(path, payload) {
  return fetch(`${apiBase}/api/public/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
