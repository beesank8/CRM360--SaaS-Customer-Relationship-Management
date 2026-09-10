const Customer = require("../models/Customer");
const createNotification =
  require("../utils/createNotification");

// ============================================================
// HELPER
// ============================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id || null;
};

// ============================================================
// CREATE CUSTOMER
// POST /api/customers
// ============================================================

exports.createCustomer = async (req, res) => {
  try {
    const customerData = {
  ...req.body,
};

// Never allow the frontend to assign an arbitrary owner —
// always overwrite with the authenticated user.
delete customerData.owner;

if (req.user?.id) {

  customerData.owner =
    req.user.id;

}


const customer =
  await Customer.create(
    customerData
  );


// ========================================================
// CREATE NOTIFICATION
// ========================================================

try {

  await createNotification({

    userId:
      req.user?.id ||
      customer.owner,

    type:
      "customer",

    title:
      "New customer registered",

    message:
      `${customer.name} was added to CRM360`,

    link:
      "/customers",

    relatedId:
      customer._id,

  });

} catch (notificationError) {

  console.error(
    "CREATE CUSTOMER NOTIFICATION ERROR:",
    notificationError
  );

}


return res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer,
    });

  } catch (error) {

    console.error(
      "CREATE CUSTOMER ERROR:",
      error
    );

    // --------------------------------------------------------
    // VALIDATION ERROR
    // --------------------------------------------------------

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Customer validation failed",
        error: error.message,
      });
    }

    // --------------------------------------------------------
    // DUPLICATE ERROR
    // --------------------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A customer with this email already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// GET ALL CUSTOMERS
// GET /api/customers
// ============================================================

exports.getCustomers = async (req, res) => {
  try {
    const userId = getUserId(req);

    const query = userId
      ? { owner: userId }
      : {};

    const customers =
      await Customer.find(query)
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });

  } catch (error) {

    console.error(
      "GET CUSTOMERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// GET SINGLE CUSTOMER
// GET /api/customers/:id
// ============================================================

exports.getCustomer = async (req, res) => {
  try {
    const userId = getUserId(req);

    const customer =
      await Customer.findOne(
        userId
          ? { _id: req.params.id, owner: userId }
          : { _id: req.params.id }
      );


    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }


    return res.status(200).json({
      success: true,
      customer,
    });

  } catch (error) {

    console.error(
      "GET CUSTOMER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// ============================================================

exports.updateCustomer = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const updateData = {
      ...req.body,
    };

    // Never allow the frontend to change the owner of a
    // customer via update.
    delete updateData.owner;

    const customer =
      await Customer.findOneAndUpdate(
        userId
          ? { _id: req.params.id, owner: userId }
          : { _id: req.params.id },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );


    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Customer updated successfully",
      customer,
    });

  } catch (error) {

    console.error(
      "UPDATE CUSTOMER ERROR:",
      error
    );

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Customer validation failed",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A customer with this email already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// DELETE CUSTOMER
// DELETE /api/customers/:id
// ============================================================

exports.deleteCustomer = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const customer =
      await Customer.findOneAndDelete(
        userId
          ? { _id: req.params.id, owner: userId }
          : { _id: req.params.id }
      );


    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }


    return res.status(200).json({
      success: true,
      message:
        "Customer deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE CUSTOMER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};