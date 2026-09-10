const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

// ============================================================
// ANALYTICS SERVICE
// ============================================================
//
// IMPORTANT:
//
// Converted Leads are deleted.
//
// Therefore analytics MUST NOT depend on:
//
// Lead.isConverted
//
// Instead:
//
// Customer.convertedLead
//
// is the conversion history.
//
// ============================================================

// ============================================================
// ACTIVE LEAD FILTER
// ============================================================

const getActiveLeadFilter = (owner) => {
  const filter = {
    isConverted: {
      $ne: true,
    },
  };

  if (owner) {
    filter.owner = owner;
  }

  return filter;
};

// ============================================================
// CONVERTED CUSTOMER FILTER
// ============================================================

const getConvertedCustomerFilter = (owner) => {
  const filter = {
    "convertedLead.convertedAt": {
      $exists: true,
      $ne: null,
    },
  };

  if (owner) {
    filter.owner = owner;
  }

  return filter;
};

// ============================================================
// COUNT CONVERTED LEADS
// ============================================================

const calculateConvertedLeads = async (owner) => {
  const filter =
    getConvertedCustomerFilter(owner);

  return Customer.countDocuments(filter);
};

// ============================================================
// COUNT ACTIVE LEADS
// ============================================================

const calculateActiveLeads = async (owner) => {
  const filter =
    getActiveLeadFilter(owner);

  return Lead.countDocuments(filter);
};

// ============================================================
// TOTAL LEAD HISTORY
// ============================================================
//
// Historical Leads =
// active Leads + converted Leads
//
// This gives the correct denominator for conversion rate.
//
// ============================================================

const calculateTotalLeadHistory = async (owner) => {
  const [
    activeLeads,
    convertedLeads,
  ] = await Promise.all([
    calculateActiveLeads(owner),
    calculateConvertedLeads(owner),
  ]);

  return activeLeads + convertedLeads;
};

// ============================================================
// TOTAL REVENUE
// ============================================================
//
// Only Customers created through Lead conversion are counted.
//
// ============================================================

const calculateTotalRevenue = async (owner) => {
  const filter =
    getConvertedCustomerFilter(owner);

  const result =
    await Customer.aggregate([
      {
        $match: filter,
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

  return Number(
    result[0]?.total || 0
  );
};

// ============================================================
// LEAD CONVERSION RATE
// ============================================================
//
// converted / (active + converted)
//
// Example:
//
// Active Leads = 8
// Converted Leads = 2
//
// Conversion Rate =
// 2 / (8 + 2) * 100
// = 20%
//
// ============================================================

const calculateConversionRate = async (owner) => {
  const [
    activeLeads,
    convertedLeads,
  ] = await Promise.all([
    calculateActiveLeads(owner),
    calculateConvertedLeads(owner),
  ]);

  const totalLeadHistory =
    activeLeads +
    convertedLeads;

  if (totalLeadHistory === 0) {
    return 0;
  }

  return Number(
    (
      (convertedLeads /
        totalLeadHistory) *
      100
    ).toFixed(2)
  );
};

// ============================================================
// LEADS GROUPED BY SOURCE
// ============================================================

const getLeadsBySource = async (owner) => {
  const filter =
    getActiveLeadFilter(owner);

  const result =
    await Lead.aggregate([
      {
        $match: filter,
      },

      {
        $group: {
          _id: "$source",

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return result.map((row) => ({
    source:
      row._id || "Other",

    count:
      row.count,
  }));
};

// ============================================================
// LEADS GROUPED BY STATUS
// ============================================================

const getLeadsByStatus = async (owner) => {
  const filter =
    getActiveLeadFilter(owner);

  const result =
    await Lead.aggregate([
      {
        $match: filter,
      },

      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return result.map((row) => ({
    status:
      row._id || "New",

    count:
      row.count,
  }));
};

// ============================================================
// MONTHLY TREND
// ============================================================
//
// Last 6 months.
//
// Leads:
//   current active Leads by createdAt
//
// Revenue:
//   converted Customers by convertedLead.convertedAt
//
// This avoids using deleted Lead.expectedValue as revenue.
//
// ============================================================

const getMonthlyTrend = async (
  owner,
  months = 6
) => {
  const activeLeadFilter =
    getActiveLeadFilter(owner);

  const convertedCustomerFilter =
    getConvertedCustomerFilter(owner);

  const now = new Date();

  const since = new Date(
    now.getFullYear(),
    now.getMonth() -
      (months - 1),
    1,
    0,
    0,
    0,
    0
  );

  // ==========================================================
  // FETCH ACTIVE LEADS
  // ==========================================================

  const leads =
    await Lead.find({
      ...activeLeadFilter,

      createdAt: {
        $gte: since,
      },
    })
      .select("createdAt")
      .lean();

  // ==========================================================
  // FETCH CONVERTED CUSTOMERS
  // ==========================================================

  const customers =
    await Customer.find({
      ...convertedCustomerFilter,

      "convertedLead.convertedAt": {
        $gte: since,
      },
    })
      .select(
        "dealValue convertedLead.convertedAt"
      )
      .lean();

  // ==========================================================
  // CREATE MONTH BUCKETS
  // ==========================================================

  const buckets = [];

  for (
    let i = months - 1;
    i >= 0;
    i -= 1
  ) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const year =
      date.getFullYear();

    const monthIndex =
      date.getMonth();

    buckets.push({
      key:
        `${year}-${monthIndex}`,

      month:
        date.toLocaleString(
          "en-US",
          {
            month: "short",
          }
        ),

      leads: 0,

      revenue: 0,
    });
  }

  const bucketMap =
    new Map(
      buckets.map((bucket) => [
        bucket.key,
        bucket,
      ])
    );

  // ==========================================================
  // ADD LEADS
  // ==========================================================

  leads.forEach((lead) => {
    const date =
      new Date(lead.createdAt);

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    const bucket =
      bucketMap.get(key);

    if (bucket) {
      bucket.leads += 1;
    }
  });

  // ==========================================================
  // ADD CONVERTED REVENUE
  // ==========================================================

  customers.forEach((customer) => {
    const convertedAt =
      customer.convertedLead?.convertedAt;

    if (!convertedAt) {
      return;
    }

    const date =
      new Date(convertedAt);

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    const bucket =
      bucketMap.get(key);

    if (bucket) {
      bucket.revenue +=
        Number(
          customer.dealValue || 0
        );
    }
  });

  // ==========================================================
  // RESPONSE
  // ==========================================================

  return buckets.map(
    ({
      month,
      leads,
      revenue,
    }) => ({
      month,

      leads,

      revenue:
        Number(
          revenue || 0
        ),
    })
  );
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  calculateTotalRevenue,

  calculateConversionRate,

  calculateConvertedLeads,

  calculateActiveLeads,

  calculateTotalLeadHistory,

  getLeadsBySource,

  getLeadsByStatus,

  getMonthlyTrend,
};