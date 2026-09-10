const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

const createNotification = require("../utils/createNotification");

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
// GET ALL LEADS
// GET /api/leads
// ============================================================

exports.getLeads = async (req, res) => {
  try {
    const userId = requireUserId(req, res);

    if (!userId) {
      return;
    }

    const leads = await Lead.find({
      owner: userId,

      // Hide any legacy converted leads that may still exist
      // from before the new conversion architecture.
      isConverted: {
        $ne: true,
      },
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE LEAD
// GET /api/leads/:id
// ============================================================

exports.getLead = async (req, res) => {
  try {
    const userId = requireUserId(req, res);

    if (!userId) {
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      owner: userId,
      isConverted: {
        $ne: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("GET LEAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE LEAD
// POST /api/leads
// ============================================================

exports.createLead = async (req, res) => {
  try {
    const userId = requireUserId(req, res);

    if (!userId) {
      return;
    }

    const leadData = {
      ...req.body,
    };

    // --------------------------------------------------------
    // SECURITY
    // Never trust owner from frontend.
    // --------------------------------------------------------

    delete leadData.owner;

    leadData.owner = userId;

    // --------------------------------------------------------
    // NEVER ALLOW FRONTEND TO CREATE A CONVERTED LEAD
    // --------------------------------------------------------

    delete leadData.isConverted;
    delete leadData.convertedAt;
    delete leadData.convertedCustomer;

    if (leadData.status === "Converted") {
      leadData.status = "New";
    }

    const lead = await Lead.create(leadData);

    // --------------------------------------------------------
    // NOTIFICATION
    // --------------------------------------------------------

    try {
      await createNotification({
        userId,

        type: "lead",

        title: "New lead added",

        message: `${lead.name || "A new lead"} was added as a new lead`,

        link: "/leads",

        relatedId: lead._id,
      });
    } catch (notificationError) {
      console.error(
        "CREATE LEAD NOTIFICATION ERROR:",
        notificationError
      );
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Lead validation failed",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE LEAD
// PUT /api/leads/:id
// ============================================================

exports.updateLead = async (req, res) => {
  try {
    const userId = requireUserId(req, res);

    if (!userId) {
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const updateData = {
      ...req.body,
    };

    // --------------------------------------------------------
    // SECURITY
    // --------------------------------------------------------

    delete updateData.owner;

    // --------------------------------------------------------
    // NEVER ALLOW FRONTEND TO MANIPULATE CONVERSION FIELDS
    // --------------------------------------------------------

    delete updateData.isConverted;
    delete updateData.converted;
    delete updateData.convertedAt;
    delete updateData.convertedCustomer;

    // --------------------------------------------------------
    // CONVERTED STATUS IS CONTROLLED ONLY BY BACKEND
    // --------------------------------------------------------

    if (updateData.status === "Converted") {
      delete updateData.status;
    }

    const lead = await Lead.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        isConverted: {
          $ne: true,
        },
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Lead validation failed",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE LEAD
// DELETE /api/leads/:id
// ============================================================

exports.deleteLead = async (req, res) => {
  try {
    const userId = requireUserId(req, res);

    if (!userId) {
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findOneAndDelete({
      _id: id,
      owner: userId,
      isConverted: {
        $ne: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// ============================================================
// CHECK TRANSACTION SUPPORT
// ============================================================
//
// MongoDB transactions require either:
// - Replica set
// - MongoDB Atlas
// - mongos/sharded deployment
//
// Normal local MongoDB is often standalone.
//
// This function allows CRM360 to work with both.
//
// ============================================================

const supportsTransactions = async () => {
  try {
    if (!mongoose.connection.db) {
      return false;
    }

    const admin = mongoose.connection.db.admin();

    let info = null;

    try {
      info = await admin.command({
        hello: 1,
      });
    } catch (error) {
      try {
        info = await admin.command({
          isMaster: 1,
        });
      } catch (fallbackError) {
        return false;
      }
    }

    return Boolean(
      info?.setName ||
        info?.msg === "isdbgrid"
    );
  } catch (error) {
    console.warn(
      "Could not determine MongoDB transaction support:",
      error.message
    );

    return false;
  }
};

// ============================================================
// CONVERT LEAD TO CUSTOMER
// POST /api/leads/:id/convert
// ============================================================
//
// IMPORTANT:
//
// 1. Find Lead belonging to authenticated user.
// 2. Create Customer.
// 3. Store original Lead inside Customer.convertedLead.
// 4. Delete original Lead.
// 5. Customer remains as the permanent conversion history.
// 6. Analytics reads conversion history from Customer.
//
// Therefore:
//
// BEFORE:
//
// Lead
//   ↓
// Leads list
//
// AFTER:
//
// Customer
//   └── convertedLead
//          └── original lead information
//
// The Lead itself no longer exists.
//
// ============================================================

exports.convertLead = async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID",
    });
  }

  let session = null;
  let transactionStarted = false;
  let createdCustomer = null;

  try {
    // ========================================================
    // CHECK MONGODB TRANSACTION SUPPORT
    // ========================================================

    const useTransaction = await supportsTransactions();

    if (useTransaction) {
      session = await mongoose.startSession();

      try {
        session.startTransaction();

        transactionStarted = true;
      } catch (transactionError) {
        console.warn(
          "Transaction could not be started. Using manual rollback:",
          transactionError.message
        );

        transactionStarted = false;

        await session.endSession();

        session = null;
      }
    }

    // ========================================================
    // FIND ORIGINAL LEAD
    // ========================================================

    const leadQuery = {
      _id: id,
      owner: userId,

      // Prevent legacy converted records from being
      // converted again.
      isConverted: {
        $ne: true,
      },
    };

    let leadQueryBuilder = Lead.findOne(leadQuery);

    if (session) {
      leadQueryBuilder = leadQueryBuilder.session(session);
    }

    const lead = await leadQueryBuilder;

    if (!lead) {
      if (transactionStarted && session?.inTransaction()) {
        await session.abortTransaction();
      }

      if (session) {
        await session.endSession();
      }

      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // ========================================================
    // PREVENT DOUBLE CONVERSION
    // ========================================================

    if (
      lead.isConverted === true ||
      lead.status === "Converted"
    ) {
      if (transactionStarted && session?.inTransaction()) {
        await session.abortTransaction();
      }

      if (session) {
        await session.endSession();
      }

      return res.status(409).json({
        success: false,
        message: "This lead is already converted",
      });
    }

    // ========================================================
    // NORMALIZE EMAIL
    // ========================================================

    const normalizedEmail = String(
      lead.email || ""
    )
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      if (transactionStarted && session?.inTransaction()) {
        await session.abortTransaction();
      }

      if (session) {
        await session.endSession();
      }

      return res.status(400).json({
        success: false,
        message: "Lead email is required before conversion",
      });
    }

    // ========================================================
    // CHECK WHETHER CUSTOMER ALREADY EXISTS
    // ========================================================

    const customerQuery = {
      owner: userId,
      email: normalizedEmail,
    };

    let existingCustomerQuery =
      Customer.findOne(customerQuery);

    if (session) {
      existingCustomerQuery =
        existingCustomerQuery.session(session);
    }

    const existingCustomer =
      await existingCustomerQuery;

    if (existingCustomer) {
      if (
        transactionStarted &&
        session?.inTransaction()
      ) {
        await session.abortTransaction();
      }

      if (session) {
        await session.endSession();
      }

      return res.status(409).json({
        success: false,
        message:
          "A customer with this email already exists",
        customer: existingCustomer,
      });
    }

    // ========================================================
    // CONVERSION TIMESTAMP
    // ========================================================

    const convertedAt = new Date();

    // ========================================================
    // CUSTOMER DATA
    // ========================================================

    const customerData = {
      name: lead.name || "",

      email: normalizedEmail,

      phone: lead.phone || "",

      company: lead.company || "",

      industry: lead.industry || "",

      status: "Active",

      // SECURITY:
      // Always use authenticated user.
      owner: userId,

      // Lead expectedValue becomes Customer dealValue.
      dealValue: Number(
        lead.expectedValue || 0
      ),

      probability: Number(
        lead.probability || 0
      ),

      source: lead.source || "",

      priority: lead.priority || "Medium",

      nextFollowUp:
        lead.nextFollowUp || null,

      notes: lead.notes || "",

      // ======================================================
      // COMPLETE ORIGINAL LEAD SNAPSHOT
      // ======================================================

      convertedLead: {
        leadId: lead._id,

        name: lead.name || "",

        email: normalizedEmail,

        phone: lead.phone || "",

        company: lead.company || "",

        industry: lead.industry || "",

        source: lead.source || "",

        status: lead.status || "New",

        priority: lead.priority || "Medium",

        expectedValue: Number(
          lead.expectedValue || 0
        ),

        probability: Number(
          lead.probability || 0
        ),

        nextFollowUp:
          lead.nextFollowUp || null,

        notes: lead.notes || "",

        owner: userId,

        createdAt:
          lead.createdAt || null,

        updatedAt:
          lead.updatedAt || null,

        convertedAt,
      },
    };

    // ========================================================
    // CREATE CUSTOMER
    // ========================================================

    if (session) {
      const createdCustomers =
        await Customer.create(
          [customerData],
          {
            session,
          }
        );

      createdCustomer =
        createdCustomers[0];
    } else {
      createdCustomer =
        await Customer.create(
          customerData
        );
    }

    // ========================================================
    // DELETE ORIGINAL LEAD
    // ========================================================
    //
    // THIS IS THE IMPORTANT PART.
    //
    // After this succeeds, the Lead disappears from the
    // Leads collection and therefore from the Leads page.
    //
    // The original information is already preserved inside
    // Customer.convertedLead.
    //
    // ========================================================

    let deletedLeadQuery =
      Lead.findOneAndDelete({
        _id: lead._id,
        owner: userId,
        isConverted: {
          $ne: true,
        },
      });

    if (session) {
      deletedLeadQuery =
        deletedLeadQuery.session(session);
    }

    const deletedLead =
      await deletedLeadQuery;

    if (!deletedLead) {
      // ------------------------------------------------------
      // TRANSACTION MODE
      // ------------------------------------------------------

      if (
        transactionStarted &&
        session?.inTransaction()
      ) {
        await session.abortTransaction();

        await session.endSession();

        return res.status(500).json({
          success: false,
          message:
            "Lead conversion failed because the original lead could not be deleted",
        });
      }

      // ------------------------------------------------------
      // STANDALONE MONGODB
      // Manual rollback.
      // ------------------------------------------------------

      if (createdCustomer?._id) {
        try {
          await Customer.findByIdAndDelete(
            createdCustomer._id
          );
        } catch (rollbackError) {
          console.error(
            "CONVERSION CUSTOMER ROLLBACK ERROR:",
            rollbackError
          );
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Lead conversion failed because the original lead could not be deleted",
      });
    }

    // ========================================================
    // COMMIT TRANSACTION
    // ========================================================

    if (
      transactionStarted &&
      session?.inTransaction()
    ) {
      await session.commitTransaction();

      await session.endSession();
    }

    // ========================================================
    // NOTIFICATION
    // ========================================================
    //
    // Notification happens AFTER successful conversion.
    //
    // A notification error must never undo a successful
    // Lead -> Customer conversion.
    //
    // ========================================================

    try {
      await createNotification({
        userId,

        type: "conversion",

        title: "Lead converted successfully",

        message:
          `${createdCustomer.name || "Lead"} is now a customer`,

        link: "/customers",

        relatedId:
          createdCustomer._id,
      });
    } catch (notificationError) {
      console.error(
        "CONVERSION NOTIFICATION ERROR:",
        notificationError
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,

      message:
        "Lead converted to customer successfully",

      // The Lead was deleted.
      lead: null,

      customer:
        createdCustomer,

      leadDeleted: true,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "CONVERT LEAD ERROR"
    );

    console.error(
      "=========================================="
    );

    console.error(error);

    // ========================================================
    // TRANSACTION ROLLBACK
    // ========================================================

    if (
      transactionStarted &&
      session?.inTransaction()
    ) {
      try {
        await session.abortTransaction();
      } catch (rollbackError) {
        console.error(
          "TRANSACTION ABORT ERROR:",
          rollbackError
        );
      }
    }

    if (session) {
      try {
        await session.endSession();
      } catch (sessionError) {
        console.error(
          "SESSION END ERROR:",
          sessionError
        );
      }
    }

    // ========================================================
    // MANUAL ROLLBACK
    // ========================================================

    if (
      !transactionStarted &&
      createdCustomer?._id
    ) {
      try {
        await Customer.findByIdAndDelete(
          createdCustomer._id
        );

        console.log(
          "Conversion rollback successful: Customer deleted."
        );
      } catch (rollbackError) {
        console.error(
          "CONVERSION ROLLBACK ERROR:",
          rollbackError
        );
      }
    }

    // ========================================================
    // DUPLICATE CUSTOMER
    // ========================================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A customer with this email already exists",
      });
    }

    // ========================================================
    // VALIDATION ERROR
    // ========================================================

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer validation failed",
        error:
          error.message,
      });
    }

    // ========================================================
    // GENERAL ERROR
    // ========================================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to convert lead",
      error:
        error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getLeads: exports.getLeads,
  getLead: exports.getLead,
  createLead: exports.createLead,
  updateLead: exports.updateLead,
  deleteLead: exports.deleteLead,
  convertLead: exports.convertLead,
};