```javascript
"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const loginScreen =
    document.getElementById("loginScreen");

  const platformScreen =
    document.getElementById("platformScreen");

  const loginForm =
    document.getElementById("loginForm");

  const usernameInput =
    document.getElementById("username");

  const displayUsername =
    document.getElementById("displayUsername");

  const walletIdInput =
    document.getElementById("walletId");

  const saveWalletButton =
    document.getElementById("saveWalletButton");

  const walletValidationMessage =
    document.getElementById("walletValidationMessage");

  const walletSavedMessage =
    document.getElementById("walletSavedMessage");

  const gasWalletAddress =
    document.getElementById("gasWalletAddress");

  const copyGasWalletButton =
    document.getElementById("copyGasWalletButton");

  const copyMessage =
    document.getElementById("copyMessage");

  const connectTrustWalletButton =
    document.getElementById("connectTrustWalletButton");

  const walletConnectionStatus =
    document.getElementById("walletConnectionStatus");

  const walletQr =
    document.getElementById("walletQr");


  /* =========================================================
     SETTINGS
     ========================================================= */

  const USERNAME =
    "محمود الشبيلات";

  const PUBLIC_WALLET_ADDRESS =
    "0xeF43F8F28dC19DAE233A19adfee8C109E4a1bfBf";


  /* =========================================================
     SAFETY CHECK
     ========================================================= */

  if (
    !loginScreen ||
    !platformScreen ||
    !loginForm ||
    !usernameInput ||
    !displayUsername
  ) {
    console.error(
      "Required page elements were not found."
    );

    return;
  }


  /* =========================================================
     WALLET ADDRESS VALIDATION
     ========================================================= */

  function isValidEvmAddress(address) {

    return /^0x[a-fA-F0-9]{40}$/.test(
      address
    );

  }


  /* =========================================================
     OPEN PLATFORM
     ========================================================= */

  function openPlatform() {

    displayUsername.textContent =
      USERNAME;

    loginScreen.classList.add(
      "hidden"
    );

    platformScreen.classList.remove(
      "hidden"
    );

    /*
     * Remove any old query parameters such as:
     *
     * ?username=...
     *
     * from the browser address bar.
     */

    if (
      window.history &&
      window.history.replaceState
    ) {

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

    }

  }


  /* =========================================================
     LOGIN
     ========================================================= */

  usernameInput.value =
    USERNAME;

  loginForm.addEventListener(
    "submit",
    function (event) {

      /*
       * IMPORTANT:
       * Prevent the browser from submitting the
       * form and adding ?username=... to the URL.
       */

      event.preventDefault();

      event.stopPropagation();

      const enteredUsername =
        usernameInput.value.trim();

      /*
       * Only the requested username is used.
       */

      if (
        enteredUsername !== USERNAME
      ) {

        usernameInput.value =
          USERNAME;

        usernameInput.focus();

        return;

      }

      openPlatform();

    }
  );


  /* =========================================================
     CONNECT WALLET ID
     ========================================================= */

  if (
    walletIdInput &&
    saveWalletButton
  ) {

    saveWalletButton.addEventListener(
      "click",
      function () {

        const walletId =
          walletIdInput.value.trim();

        /*
         * Clear previous messages.
         */

        if (walletValidationMessage) {
          walletValidationMessage.textContent =
            "";
        }

        if (walletSavedMessage) {
          walletSavedMessage.textContent =
            "";
        }

        /*
         * Empty address.
         */

        if (!walletId) {

          if (walletValidationMessage) {
            walletValidationMessage.textContent =
              "Please enter a wallet ID.";
          }

          walletIdInput.focus();

          return;

        }

        /*
         * Validate public EVM/BEP-20 address.
         */

        if (
          !isValidEvmAddress(walletId)
        ) {

          if (walletValidationMessage) {
            walletValidationMessage.textContent =
              "Enter a valid public wallet address beginning with 0x.";
          }

          walletIdInput.focus();

          return;

        }

        /*
         * Save only the public address
         * for the current browser session.
         */

        try {

          sessionStorage.setItem(
            "arp_wallet_id",
            walletId
          );

        } catch (error) {

          console.warn(
            "Session storage unavailable:",
            error
          );

        }

        if (walletSavedMessage) {
          walletSavedMessage.textContent =
            "Wallet ID saved.";
        }

      }
    );


    /*
     * Allow Enter to save.
     */

    walletIdInput.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          saveWalletButton.click();

        }

      }
    );


    /*
     * Restore the public wallet ID
     * during the current browser session.
     */

    try {

      const savedWalletId =
        sessionStorage.getItem(
          "arp_wallet_id"
        );

      if (savedWalletId) {

        walletIdInput.value =
          savedWalletId;

      }

    } catch (error) {

      console.warn(
        "Could not read session storage:",
        error
      );

    }

  }


  /* =========================================================
     PUBLIC WALLET ADDRESS
     ========================================================= */

  if (gasWalletAddress) {

    gasWalletAddress.textContent =
      PUBLIC_WALLET_ADDRESS;

  }


  /* =========================================================
     COPY PUBLIC WALLET ADDRESS
     ========================================================= */

  if (copyGasWalletButton) {

    copyGasWalletButton.addEventListener(
      "click",
      async function () {

        let copied = false;

        /*
         * Modern Clipboard API.
         */

        try {

          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {

            await navigator.clipboard.writeText(
              PUBLIC_WALLET_ADDRESS
            );

            copied = true;

          }

        } catch (error) {

          copied = false;

        }


        /*
         * Older-browser fallback.
         */

        if (!copied) {

          try {

            const textarea =
              document.createElement(
                "textarea"
              );

            textarea.value =
              PUBLIC_WALLET_ADDRESS;

            textarea.setAttribute(
              "readonly",
              ""
            );

            textarea.style.position =
              "fixed";

            textarea.style.left =
              "-9999px";

            document.body.appendChild(
              textarea
            );

            textarea.focus();

            textarea.select();

            copied =
              document.execCommand(
                "copy"
              );

            textarea.remove();

          } catch (error) {

            copied = false;

          }

        }


        /*
         * Result message.
         */

        if (copyMessage) {

          copyMessage.textContent =
            copied
              ? "Wallet address copied."
              : "Copy failed. Please copy the address manually.";

        }


        setTimeout(
          function () {

            if (copyMessage) {
              copyMessage.textContent =
                "";
            }

          },
          2500
        );

      }
    );

  }


  /* =========================================================
     QR CODE
     ========================================================= */

  function createWalletQr() {

    if (!walletQr) {
      return;
    }

    /*
     * Use the same public wallet address
     * displayed above.
     */

    const encodedAddress =
      encodeURIComponent(
        PUBLIC_WALLET_ADDRESS
      );

    const image =
      document.createElement(
        "img"
      );

    image.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=" +
      encodedAddress;

    image.alt =
      "QR code for the public wallet address";

    image.width = 78;
    image.height = 78;

    image.loading =
      "lazy";

    image.addEventListener(
      "error",
      function () {

        walletQr.textContent =
          "QR unavailable";

      }
    );

    walletQr.textContent =
      "";

    walletQr.appendChild(
      image
    );

  }

  createWalletQr();


  /* =========================================================
     TRUST WALLET / EVM PROVIDER
     ========================================================= */

  if (connectTrustWalletButton) {

    connectTrustWalletButton.addEventListener(
      "click",
      async function () {

        /*
         * Check whether the browser or wallet
         * has exposed an EVM provider.
         */

        if (
          typeof window.ethereum ===
          "undefined"
        ) {

          if (walletConnectionStatus) {

            walletConnectionStatus.textContent =
              "No compatible wallet provider detected.";

          }

          return;

        }


        try {

          /*
           * Request public wallet accounts.
           */

          const accounts =
            await window.ethereum.request({
              method:
                "eth_requestAccounts"
            });


          if (
            accounts &&
            accounts.length > 0
          ) {

            const connectedAddress =
              accounts[0];


            /*
             * Show only the public wallet
             * address returned by the provider.
             */

            if (walletConnectionStatus) {

              walletConnectionStatus.textContent =
                connectedAddress;

            }


            connectTrustWalletButton.innerHTML =
              '<span class="trust-dot"></span> Wallet Connected';

          } else {

            if (walletConnectionStatus) {

              walletConnectionStatus.textContent =
                "No wallet account was returned.";

            }

          }

        } catch (error) {

          /*
           * User cancelled wallet connection.
           */

          if (
            error &&
            error.code === 4001
          ) {

            if (walletConnectionStatus) {

              walletConnectionStatus.textContent =
                "Wallet connection was cancelled.";

            }

            return;

          }


          /*
           * Other provider errors.
           */

          if (walletConnectionStatus) {

            walletConnectionStatus.textContent =
              "Wallet connection could not be completed.";

          }

          console.error(
            "Wallet connection error:",
            error
          );

        }

      }
    );

  }


  /* =========================================================
     WALLET ACCOUNT CHANGE
     ========================================================= */

  if (
    typeof window.ethereum !==
    "undefined"
  ) {

    window.ethereum.on(
      "accountsChanged",
      function (accounts) {

        if (
          accounts &&
          accounts.length > 0
        ) {

          if (walletConnectionStatus) {

            walletConnectionStatus.textContent =
              accounts[0];

          }

          if (connectTrustWalletButton) {

            connectTrustWalletButton.innerHTML =
              '<span class="trust-dot"></span> Wallet Connected';

          }

        } else {

          if (walletConnectionStatus) {

            walletConnectionStatus.textContent =
              "No wallet connected.";

          }

          if (connectTrustWalletButton) {

            connectTrustWalletButton.innerHTML =
              '<span class="trust-dot"></span> Connect Trust Wallet';

          }

        }

      }
    );

  }


  /* =========================================================
     INITIAL PAGE STATE
     ========================================================= */

  /*
   * Every page load starts at the username screen.
   */

  loginScreen.classList.remove(
    "hidden"
  );

  platformScreen.classList.add(
    "hidden"
  );

  usernameInput.value =
    USERNAME;


  /* =========================================================
     PREVENT OLD URL LOGIN PARAMETERS
     ========================================================= */

  if (
    window.location.search &&
    window.history &&
    window.history.replaceState
  ) {

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

  }

});
```
