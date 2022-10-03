const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY); //secret key process

router.post("/payment", (req, res) => {
  stripe.charges.create( //add method
    {
      source: req.body.tokenId, //returns a tokenId which we use to make a payment...
      amount: req.body.amount,  //.. request to our node.js server
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;