
import { Goal, Task, UserState } from './types';

export interface BackendConfig {
  baseUrl: string;
  token: string;
  userId: string;
  enabled: boolean;
}

export function getBackendConfig(): BackendConfig {
  const saved = localStorage.getItem('amor_backend_config');
  return saved ? JSON.parse(saved) : { baseUrl: '', token: '', userId: 'amr_admin', enabled: false };
}

export function saveBackendConfig(config: BackendConfig) {
  localStorage.setItem('amor_backend_config', JSON.stringify(config));
}

export async function syncDataToHostinger(data: { goals: Goal[], tasks: Task[], userStats: UserState }) {
  const config = getBackendConfig();
  if (!config.enabled || !config.baseUrl) return { status: 'disabled' };

  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: config.token,
        userId: config.userId,
        content: data
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'سيرفر الأكاديمية لم يستجب');
    return { status: 'success', message: result.message, timestamp: result.timestamp };
  } catch (error) {
    console.error('Sync Error:', error);
    return { status: 'error', message: error instanceof Error ? error.message : 'خطأ في الاتصال بالسيرفر' };
  }
}

export async function fetchDataFromHostinger() {
  const config = getBackendConfig();
  if (!config.enabled || !config.baseUrl) return null;

  try {
    const response = await fetch(`${config.baseUrl}?token=${config.token}&userId=${config.userId}`);
    if (!response.ok) throw new Error('تعذر جلب البيانات من السيرفر');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
}
