/**
 * @file App.tsx
 * @description アプリケーションのエントリーコンポーネント。
 * 認証状態 (AuthContext) の管理と、ログイン状態に応じた画面切り替えを担当します。
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Control } from './pages/Control'; // Controlコンポーネントをインポート
import './App.css';

// ログイン後のメイン画面コンポーネント
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <h2>VE-com 管理システム</h2>
        <div className="user-info">
          <span>ログインユーザー: <strong>{user?.username}</strong> ({user?.role})</span>
          <button type="button" onClick={logout} className="logout-button">
            ログアウト
          </button>
        </div>
      </header>

      {/* メインエリアに Control 画面を埋め込み */}
      <main className="app-main" style={{ flex: 1, overflow: 'hidden' }}>
        <Control />
      </main>
    </div>
  );
};

// ログイン状態に応じて画面を切り替える内部コンポーネント
const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  // 未ログイン時はログイン画面を表示、ログイン時はダッシュボードを表示
  return user ? <Dashboard /> : <Login />;
};

// アプリケーションルート
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}