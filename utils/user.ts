import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId(): string {
  const match = document.cookie.match(/(^| )user_id=([^;]+)/);
  if (match) return match[2];

  const newId = uuidv4();
  document.cookie = `user_id=${newId}; path=/; max-age=${60 * 60 * 24 * 365}`;
  return newId;
}
