const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

const {
  calculateTotalRevenue,
  calculateConversionRate,
  calculateConvertedLeads,
  calculateActiveLeads,
  calculateTotalLeadHistory,
  getLeadsBySource,
  getLeadsByStatus,
  getMonthlyTrend,
} = require("../routes/analyticsService");

// ============================================================
// HELPER
// ============================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id || null;
};

const requireUserId = (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return null;
  }

  return userId;
};

// ============================================================
// ANALYTICS OVERVIEW
// GET /api/analytics/overview
// ============================================================

const getAnalyticsOverview = async (
  req,
  res
) => {
  try {
    const owner =
      requireUserId(req, res);

    if (!owner) {
      return;
    }

    const ownerFilter = {
      owner,
    };

    const [
      customers,
      activeLeads,
      convertedLeads,
      totalLeadHistory,
      revenue,
      conversionRate,
    ] = await Promise.all([
      Customer.countDocuments(
        ownerFilter
      ),

      calculateActiveLeads(owner),

      calculateConvertedLeads(owner),

      calculateTotalLeadHistory(owner),

      calculateTotalRevenue(owner),

      calculateConversionRate(owner),
    ]);

    // ========================================================
    // PIPELINE
    // ========================================================
    //
    // Current active customers.
    //
    // ========================================================

    const pipeline =
      await Customer.aggregate([
        {
          $match: {
            ...ownerFilter,

            status: "Active",
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: {
                $convert: {
                  input: "$dealValue",

                  to: "double",

                  onError: 0,

                  onNull: 0,
                },
              },
            },
          },
        },
      ]);

    const pipelineValue =
      Number(
        pipeline[0]?.total || 0
      );

    // ========================================================
    // ROI
    // ========================================================

    const roi =
      revenue > 0
        ? Math.round(
            (revenue /
              (revenue * 0.3)) *
              100
          )
        : 0;

    return res.json({
      success: true,

      revenue,

      customers,

      // Current active Leads.
      leads: activeLeads,

      activeLeads,

      convertedLeads,

      totalLeadHistory,

      conversionRate,

      pipeline:
        pipelineValue,

      roi,

      aiScore: 94,
    });
  } catch (error) {
    console.error(
      "ANALYTICS OVERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ============================================================
// REVENUE ANALYTICS
// GET /api/analytics/revenue
// ============================================================

const getRevenueAnalytics = async (
  req,
  res
) => {
  try {
    const owner =
      requireUserId(req, res);

    if (!owner) {
      return;
    }

    const trend =
      await getMonthlyTrend(
        owner
      );

    return res.json({
      success: true,

      data: trend,

      trend,
    });
  } catch (error) {
    console.error(
      "REVENUE ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ============================================================
// LEAD ANALYTICS
// GET /api/analytics/leads
// ============================================================

const getLeadAnalytics = async (
  req,
  res
) => {
  try {
    const owner =
      requireUserId(req, res);

    if (!owner) {
      return;
    }

    const [
      bySource,
      byStatus,
      activeLeads,
      convertedLeads,
      totalLeadHistory,
      conversionRate,
    ] = await Promise.all([
      getLeadsBySource(owner),

      getLeadsByStatus(owner),

      calculateActiveLeads(owner),

      calculateConvertedLeads(owner),

      calculateTotalLeadHistory(owner),

      calculateConversionRate(owner),
    ]);

    return res.json({
      success: true,

      bySource,

      byStatus,

      activeLeads,

      convertedLeads,

      totalLeadHistory,

      conversionRate,
    });
  } catch (error) {
    console.error(
      "LEAD ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ============================================================
// CAMPAIGN ANALYTICS
// GET /api/analytics/campaigns
// ============================================================

const getCampaignAnalytics = async (
  req,
  res
) => {
  try {
    const owner =
      requireUserId(req, res);

    if (!owner) {
      return;
    }

    const bySource =
      await getLeadsBySource(
        owner
      );

    return res.json({
      success: true,

      data: bySource,

      bySource,
    });
  } catch (error) {
    console.error(
      "CAMPAIGN ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ============================================================
// RECENT ACTIVITIES
// GET /api/analytics/activities
// ============================================================

const getRecentActivities = async (
  req,
  res
) => {
  try {
    const owner =
      requireUserId(req, res);

    if (!owner) {
      return;
    }

    // ========================================================
    // ACTIVE LEADS ONLY
    // ========================================================

    const recentLeads =
      await Lead.find({
        owner,

        isConverted: {
          $ne: true,
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name status createdAt"
        )
        .lean();

    // ========================================================
    // CUSTOMERS
    // ========================================================

    const recentCustomers =
      await Customer.find({
        owner,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name status createdAt convertedLead"
        )
        .lean();

    // ========================================================
    // BUILD ACTIVITIES
    // ========================================================

    const activities = [
      ...recentLeads.map(
        (lead) => ({
          type: "lead",

          message:
            `New lead: ${
              lead.name || "Lead"
            } (${
              lead.status || "New"
            })`,

          createdAt:
            lead.createdAt,
        })
      ),

      ...recentCustomers.map(
        (customer) => ({
          type: "customer",

          message:
            customer.convertedLead?.leadId
              ? `Lead converted: ${
                  customer.name ||
                  "Customer"
                }`
              : `New customer: ${
                  customer.name ||
                  "Customer"
                }`,

          createdAt:
            customer.createdAt,
        })
      ),
    ]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(0, 10);

    return res.json({
      success: true,

      activities,
    });
  } catch (error) {
    console.error(
      "RECENT ACTIVITIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getAnalyticsOverview,

  getRevenueAnalytics,

  getLeadAnalytics,

  getCampaignAnalytics,

  getRecentActivities,
};