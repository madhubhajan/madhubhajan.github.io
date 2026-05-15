const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

const PREMIUM_AMOUNT_PAISE = 9900; // ₹99 — change only here

function getRazorpayKeys() {
  const config = functions.config().razorpay || {};
  const keyId = config.key_id || process.env.RAZORPAY_KEY_ID;
  const keySecret = config.key_secret || process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Razorpay keys not configured. See RAZORPAY_SETUP.md."
    );
  }
  return { keyId, keySecret };
}

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please log in before upgrading."
    );
  }

  const { keyId, keySecret } = getRazorpayKeys();
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const order = await razorpay.orders.create({
    amount: PREMIUM_AMOUNT_PAISE,
    currency: "INR",
    receipt: "premium_" + context.auth.uid.slice(0, 8) + "_" + Date.now(),
    notes: {
      uid: context.auth.uid,
      product: "madhubhajan_premium",
    },
  });

  return {
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
});

exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Please log in before verifying payment."
    );
  }

  const orderId = data.razorpay_order_id;
  const paymentId = data.razorpay_payment_id;
  const signature = data.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing payment details."
    );
  }

  const { keySecret } = getRazorpayKeys();
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Payment verification failed."
    );
  }

  await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .set(
      {
        isPremium: true,
        premiumSince: admin.firestore.FieldValue.serverTimestamp(),
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
      },
      { merge: true }
    );

  return { success: true, isPremium: true };
});
