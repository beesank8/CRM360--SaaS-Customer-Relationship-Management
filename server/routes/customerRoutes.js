const express = require("express");

const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const authMiddleware =
  require("../middleware/authMiddleware");

// ============================================================
// CREATE CUSTOMER
// POST /api/customers
// ============================================================

router.post(
  "/",
  authMiddleware,
  createCustomer
);

// ============================================================
// GET ALL CUSTOMERS
// GET /api/customers
// ============================================================

router.get(
  "/",
  authMiddleware,
  getCustomers
);

// ============================================================
// GET SINGLE CUSTOMER
// GET /api/customers/:id
// ============================================================

router.get(
  "/:id",
  authMiddleware,
  getCustomer
);

// ============================================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// ============================================================

router.put(
  "/:id",
  authMiddleware,
  updateCustomer
);

// ============================================================
// DELETE CUSTOMER
// DELETE /api/customers/:id
// ============================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteCustomer
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;