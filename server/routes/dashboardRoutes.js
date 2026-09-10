const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const Customer =
  require("../models/Customer");

const Lead =
  require("../models/Lead");

const authMiddleware =
  require("../middleware/authMiddleware");

const router =
  express.Router();

// ============================================================
// HELPERS
// ============================================================

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?._id ||
    null
  );
};

const calculateGrowth = (
  current,
  previous
) => {
  const currentValue =
    Number(current) || 0;

  const previousValue =
    Number(previous) || 0;

  if (previousValue === 0) {
    return currentValue > 0
      ? 100
      : 0;
  }

  return Number(
    (
      (
        (currentValue -
          previousValue) /
        Math.abs(
          previousValue
        )
      ) *
      100
    ).toFixed(2)
  );
};

const getStartOfDay = (
  date = new Date()
) => {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

const getStartOfMonth = (
  date = new Date()
) => {
  const result =
    new Date(date);

  result.setDate(1);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

const getStartOfLastMonth = (
  date = new Date()
) => {
  const result =
    new Date(date);

  result.setDate(1);

  result.setMonth(
    result.getMonth() - 1
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

const getStartOfNextMonth = (
  date = new Date()
) => {
  const result =
    new Date(date);

  result.setDate(1);

  result.setMonth(
    result.getMonth() + 1
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

// ============================================================
// CRM STATUS
// GET /api/dashboard/status
// ============================================================

router.get(
  "/status",
  authMiddleware,
  async (req, res) => {
    try {
      let databaseStatus =
        "Disconnected";

      if (
        mongoose.connection
          .readyState === 1
      ) {
        databaseStatus =
          "Connected";
      } else if (
        mongoose.connection
          .readyState === 2
      ) {
        databaseStatus =
          "Connecting";
      }

      let storageStatus =
        "Available";

      try {
        fs.accessSync(
          process.cwd(),
          fs.constants.R_OK
        );
      } catch (error) {
        storageStatus =
          "Unavailable";
      }

      return res.status(200).json({
        success: true,

        status: {
          server: "Online",

          database:
            databaseStatus,

          storage:
            storageStatus,
        },

        timestamp:
          new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "CRM STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve CRM status",
      });
    }
  }
);

// ============================================================
// DASHBOARD STATS
// GET /api/dashboard/stats
// ============================================================

router.get(
  "/stats",
  authMiddleware,
  async (req, res) => {
    try {
      const userId =
        getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid authenticated user",
        });
      }

      // ========================================================
      // OWNER FILTER
      // ========================================================

      const ownerFilter = {
        owner:
          new mongoose.Types.ObjectId(
            userId
          ),
      };

      // ========================================================
      // DATE SETUP
      // ========================================================

      const now =
        new Date();

      const startOfToday =
        getStartOfDay(now);

      const startOfMonth =
        getStartOfMonth(now);

      const startOfNextMonth =
        getStartOfNextMonth(now);

      const startOfLastMonth =
        getStartOfLastMonth(now);

      // ========================================================
      // CUSTOMER COUNTS
      // ========================================================

      const customers =
        await Customer.countDocuments(
          ownerFilter
        );

      const activeCustomers =
        await Customer.countDocuments({
          ...ownerFilter,

          status: "Active",
        });

      const customersThisMonth =
        await Customer.countDocuments({
          ...ownerFilter,

          createdAt: {
            $gte: startOfMonth,

            $lt:
              startOfNextMonth,
          },
        });

      const customersLastMonth =
        await Customer.countDocuments({
          ...ownerFilter,

          createdAt: {
            $gte:
              startOfLastMonth,

            $lt:
              startOfMonth,
          },
        });

      const customerGrowth =
        calculateGrowth(
          customersThisMonth,
          customersLastMonth
        );

      // ========================================================
      // ACTIVE LEADS
      // ========================================================
      //
      // IMPORTANT:
      //
      // Converted Leads are deleted in the new architecture.
      //
      // isConverted != true also protects against old legacy
      // converted Lead documents.
      //
      // ========================================================

      const activeLeadFilter = {
        ...ownerFilter,

        isConverted: {
          $ne: true,
        },
      };

      const leads =
        await Lead.countDocuments(
          activeLeadFilter
        );

      const leadsThisMonth =
        await Lead.countDocuments({
          ...activeLeadFilter,

          createdAt: {
            $gte:
              startOfMonth,

            $lt:
              startOfNextMonth,
          },
        });

      const leadsLastMonth =
        await Lead.countDocuments({
          ...activeLeadFilter,

          createdAt: {
            $gte:
              startOfLastMonth,

            $lt:
              startOfMonth,
          },
        });

      const leadGrowth =
        calculateGrowth(
          leadsThisMonth,
          leadsLastMonth
        );

      // ========================================================
      // CONVERTED LEADS
      // ========================================================
      //
      // Converted Leads now live in Customer.convertedLead.
      //
      // ========================================================

      const convertedLeadFilter = {
        ...ownerFilter,

        "convertedLead.convertedAt": {
          $exists: true,

          $ne: null,
        },
      };

      const convertedLeads =
        await Customer.countDocuments(
          convertedLeadFilter
        );

      // ========================================================
      // TODAY COUNTS
      // ========================================================

      const todayCustomers =
        await Customer.countDocuments({
          ...ownerFilter,

          createdAt: {
            $gte:
              startOfToday,

            $lt:
              now,
          },
        });

      const todayLeads =
        await Lead.countDocuments({
          ...activeLeadFilter,

          createdAt: {
            $gte:
              startOfToday,

            $lt:
              now,
          },
        });

      // ========================================================
      // REVENUE EXPRESSION
      // ========================================================

      const revenueValue = {
        $convert: {
          input:
            "$dealValue",

          to: "double",

          onError: 0,

          onNull: 0,
        },
      };

      // ========================================================
      // TOTAL REVENUE
      // ========================================================

      const totalRevenueResult =
        await Customer.aggregate([
          {
            $match:
              convertedLeadFilter,
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum:
                  revenueValue,
              },
            },
          },
        ]);

      const revenue =
        Number(
          totalRevenueResult[0]
            ?.totalRevenue || 0
        );

      // ========================================================
      // THIS MONTH REVENUE
      // ========================================================

      const thisMonthRevenueResult =
        await Customer.aggregate([
          {
            $match: {
              ...convertedLeadFilter,

              "convertedLead.convertedAt":
                {
                  $gte:
                    startOfMonth,

                  $lt:
                    startOfNextMonth,
                },
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum:
                  revenueValue,
              },
            },
          },
        ]);

      const thisMonthRevenue =
        Number(
          thisMonthRevenueResult[0]
            ?.totalRevenue || 0
        );

      // ========================================================
      // LAST MONTH REVENUE
      // ========================================================

      const lastMonthRevenueResult =
        await Customer.aggregate([
          {
            $match: {
              ...convertedLeadFilter,

              "convertedLead.convertedAt":
                {
                  $gte:
                    startOfLastMonth,

                  $lt:
                    startOfMonth,
                },
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum:
                  revenueValue,
              },
            },
          },
        ]);

      const lastMonthRevenue =
        Number(
          lastMonthRevenueResult[0]
            ?.totalRevenue || 0
        );

      // ========================================================
      // REVENUE GROWTH
      // ========================================================

      const revenueGrowth =
        calculateGrowth(
          thisMonthRevenue,
          lastMonthRevenue
        );

      // ========================================================
      // TODAY REVENUE
      // ========================================================

      const todayRevenueResult =
        await Customer.aggregate([
          {
            $match: {
              ...convertedLeadFilter,

              "convertedLead.convertedAt":
                {
                  $gte:
                    startOfToday,

                  $lt:
                    now,
                },
            },
          },

          {
            $group: {
              _id: null,

              totalRevenue: {
                $sum:
                  revenueValue,
              },
            },
          },
        ]);

      const todayRevenue =
        Number(
          todayRevenueResult[0]
            ?.totalRevenue || 0
        );

      // ========================================================
      // OVERALL GROWTH
      // ========================================================

      const growth =
        Number(
          (
            (
              Number(
                customerGrowth
              ) +
              Number(
                leadGrowth
              )
            ) / 2
          ).toFixed(2)
        );

      // ========================================================
      // RECENT CUSTOMERS
      // ========================================================

      const recentCustomers =
        await Customer.find(
          ownerFilter
        )
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            [
              "name",
              "email",
              "phone",
              "company",
              "status",
              "dealValue",
              "probability",
              "source",
              "createdAt",
              "convertedLead",
            ].join(" ")
          )
          .lean();

      // ========================================================
      // RECENT ACTIVE LEADS
      // ========================================================

      const recentLeads =
        await Lead.find(
          activeLeadFilter
        )
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            [
              "name",
              "email",
              "phone",
              "company",
              "status",
              "expectedValue",
              "probability",
              "source",
              "priority",
              "createdAt",
              "updatedAt",
            ].join(" ")
          )
          .lean();

      // ========================================================
      // CUSTOMER ACTIVITIES
      // ========================================================

      const customerActivities =
        recentCustomers.map(
          (customer) => ({
            type: "customer",

            title:
              customer
                .convertedLead
                ?.leadId
                ? "Lead converted"
                : "New customer added",

            description:
              customer
                .convertedLead
                ?.leadId
                ? `${
                    customer.name ||
                    "Lead"
                  } was converted to a customer`
                : customer.name
                ? `${customer.name} was added as a customer`
                : "A new customer was added",

            name:
              customer.name ||
              "",

            company:
              customer.company ||
              "",

            createdAt:
              customer.createdAt,
          })
        );

      // ========================================================
      // LEAD ACTIVITIES
      // ========================================================

      const leadActivities =
        recentLeads.map(
          (lead) => ({
            type: "lead",

            title:
              "Lead activity",

            description:
              lead.name
                ? `${lead.name} is in ${
                    lead.status ||
                    "New"
                  } status`
                : "A lead was added",

            name:
              lead.name ||
              "",

            company:
              lead.company ||
              "",

            createdAt:
              lead.createdAt,
          })
        );

      // ========================================================
      // COMBINE ACTIVITIES
      // ========================================================

      const activities = [
        ...customerActivities,

        ...leadActivities,
      ]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 8);

      // ========================================================
      // MONTHLY REVENUE DATA
      // ========================================================

      const revenueData =
        await Customer.aggregate([
          {
            $match:
              convertedLeadFilter,
          },

          {
            $addFields: {
              revenueAmount:
                revenueValue,
            },
          },

          {
            $group: {
              _id: {
                year: {
                  $year:
                    "$convertedLead.convertedAt",
                },

                month: {
                  $month:
                    "$convertedLead.convertedAt",
                },
              },

              revenue: {
                $sum:
                  "$revenueAmount",
              },
            },
          },

          {
            $sort: {
              "_id.year": 1,

              "_id.month": 1,
            },
          },
        ]);

      // ========================================================
      // FORMAT REVENUE DATA
      // ========================================================

      const formattedRevenueData =
        revenueData.map(
          (item) => ({
            year:
              item._id.year,

            month:
              item._id.month,

            revenue:
              Number(
                item.revenue || 0
              ),
          })
        );

      // ========================================================
      // FINAL RESPONSE
      // ========================================================

      return res.status(200).json({
        success: true,

        customers,

        activeCustomers,

        customerGrowth,

        leads,

        convertedLeads,

        leadGrowth,

        revenue,

        thisMonthRevenue,

        lastMonthRevenue,

        revenueGrowth,

        todayCustomers,

        todayLeads,

        todayRevenue,

        growth,

        activities,

        recentCustomers,

        recentLeads,

        revenueData:
          formattedRevenueData,

        updatedAt:
          new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "=========================================="
      );

      console.error(
        "DASHBOARD STATS ERROR"
      );

      console.error(
        "=========================================="
      );

      console.error(error);

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to load dashboard statistics",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;