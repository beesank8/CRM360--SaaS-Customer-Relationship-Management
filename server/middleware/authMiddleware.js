const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

const authMiddleware = async (
  req,
  res,
  next
) => {

  try {

    // --------------------------------------------------------
    // GET AUTHORIZATION HEADER
    // --------------------------------------------------------

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });

    }


    // --------------------------------------------------------
    // CHECK BEARER TOKEN
    // --------------------------------------------------------

    if (
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });

    }


    // --------------------------------------------------------
    // EXTRACT TOKEN
    // --------------------------------------------------------

    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Token missing",
      });

    }


    // --------------------------------------------------------
    // VERIFY TOKEN
    // --------------------------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // --------------------------------------------------------
    // CHECK TOKEN VERSION
    //
    // If the password has been changed since this token was
    // issued, tokenVersion on the user will have moved past
    // what's embedded in the token, so it must be rejected
    // even though it hasn't expired yet.
    // --------------------------------------------------------

    const user =
      await User.findById(decoded.id).select(
        "tokenVersion"
      );

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });

    }

    const tokenVersion =
      decoded.tokenVersion || 0;

    if ((user.tokenVersion || 0) !== tokenVersion) {

      return res.status(401).json({
        success: false,
        message:
          "Session expired, please log in again",
      });

    }


    // --------------------------------------------------------
    // STORE USER INFORMATION
    // --------------------------------------------------------

    req.user = decoded;


    // --------------------------------------------------------
    // CONTINUE
    // --------------------------------------------------------

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};


module.exports =
  authMiddleware;