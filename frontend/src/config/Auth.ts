import type { Account } from '../types/Auth';

export const AUTH_CONFIG = {
  sessionKey: 'vecom_auth_session',
  useMock: true, // 本番時は false
};

// 開発用モックアカウント（本番環境では使用しない）
export const MOCK_ACCOUNTS: Account[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'member', password: 'member123', role: 'member' },
];