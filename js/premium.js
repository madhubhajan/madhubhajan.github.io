/**
 * Premium status (Firestore) + Razorpay upgrade (Cloud Functions).
 * Functions run in Mumbai (asia-south1) — same region as Firestore.
 */

const FUNCTIONS_REGION = "asia-south1";

function getPaymentFunctions() {
  return firebase.app().functions(FUNCTIONS_REGION);
}

window.MusicPremium = {
  isPremium: false,
  priceLabel: "₹99",
  _unsubscribe: null,

  canPlaySong(song) {
    if (!song || !song.premium) return true;
    return this.isPremium;
  },

  async loadForUser(user) {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }

    if (!user || !firebase.firestore) {
      this.setPremium(false);
      return;
    }

    const ref = firebase.firestore().collection("users").doc(user.uid);

    this._unsubscribe = ref.onSnapshot(
      (doc) => {
        const premium = doc.exists && doc.data().isPremium === true;
        this.setPremium(premium);
      },
      (err) => {
        console.error("Premium status error:", err);
        this.setPremium(false);
      }
    );
  },

  setPremium(value) {
    this.isPremium = value;
    this.updateUI();
    if (typeof window.renderSongList === "function") {
      window.renderSongList();
    }
  },

  updateUI() {
    const upgradeCard = document.getElementById("upgrade-section");
    const premiumBadge = document.getElementById("premium-badge");
    const upgradeBtn = document.getElementById("upgrade-btn");
    const playerHeading = document.getElementById("player-heading");

    if (premiumBadge) {
      premiumBadge.classList.toggle("hidden", !this.isPremium);
    }

    if (upgradeCard) {
      const loggedIn =
        window.MusicAuth && window.MusicAuth.loggedIn && firebase.auth().currentUser;
      upgradeCard.classList.toggle("hidden", !loggedIn || this.isPremium);
    }

    if (upgradeBtn) {
      upgradeBtn.disabled = false;
      upgradeBtn.textContent = "Upgrade to Premium — " + this.priceLabel;
    }

    if (playerHeading) {
      playerHeading.textContent = this.isPremium ? "All bhajans" : "Bhajans";
    }
  },

  async startUpgrade() {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    if (!firebase.functions) {
      alert("Payments not ready. Deploy Cloud Functions (see RAZORPAY_SETUP.md).");
      return;
    }

    const btn = document.getElementById("upgrade-btn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Please wait…";
    }

    try {
      const createOrder = getPaymentFunctions().httpsCallable(
        "createRazorpayOrder"
      );
      const result = await createOrder();
      const data = result.data;

      if (typeof Razorpay === "undefined") {
        throw new Error("Razorpay checkout script did not load.");
      }

      const self = this;

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Madhu Bhajan",
        description: "Premium — unlock all bhajans",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verify = getPaymentFunctions().httpsCallable(
              "verifyRazorpayPayment"
            );
            await verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Thank you! Premium is now active.");
          } catch (err) {
            console.error(err);
            alert(
              "Payment received but verification failed. Contact support with payment ID: " +
                response.razorpay_payment_id
            );
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
          contact: user.phoneNumber || "",
        },
        theme: { color: "#7c3aed" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error(resp.error);
        alert(resp.error.description || "Payment failed.");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      const code = err.code ? "[" + err.code + "] " : "";
      const msg =
        err.message ||
        (err.details ? String(err.details) : "") ||
        "Could not start payment.";
      alert(code + msg + "\n\nSee PHASE_E_COMPLETE.md on GitHub.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Upgrade to Premium — " + this.priceLabel;
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const upgradeBtn = document.getElementById("upgrade-btn");
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", () => window.MusicPremium.startUpgrade());
  }

  if (firebase.auth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.MusicPremium.loadForUser(user);
      } else {
        window.MusicPremium.loadForUser(null);
      }
    });
  }
});
