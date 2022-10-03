const express = require("express");      //creates express server which requires our express library
const app = express();
const mongoose = require("mongoose");   //connects to our mongo server
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");



dotenv.config();

mongoose
.connect(process.env.MONGO_URL)   //my hidden URL from MongoDB
.then(() => console.log("DB connection successfull"))  //Checking if DB connection is successfull
.catch((err) => {console.log(err);
});

app.use(express.json()); //enabling my app to handle json objects

//ENPOINTS/ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);


app.listen(process.env.PORT || 7000, () => {    //To run the app, a port should be provided
    console.log("Backend server is running");
});