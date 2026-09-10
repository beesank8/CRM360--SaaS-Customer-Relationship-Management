const express = require("express");

const router = express.Router();

// ============================================================
// MIDDLEWARE
// ============================================================

const authMiddleware =
  require("../middleware/authMiddleware");

// ============================================================
// CONTROLLER
// ============================================================

const {
  getAnalyticsOverview,
  getRevenueAnalytics,
  getLeadAnalytics,
  getCampaignAnalytics,
  getRecentActivities,
} = require("../controllers/analyticsController");

// ============================================================
// ANALYTICS OVERVIEW
// GET /api/analytics/overview
// ============================================================

router.get(
  "/overview",
  authMiddleware,
  getAnalyticsOverview
);

// ============================================================
// REVENUE ANALYTICS
// GET /api/analytics/revenue
// ============================================================

router.get(
  "/revenue",
  authMiddleware,
  getRevenueAnalytics
);

// ============================================================
// LEAD ANALYTICS
// GET /api/analytics/leads
// ============================================================

router.get(
  "/leads",
  authMiddleware,
  getLeadAnalytics
);

// ============================================================
// CAMPAIGN ANALYTICS
// GET /api/analytics/campaigns
// ============================================================

router.get(
  "/campaigns",
  authMiddleware,
  getCampaignAnalytics
);

// ============================================================
// RECENT ACTIVITIES
// GET /api/analytics/activities
// ============================================================

router.get(
  "/activities",
  authMiddleware,
  getRecentActivities
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;