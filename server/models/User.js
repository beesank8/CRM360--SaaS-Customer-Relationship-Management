const mongoose = require("mongoose");


// ============================================================
// USER SCHEMA
// ============================================================

const userSchema = new mongoose.Schema(
  {
    // ----------------------------------------------------------
    // BASIC USER INFORMATION
    // ----------------------------------------------------------

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
      trim: true,
    },

    // ----------------------------------------------------------
    // TOKEN VERSION
    //
    // Bumped whenever the password changes so JWTs issued
    // before that point stop being accepted, even though they
    // haven't technically expired yet.
    // ----------------------------------------------------------

    tokenVersion: {
      type: Number,
      default: 0,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    jobTitle: {
      type: String,
      default: "CRM Administrator",
      trim: true,
    },


    // ----------------------------------------------------------
    // PROFILE IMAGE
    // ----------------------------------------------------------

    profileImage: {
      data: {
        type: Buffer,
        default: null,
      },

      contentType: {
        type: String,
        default: "",
      },
    },


    // ----------------------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------------------

    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      leadUpdates: {
        type: Boolean,
        default: true,
      },

      customerUpdates: {
        type: Boolean,
        default: true,
      },

      weeklyReports: {
        type: Boolean,
        default: true,
      },

      marketing: {
        type: Boolean,
        default: false,
      },
    },


    // ----------------------------------------------------------
    // APPEARANCE
    // ----------------------------------------------------------

    appearance: {
      theme: {
        type: String,
        enum: [
          "light",
          "dark",
          "system",
        ],
        default: "light",
      },
    },


    // ----------------------------------------------------------
    // CRM PREFERENCES
    // ----------------------------------------------------------

    preferences: {
      currency: {
        type: String,
        default: "INR",
      },

      dateFormat: {
        type: String,
        default: "DD/MM/YYYY",
      },

      defaultLeadStatus: {
        type: String,
        default: "New",
      },

      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================
// MODEL
// ============================================================

module.exports = mongoose.model(
  "User",
  userSchema
);