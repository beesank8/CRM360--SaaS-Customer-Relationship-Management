const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC CUSTOMER INFORMATION
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

    address: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // CUSTOMER STATUS
    // ============================================================

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    // ============================================================
    // OWNER
    // ============================================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ============================================================
    // DEAL VALUE
    // ============================================================

    dealValue: {
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
    // SOURCE
    // ============================================================

    source: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // PRIORITY
    // ============================================================

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    // ============================================================
    // NEXT FOLLOW UP
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
    // CONVERTED LEAD HISTORY
    // ============================================================
    //
    // The original Lead is deleted after conversion.
    //
    // Therefore this embedded snapshot is the permanent
    // historical record of the Lead that created this Customer.
    //
    // ============================================================

    convertedLead: {
      leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        default: null,
      },

      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      company: {
        type: String,
        default: "",
      },

      industry: {
        type: String,
        default: "",
      },

      source: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "",
      },

      priority: {
        type: String,
        default: "",
      },

      expectedValue: {
        type: Number,
        default: 0,
      },

      probability: {
        type: Number,
        default: 0,
      },

      nextFollowUp: {
        type: Date,
        default: null,
      },

      notes: {
        type: String,
        default: "",
      },

      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      createdAt: {
        type: Date,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },

      convertedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

customerSchema.index({
  owner: 1,
  createdAt: -1,
});

// Customer email must be unique for each owner.
customerSchema.index(
  {
    owner: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

// Used for conversion history and analytics.
customerSchema.index({
  owner: 1,
  "convertedLead.leadId": 1,
});

customerSchema.index({
  owner: 1,
  "convertedLead.convertedAt": -1,
});

// ============================================================
// MODEL
// ============================================================

module.exports =
  mongoose.model(
    "Customer",
    customerSchema
  );