const mongoose = require("mongoose");

// ============================================================
// DEAL SCHEMA
// Represents an in-progress or closed sales opportunity tied
// to a customer, used for pipeline/revenue reporting.
// ============================================================

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    value: {
      type: Number,
      default: 0,
      min: 0,
    },

    stage: {
      type: String,
      enum: [
        "Prospecting",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Won",
        "Lost",
      ],
      default: "Prospecting",
    },

    probability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    expectedCloseDate: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

dealSchema.index({ owner: 1, createdAt: -1 });
dealSchema.index({ customer: 1 });
dealSchema.index({ stage: 1 });

module.exports = mongoose.model("Deal", dealSchema);
