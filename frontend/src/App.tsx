import React from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';

import { Login } from './pages/Login';

import './App.css';



// ログイン後のメイン画面コンポーネント

const Dashboard: React.FC = () => {

  const { user, logout } = useAuth();



  return (

    <div className="dashboard-container">

      <header className="app-header">

        <h2>VE-com 管理システム</h2>

        <div className="user-info">

          <span>ログインユーザー: <strong>{user?.username}</strong> ({user?.role})</span>

          <button type="button" onClick={logout} className="logout-button">

            ログアウト

          </button>

        </div>

      </header>



      <main className="app-main">

        <h3>メイン画面（開発中）</h3>

        <p>ログインが正常に完了しました。ここからAGVの操作画面やダッシュボードを構築していきます。</p>

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