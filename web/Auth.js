/* =====================================================================
   auth.js (index.html 用)
   ---------------------------------------------------------------------
   ユーザー名+パスワードでのログイン処理。
   ログイン成功時はセッション情報をsessionStorageに保存して
   auth-config.js の afterLoginPage (デフォルト: main.html) へ遷移する。

   今はサーバーが無いので config.js の ACCOUNTS と照合するモック認証。
   実サーバーができたら USE_MOCK を false にして、serverLogin() の
   fetch先を実際のログインAPIに合わせるだけでよい。
===================================================================== */

const USE_MOCK = true; // 本番運用時は false にする

function showError(message) {
  const errorBox = document.querySelector('[data-auth="error"]');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  const errorBox = document.querySelector('[data-auth="error"]');
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function mockLogin(username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const account = (window.ACCOUNTS || []).find(
        (a) => a.username === username && a.password === password
      );
      resolve(
        account
          ? { success: true, user: { username: account.username, role: account.role || "member" } }
          : { success: false, message: "ユーザー名またはパスワードが違います" }
      );
    }, 250); // サーバー通信っぽく見せるための疑似遅延
  });
}

async function serverLogin(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return { success: false, message: "サーバーエラーが発生しました" };
  return await res.json(); // { success, user } または { success:false, message } を想定
}

document.addEventListener("DOMContentLoaded", () => {
  // 既にログイン済みならフォームを出さずmainへ
  if (sessionStorage.getItem(window.AUTH_CONFIG.sessionKey)) {
    window.location.href = window.AUTH_CONFIG.afterLoginPage;
    return;
  }

  const form = document.querySelector('[data-auth="form"]');
  const usernameInput = document.querySelector('[data-auth="username"]');
  const passwordInput = document.querySelector('[data-auth="password"]');
  const submitBtn = document.querySelector('[data-auth="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError("ユーザー名とパスワードを入力してください");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    const result = USE_MOCK
      ? await mockLogin(username, password)
      : await serverLogin(username, password);
    if (submitBtn) submitBtn.disabled = false;

    if (result.success) {
      sessionStorage.setItem(window.AUTH_CONFIG.sessionKey, JSON.stringify(result.user));
      window.location.href = window.AUTH_CONFIG.afterLoginPage;
    } else {
      showError(result.message);
    }
  });
});