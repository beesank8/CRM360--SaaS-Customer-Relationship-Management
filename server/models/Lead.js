const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC INFORMATION
    // ============================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // LEAD SOURCE
    // ============================================================

    source: {
      type: String,
      enum: [
        "Website",
        "Instagram",
        "Facebook",
        "Google Ads",
        "LinkedIn",
        "Referral",
        "Walk-In",
        "Cold Call",
        "Other",
      ],
      default: "Website",
    },

    // ============================================================
    // LEAD STATUS
    // ============================================================

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Interested",
        "Qualified",
        "Negotiation",
        "Won",
        "Lost",
        "Converted",
      ],
      default: "New",
    },

    // ============================================================
    // PRIORITY
    // ============================================================

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // ============================================================
    // EXPECTED DEAL VALUE
    // ============================================================

    expectedValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================================
    // PROBABILITY
    // ============================================================

    probability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============================================================
    // FOLLOW-UP
    // ============================================================

    nextFollowUp: {
      type: Date,
      default: null,
    },

    // ============================================================
    // NOTES
    // ============================================================

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // OWNER
    // ============================================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ============================================================
    // CONVERSION INFORMATION
    // ============================================================

    isConverted: {
      type: Boolean,
      default: false,
    },

    convertedAt: {
      type: Date,
      default: null,
    },

    convertedCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

leadSchema.index({
  owner: 1,
  createdAt: -1,
});

// Unique per owner: the Lead controller already handles
// error.code === 11000 as a duplicate-lead error, but that
// handling only works if this index actually enforces
// uniqueness.
leadSchema.index(
  {
    owner: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);