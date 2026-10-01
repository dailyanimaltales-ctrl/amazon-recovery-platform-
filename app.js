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

  const walletValidationMessage =
    document.getElementById("walletValidationMessage");

  const walletSavedMessage =
    document.getElementById("walletSavedMessage");

  const gasWalletAddress =
    document.getElementById("gasWalletAddress");

  const walletQr =
    document.getElementById("walletQr");


  /* =========================================
     STORAGE KEYS
  ========================================= */

  const STORAGE_USERNAME = "arp_username";
  const STORAGE_WALLET_ID = "arp_wallet_id";


  /* =========================================
     PUBLIC WALLET ADDRESS
  ========================================= */

  const PUBLIC_WALLET_ADDRESS =
    "0xeF43F8F28dC19DAE233A19adfee8C109E4a1bfBf";


  /* =========================================
     EVM ADDRESS VALIDATION
     
     Accepts standard EVM/BEP-20 addresses:
     0x + exactly 40 hexadecimal characters
  ========================================= */

  function isValidEvmAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }


  /* =========================================
     SHOW DASHBOARD
  ========================================= */

  function showDashboard(username) {
    displayUsername.textContent = username;

    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
  }


  /* =========================================
     USERNAME LOGIN
  ========================================= */

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
      usernameInput.focus();
      return;
    }

    /*
     * Store only the username locally.
     *
     * textContent is used when displaying it so
     * Arabic and other Unicode characters are
     * handled safely.
     */

    localStorage.setItem(STORAGE_USERNAME, username);

    showDashboard(username);
  });


  /* =========================================
     RESTORE USERNAME
  ========================================= */

  const savedUsername =
    localStorage.getItem(STORAGE_USERNAME);

  if (savedUsername) {
    showDashboard(savedUsername);
  }


  /* =========================================
     RESTORE WALLET ID
  ========================================= */

  const savedWalletId =
    localStorage.getItem(STORAGE_WALLET_ID);

  if (savedWalletId) {
    walletIdInput.value = savedWalletId;
  }


  /* =========================================
     SAVE CONNECT WALLET ID
  ========================================= */

  function saveWalletId() {
    const walletId = walletIdInput.value.trim();

    walletValidationMessage.textContent = "";
    walletSavedMessage.textContent = "";

    if (!walletId) {
      walletValidationMessage.textContent =
        "Please enter a wallet ID.";

      walletIdInput.focus();
      return;
    }

    /*
     * Prevent arbitrary numbers or invalid strings
     * from being saved as a wallet ID.
     */

    if (!isValidEvmAddress(walletId)) {
      walletValidationMessage.textContent =
        "Enter a valid EVM wallet address beginning with 0x.";

      walletIdInput.focus();
      return;
    }

    /*
     * Save the public wallet ID locally.
     */

    localStorage.setItem(
      STORAGE_WALLET_ID,
      walletId
    );

    walletSavedMessage.textContent =
      "Wallet ID saved successfully.";
  }


  saveWalletButton.addEventListener(
    "click",
    saveWalletId
  );


  /* =========================================
     ENTER KEY SUPPORT
  ========================================== */

  walletIdInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {
        event.preventDefault();
        saveWalletId();
      }

    }
  );


  /* =========================================
     PUBLIC WALLET ADDRESS
  ========================================== */

  if (gasWalletAddress) {
    gasWalletAddress.textContent =
      PUBLIC_WALLET_ADDRESS;
  }


  /* =========================================
     QR CODE
     
     Uses a public QR image service to render
     the public wallet address.
     
     No private keys or recovery phrases are
     ever requested or encoded.
  ========================================== */

  function createWalletQr() {

    if (!walletQr) {
      return;
    }

    const encodedAddress =
      encodeURIComponent(PUBLIC_WALLET_ADDRESS);

    const qrImage =
      document.createElement("img");

    qrImage.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=" +
      encodedAddress;

    qrImage.alt =
      "QR code for the public wallet address";

    qrImage.width = 78;
    qrImage.height = 78;

    qrImage.loading = "lazy";

    qrImage.style.display = "block";
    qrImage.style.width = "78px";
    qrImage.style.height = "78px";
    qrImage.style.borderRadius = "8px";

    qrImage.addEventListener(
      "error",
      () => {
        walletQr.textContent = "QR unavailable";
      }
    );

    walletQr.textContent = "";
    walletQr.appendChild(qrImage);
  }


  createWalletQr();

});
