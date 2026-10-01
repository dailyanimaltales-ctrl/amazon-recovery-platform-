"use strict";

document.addEventListener("DOMContentLoaded", function () {

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

  const withdrawalWalletInput =
    document.getElementById("withdrawalWallet");

  const gasWalletAddress =
    document.getElementById("gasWalletAddress");

  const copyGasWalletButton =
    document.getElementById("copyGasWalletButton");

  const copyMessage =
    document.getElementById("copyMessage");


  const PUBLIC_WALLET_ADDRESS =
    "0xeF43F8F28dC19DAE233A19adfee8C109E4a1bfBf";


  /* LOGIN */

  usernameInput.value = "";

  loginScreen.classList.remove("hidden");
  platformScreen.classList.add("hidden");


  loginForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      const username =
        usernameInput.value.trim();

      if (!username) {

        usernameInput.focus();

        return;
      }

      displayUsername.textContent =
        username;

      loginScreen.classList.add("hidden");

      platformScreen.classList.remove("hidden");

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
  );


  /* WALLET VALIDATION */

  function isValidEvmAddress(address) {

    return /^0x[a-fA-F0-9]{40}$/.test(
      address
    );

  }


  /* CONNECT WALLET ID */

  saveWalletButton.addEventListener(
    "click",
    function () {

      const walletId =
        walletIdInput.value.trim();

      walletValidationMessage.textContent =
        "";

      walletSavedMessage.textContent =
        "";

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
          "Session storage unavailable."
        );

      }

      walletSavedMessage.textContent =
        "Wallet ID saved.";

    }
  );


  /* RESTORE WALLET ID */

  try {

    const savedWalletId =
      sessionStorage.getItem(
        "publicWalletId"
      );

    if (savedWalletId) {

      walletIdInput.value =
        savedWalletId;

    }

  } catch (error) {

    console.warn(
      "Unable to restore wallet ID."
    );

  }


  /* GAS FEE ADDRESS */

  if (gasWalletAddress) {

    gasWalletAddress.textContent =
      PUBLIC_WALLET_ADDRESS;

  }


  /* COPY BUTTON */

  copyGasWalletButton.addEventListener(
    "click",
    async function () {

      let copied = false;


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


      if (!copied) {

        try {

          const textarea =
            document.createElement(
              "textarea"
            );

          textarea.value =
            PUBLIC_WALLET_ADDRESS;

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


      copyMessage.textContent =
        copied
          ? "Address copied."
          : "Copy failed.";

      setTimeout(
        function () {

          copyMessage.textContent =
            "";

        },
        2500
      );

    }
  );


  /* WITHDRAWAL WALLET */

  if (withdrawalWalletInput) {

    withdrawalWalletInput.addEventListener(
      "input",
      function () {

        const value =
          withdrawalWalletInput.value.trim();

        if (
          value &&
          !isValidEvmAddress(value)
        ) {

          withdrawalWalletInput.setCustomValidity(
            "Enter a valid public EVM wallet address."
          );

        } else {

          withdrawalWalletInput.setCustomValidity(
            ""
          );

        }

      }
    );

  }

});
