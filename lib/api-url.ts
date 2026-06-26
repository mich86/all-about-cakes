import { headers } from 'next/headers';

export async function getApiUrl(path: string): Promise<string> {
  if (typeof window !== 'undefined') {
    return path;
  }

  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) {
    return `${configuredUrl.replace(/\/$/, '')}${path}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }

  const headersList = await headers();
  const host = headersList.get('host');
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}${path}`;
  }

  return `http://localhost:3000${path}`;
}
