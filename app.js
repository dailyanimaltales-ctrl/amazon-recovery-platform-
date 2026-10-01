/* =========================================
   AMAZON RECOVERY PLATFORM
   Dashboard Functionality
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");

  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const displayUsername = document.getElementById("displayUsername");

  const walletIdInput = document.getElementById("walletId");
  const saveWalletButton = document.getElementById("saveWalletButton");
  const walletSavedMessage = document.getElementById("walletSavedMessage");

  const STORAGE_USERNAME = "arp_username";
  const STORAGE_WALLET_ID = "arp_wallet_id";

  /*
   * Show the dashboard for the supplied username.
   * textContent is deliberately used so usernames containing
   * Arabic, accented characters, emoji, or other Unicode
   * characters are displayed safely.
   */
  function showDashboard(username) {
    displayUsername.textContent = username;

    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
  }

  /*
   * Login / username entry
   */
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
      usernameInput.focus();
      return;
    }

    localStorage.setItem(STORAGE_USERNAME, username);

    showDashboard(username);
  });

  /*
   * Restore the previously entered username when the page
   * is opened again on the same browser.
   */
  const savedUsername = localStorage.getItem(STORAGE_USERNAME);

  if (savedUsername) {
    showDashboard(savedUsername);
  }

  /*
   * Restore saved Connect Wallet ID.
   */
  const savedWalletId = localStorage.getItem(STORAGE_WALLET_ID);

  if (savedWalletId) {
    walletIdInput.value = savedWalletId;
  }

  /*
   * Save Connect Wallet ID
   *
   * This stores the value locally in the browser.
   * No private key or seed phrase is requested.
   */
  saveWalletButton.addEventListener("click", () => {
    const walletId = walletIdInput.value.trim();

    if (!walletId) {
      walletSavedMessage.textContent = "Please enter a wallet ID.";
      walletIdInput.focus();
      return;
    }

    localStorage.setItem(STORAGE_WALLET_ID, walletId);

    walletSavedMessage.textContent = "Wallet ID saved.";
  });

  /*
   * Allow Enter to save the Connect Wallet ID.
   */
  walletIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveWalletButton.click();
    }
  });
});
