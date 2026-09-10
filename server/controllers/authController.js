const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ============================================================
// REGISTER USER
// ============================================================

exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // ----------------------------------------------------------
    // NORMALIZE EMAIL
    //
    // The schema stores email as lowercase, so lookups and
    // writes must be normalized the same way or a duplicate
    // email that differs only in case will slip through.
    // ----------------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // ----------------------------------------------------------
    // CHECK EXISTING USER
    // ----------------------------------------------------------

    const existingUser =
      await User.findOne({ email: normalizedEmail });


    if (existingUser) {

      return res.status(409).json({
        message: "User already exists",
      });

    }


    // ----------------------------------------------------------
    // HASH PASSWORD
    // ----------------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ----------------------------------------------------------
    // CREATE USER
    // ----------------------------------------------------------

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });


    // ----------------------------------------------------------
    // RETURN SAFE USER DATA
    // ----------------------------------------------------------

    res.status(201).json({

      message:
        "User registered successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle,
        role: user.role,
        createdAt: user.createdAt,
      },

    });


  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    // ----------------------------------------------------------
    // DUPLICATE EMAIL
    //
    // A race, or a case-only difference that slipped past the
    // findOne check above, can still hit the unique index.
    // Surface it as a 409, not a generic 500.
    // ----------------------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });

  }
};


// ============================================================
// LOGIN USER
// ============================================================

exports.login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ----------------------------------------------------------
    // NORMALIZE EMAIL
    //
    // Registration stores email lowercased. Without the same
    // normalization here, "SANKET@GMAIL.COM" would fail to
    // match the stored "sanket@gmail.com" record.
    // ----------------------------------------------------------

    const normalizedEmail =
      String(email || "")
        .trim()
        .toLowerCase();


    // ----------------------------------------------------------
    // FIND USER
    // ----------------------------------------------------------

    const user =
      await User.findOne({ email: normalizedEmail });


    if (!user) {

      return res.status(400).json({
        message:
          "Invalid email or password",
      });

    }


    // ----------------------------------------------------------
    // CHECK PASSWORD
    // ----------------------------------------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid email or password",
      });

    }


    // ----------------------------------------------------------
    // CREATE JWT
    // ----------------------------------------------------------

    const token =
      jwt.sign(
        {
          id: user._id,
          tokenVersion: user.tokenVersion || 0,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );


    // ----------------------------------------------------------
    // RETURN SAFE USER DATA
    // ----------------------------------------------------------
    //
    // IMPORTANT:
    // Do NOT return the complete MongoDB user document.
    //
    // profileImage.data can contain a large image Buffer.
    // The profile image is loaded separately through:
    //
    // GET /api/settings/profile-picture
    //
    // ----------------------------------------------------------

    res.json({

      message:
        "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle,
        role: user.role,
        createdAt: user.createdAt,
      },

    });


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    res.status(500).json({
      message: error.message,
    });

  }
};