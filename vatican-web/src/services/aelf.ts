// src/services/aelf.ts
import type { AelfResponse } from '../types/aelf';
import { format } from 'date-fns';

const PROXY_URL = 'https://corsproxy.io/?'; // Use a CORS proxy if needed, or try direct first.
const AELF_API_BASE = 'https://api.aelf.org/v1/messes';

export const fetchDailyReadings = async (date: Date): Promise<AelfResponse> => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  // Try direct fetch first, if it fails due to CORS, we might need a workaround or proxy.
  // In a real production app, we should proxy this through our own backend.
  // For this demo, we will try direct.

  const url = `${AELF_API_BASE}/${formattedDate}/france`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        // If direct fails, try proxy
        throw new Error('Direct fetch failed');
    }
    return await response.json();
  } catch (error) {
      console.log("Direct fetch failed, trying proxy...");
      // Fallback to proxy if available or just rethrow if we don't want to rely on public proxy
      // Using a public CORS proxy is risky for production but okay for prototypes.
      // Let's try one commonly used in demos:
      const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
          throw new Error(`Failed to fetch readings: ${response.statusText}`);
      }
      return await response.json();
  }
};
