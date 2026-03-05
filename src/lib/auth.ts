import { cookies } from 'next/headers';

const APP_PASSWORD = process.env.APP_PASSWORD || 'nova2026';
const COOKIE_NAME = 'sa_auth';

export function getPassword(): string {
  return APP_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === 'authenticated';
}
