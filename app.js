"use strict";

document.addEventListener("DOMContentLoaded", function () {

  const loginScreen = document.getElementById("loginScreen");
  const platformScreen = document.getElementById("platformScreen");
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const displayUsername = document.getElementById("displayUsername");

  const walletIdInput = document.getElementById("walletId");
  const saveWalletButton = document.getElementById("saveWalletButton");
  const walletValidationMessage = document.getElementById("walletValidationMessage");
  const walletSavedMessage = document.getElementById("walletSavedMessage");

  const connectTrustWalletButton = document.getElementById("connectTrustWalletButton");
  const walletConnectionStatus = document.getElementById("walletConnectionStatus");


  /*
   * Start on the username screen.
   * The username is intentionally blank.
   */

  usernameInput.value = "";

  loginScreen.classList.remove("hidden");
  platformScreen.classList.add("hidden");


  /*
   * USERNAME LOGIN
   *
   * The user types the username themselves.
   * Arabic and English names are supported.
   */

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();
    event.stopPropagation();

    const username = usernameInput.value.trim();

    if (!username) {
      usernameInput.focus();
      return;
    }

    displayUsername.textContent = username;

    loginScreen.classList.add("hidden");
    platformScreen.classList.remove("hidden");

    /*
     * Keep the username out of the URL.
     */

    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

  });


  /*
   * PUBLIC EVM WALLET VALIDATION
   */

  function isValidEvmAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }


  /*
   * SAVE CONNECT WALLET ID
   */

  saveWalletButton.addEventListener("click", function () {

    const walletId = walletIdInput.value.trim();

    walletValidationMessage.textContent = "";
    walletSavedMessage.textContent = "";

    if (!walletId) {

      walletValidationMessage.textContent =
        "Please enter a wallet ID.";

      walletIdInput.focus();

      return;
    }

    if (!isValidEvmAddress(walletId)) {

      walletValidationMessage.textContent =
        "Enter a valid public EVM wallet address.";

      walletIdInput.focus();

      return;
    }

    try {

      sessionStorage.setItem(
        "publicWalletId",
        walletId
      );

    } catch (error) {

      console.warn(
        "Session storage is unavailable."
      );

    }

    walletSavedMessage.textContent =
      "Wallet ID saved.";

  });


  /*
   * RESTORE SAVED WALLET ID
   */

  try {

    const savedWalletId =
      sessionStorage.getItem("publicWalletId");

    if (savedWalletId) {
      walletIdInput.value = savedWalletId;
    }

  } catch (error) {

    console.warn(
      "Unable to restore wallet ID."
    );

  }


  /*
   * CONNECT TRUST WALLET
   *
   * Uses the browser's compatible EVM wallet provider
   * and displays the public wallet address.
   */

  connectTrustWalletButton.addEventListener(
    "click",
    async function () {

      if (typeof window.ethereum === "undefined") {

        walletConnectionStatus.textContent =
          "No compatible wallet provider detected.";

        return;
      }

      try {

        const accounts =
          await window.ethereum.request({
            method: "eth_requestAccounts"
          });

        if (!accounts || accounts.length === 0) {

          walletConnectionStatus.textContent =
            "No wallet account was returned.";

          return;
        }

        walletConnectionStatus.textContent =
          accounts[0];

        connectTrustWalletButton.innerHTML =
          '<span class="trust-dot"></span> Wallet Connected';

      } catch (error) {

        if (error && error.code === 4001) {

          walletConnectionStatus.textContent =
            "Wallet connection was cancelled.";

        } else {

          walletConnectionStatus.textContent =
            "Wallet connection could not be completed.";

          console.error(
            "Wallet connection error:",
            error
          );

        }

      }

    }
  );


  /*
   * HANDLE WALLET ACCOUNT CHANGES
   */

  if (typeof window.ethereum !== "undefined") {

    window.ethereum.on(
      "accountsChanged",
      function (accounts) {

        if (accounts && accounts.length > 0) {

          walletConnectionStatus.textContent =
            accounts[0];

          connectTrustWalletButton.innerHTML =
            '<span class="trust-dot"></span> Wallet Connected';

        } else {

          walletConnectionStatus.textContent =
            "No wallet connected.";

          connectTrustWalletButton.innerHTML =
            '<span class="trust-dot"></span> Connect Trust Wallet';

        }

      }
    );

  }

});
