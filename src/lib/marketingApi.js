import { siteConfig } from './siteConfig';

const apiBase = siteConfig.apiBaseUrl;

export function postMarketing(path, payload) {
  return fetch(`${apiBase}/api/public/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
