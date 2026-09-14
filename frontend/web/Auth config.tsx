/* =====================================================================
   auth-config.js
   ---------------------------------------------------------------------
   ページ遷移先などの設定値をここに集約。
===================================================================== */

export {}; // モジュールスコープ化（他のファイルとの型競合を防ぐ）

declare global {
  interface Window {
    AUTH_CONFIG: {
      afterLoginPage: string;
      loginPage: string;
      sessionKey: string;
    };
  }
}

window.AUTH_CONFIG = {
  // ログイン成功後に遷移する画面
  afterLoginPage: "main.html",

  // 未ログイン状態でmain.html等にアクセスした時に戻す画面
  loginPage: "index.html",

  // sessionStorageに保存する際のキー名(他と被らなければ何でもよい)
  sessionKey: "vecom_auth_session",
};