const express = require("express");

const router =
  express.Router();

// ============================================================
// AUTH MIDDLEWARE
// ============================================================

const authMiddleware =
  require("../middleware/authMiddleware");

// ============================================================
// CONTROLLER
// ============================================================

const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
} = require("../controllers/leadController");

// ============================================================
// GET ALL LEADS
// GET /api/leads
// ============================================================

router.get(
  "/",
  authMiddleware,
  getLeads
);

// ============================================================
// GET SINGLE LEAD
// GET /api/leads/:id
// ============================================================

router.get(
  "/:id",
  authMiddleware,
  getLead
);

// ============================================================
// CREATE LEAD
// POST /api/leads
// ============================================================

router.post(
  "/",
  authMiddleware,
  createLead
);

// ============================================================
// UPDATE LEAD
// PUT /api/leads/:id
// ============================================================

router.put(
  "/:id",
  authMiddleware,
  updateLead
);

// ============================================================
// DELETE LEAD
// DELETE /api/leads/:id
// ============================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteLead
);

// ============================================================
// CONVERT LEAD TO CUSTOMER
// POST /api/leads/:id/convert
// ============================================================

router.post(
  "/:id/convert",
  authMiddleware,
  convertLead
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;