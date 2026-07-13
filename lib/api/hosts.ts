import { apiGet } from './client';
import type { HostDetail } from './types';

export function getHost(id: number | string): Promise<HostDetail> {
  return apiGet<HostDetail>(`/hosts/${id}`);
}
