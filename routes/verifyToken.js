const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) => { //We use (req,res,next) because it is going to be middleware
    const authHeader = req.headers.token; //We provide the token
    if (authHeader) {
        const token = authHeader.split(" ")[1]; //We are taking just token which is right after space
        jwt.verify(token, process.env.JWT_SEC, (err,user) =>{
            if(err) res.status(403).json("Token is not valid");
            req.user = user; //if everything is ok, I am assigning my user to my request
            next(); //leaving this fucntion and goes to our router

     })

    } else {
        return res.status(401).json("You are noy authenticated");
    }
};


const verifyTokenAndAuthorization = (req, res, next) => { // I write this function here so that i dont have to write it again and again for any request
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) { //(if this holds, you can continue your route function)
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };
  
  const verifyTokenAndAdmin = (req, res, next) => { //Admin Verification
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

module.exports = {
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};