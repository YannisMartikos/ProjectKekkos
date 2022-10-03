const User = require("../models/User");
const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin

} = require("./verifyToken"); //imports those 3 from verifyToken.js
const router = require("express").Router();


//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req,res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate( //making use of the useful mongodb methods
            req.params.id,
            {
              $set: req.body, //take everything inside req.body and set it again
            },
            { new:true }  //so that it does return us this updates user
            );
            res.status(200).json(updatedUser); //sends the updated user
       } catch (err) {
        res.status(500).json(err);
       }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET USER (READ)
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => { //only admin can read any user
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc; //returns all information of user apart from the password
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET ALL USER (READ)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(1) // Returns the latest user to have registered
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([ // Again making use of mongodb method
        { $match: { createdAt: { $gte: lastYear } } }, //this is gonna try to match my condition
        {
          $project: { // taking month numbers
            month: { $month: "$createdAt" }, //Taking the month number inside my CreatedAt date
          },
        },
        {
          $group: {
            _id: "$month", // For example 10 stands for October
            total: { $sum: 1 }, //total user number
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router



//TESTING ON HOW TO USE GET AND POST METHODS

//router.get("/usertest", (req, res) => {
//    res.send("user test is successfull");

//});

//router.post("/userposttest", (req,res) => {
//    const username = req.body.username
//    res.send("your username is:" + username);
//});