/* =====================================================================
   session.js
   ---------------------------------------------------------------------
   ログイン後の各ページ(main.html など)で読み込む共通ファイル。
   ログインしていなければ自動でログイン画面に戻す。
===================================================================== */

function getSession() {
  const raw = sessionStorage.getItem(window.AUTH_CONFIG.sessionKey);
  return raw ? JSON.parse(raw) : null;
}

function requireLogin() {
  const session = getSession();
  if (!session) {
    window.location.href = window.AUTH_CONFIG.loginPage;
    return null;
  }
  return session;
}

function logout() {
  sessionStorage.removeItem(window.AUTH_CONFIG.sessionKey);
  window.location.href = window.AUTH_CONFIG.loginPage;
}