const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

const razorpayKeyId = defineSecret("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineSecret("RAZORPAY_KEY_SECRET");

const PREMIUM_AMOUNT_PAISE = 9900; // ₹99 — change only here

const callOptions = {
  region: "asia-south1",
  secrets: [razorpayKeyId, razorpayKeySecret],
};

exports.createRazorpayOrder = onCall(callOptions, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please log in before upgrading.");
  }

  const keyId = (razorpayKeyId.value() || "").trim();
  const keySecret = (razorpayKeySecret.value() || "").trim();

  if (!keyId || !keySecret) {
    throw new HttpsError(
      "failed-precondition",
      "Razorpay keys not set. Run: firebase functions:secrets:set RAZORPAY_KEY_ID"
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const receipt = ("mb_" + Date.now()).slice(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount: PREMIUM_AMOUNT_PAISE,
      currency: "INR",
      receipt,
      notes: {
        uid: request.auth.uid,
        product: "madhubhajan_premium",
      },
    });

    return {
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay create order failed:", error);
    const description =
      (error.error && error.error.description) ||
      error.message ||
      "Could not create Razorpay order.";
    throw new HttpsError("failed-precondition", description);
  }
});

exports.verifyRazorpayPayment = onCall(callOptions, async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Please log in before verifying payment."
    );
  }

  const data = request.data || {};
  const orderId = data.razorpay_order_id;
  const paymentId = data.razorpay_payment_id;
  const signature = data.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    throw new HttpsError("invalid-argument", "Missing payment details.");
  }

  const keySecret = razorpayKeySecret.value();
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    throw new HttpsError("permission-denied", "Payment verification failed.");
  }

  await admin
    .firestore()
    .collection("users")
    .doc(request.auth.uid)
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
