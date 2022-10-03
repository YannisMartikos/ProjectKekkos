const router = require("express").Router();
const User = require("../models/User");  //imports my User Model
const CryptoJS = require("crypto-js") //we need to encrypt users passwords
const jwt = require("jsonwebtoken"); //imports the jsonwebtoken

//REGISTER
router.post("/register", async (req, res) =>{ //we need async functions cause it takes some time to create user
    const newUser = new User({
        username: req.body.username, //we are taking this from user
        email: req.body.email,
        password: CryptoJS.AES.encrypt( //encrypting the user's password
          req.body.password, 
          process.env.PASS_SEC
          ).toString(),

    });
  try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //sending this to my clients site if we are successfull
    } catch (err) {
    res.status(500).json(err); //sending this in case we are not successfull
    }
});

//LOGIN

router.post("/login", async (req,res) => {
  try {
  const user = await User.findOne({ username: req.body.username}); //finding our user inside our DB
  !user && res.status(401).json("Wrong credentials") //we use findOne function based on the uniqueness of the username

  const hashedPassword = CryptoJS.AES.decrypt( //Decrypting the password into a string again
    user.password,
    process.env.PASS_SEC
  );
  const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  OriginalPassword !== req.body.password &&
      res.status(401).json("wrong credentials!!");

      const accessToken = jwt.sign(  //we keep only id and isadmin properties inside our token
        {
        id: user._id, 
        isAdmin: user.isAdmin,
      }, 
      process.env.JWT_SEC,
      {expiresIn:"3d"} //After 3 days we will not be able to use this very token again
      );

  const { password, ...others } = user._doc; //user._doc since MONGO saves the documents in doc file

  res.status(200).json({...others, accessToken}); //sending my user the info except for the password
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;