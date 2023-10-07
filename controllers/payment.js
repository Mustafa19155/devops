const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const StripeSession = require("../models/stripeSession");
const Payment = require("../models/payment");
const { v4 } = require("uuid");
const Event = require("../models/event");

exports.createOrder = async (req, res, next) => {
  try {
    const user = req.user;

    const data = req.body;

    let lineItems = data.products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.product.name,
        },
        unit_amount: product.product.price * 100,
      },
      quantity: product.quantity,
    }));

    const discounts = [];

    if (user.plan.planID) {
      discounts.push({
        coupon: "uWj8vbR7",
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      discounts,
      success_url: `${process.env.CLIENT_BASE_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/checkout`,
      client_reference_id: v4(),
    });

    res.json({ id: session.id });

    // res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createBookingOrder = async (req, res, next) => {
  try {
    const user = req.user;

    const data = req.body;

    const event = await Event.findById(data.event._id);

    if (!(event.totalBookings >= 1)) {
      return res.status(400).send("Bookings Sold Out");
    }
    if (!user?.plan?.planID) {
      return res.status(400).send("Only for members");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: data.event.title,
            },
            unit_amount: data.event.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_BASE_URL}/event-book/${data.event._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/event-book/${data.event._id}`,
      client_reference_id: v4(),
    });

    res.json({ id: session.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createMembershipOrder = async (req, res, next) => {
  try {
    const data = req.body;

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: data.title,
            description: data.description,
          },
          unit_amount: data.price * 100,
        },
        quantity: 1, // You can adjust the quantity if needed
      },
    ];
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_BASE_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}&membership_id=${data._id}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/membership`,
      client_reference_id: v4(),
    });

    res.json({ id: session.id });
  } catch (err) {
    next(err);
  }
};

exports.checkStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const sessionUsed = await StripeSession.findOne({ sessionId });

    if (sessionUsed?.used) {
      return res.status(400).send("Session ID already used.");
    }

    await StripeSession.create({
      sessionId,
      used: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Payment was successful
      res.json({ paymentStatus: "succeeded" });
    } else {
      // Payment was not successful
      res.json({ paymentStatus: "failed" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserPayments = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const payments = await Payment.find({
      userID: _id,
      $or: [
        { bookingID: { $ne: null, $exists: true } },
        {
          orderID: { $ne: null, $exists: true },
        },
      ],
    })
      .populate("orderID")
      .populate({
        path: "bookingID",
        populate: {
          path: "eventID",
          model: "Event",
        },
      });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};
