// ============================================================
// CRM360 SERVER
// ============================================================

const express = require("express");
const cors = require("cors");

require("dotenv").config();

// ============================================================
// REQUIRED ENVIRONMENT VARIABLES
//
// Fail fast with a clear message rather than starting the
// server with a missing/placeholder JWT secret (which would
// silently make auth insecure) or no database URI configured.
// ============================================================

const PLACEHOLDER_JWT_SECRETS = new Set([
  "",
  "replace_with_a_long_random_secret",
  "your_jwt_secret",
  "secret",
]);

if (
  !process.env.JWT_SECRET ||
  PLACEHOLDER_JWT_SECRETS.has(process.env.JWT_SECRET)
) {
  console.error(
    "FATAL: JWT_SECRET is missing or still set to a placeholder value in your .env file.\n" +
      "Generate a real secret, e.g.:\n" +
      "  node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"\n" +
      "and set it as JWT_SECRET in server/.env before starting the server."
  );
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error(
    "FATAL: MONGO_URI is not set in server/.env. Set it to your MongoDB connection string."
  );
  process.exit(1);
}

// ============================================================
// DATABASE
// ============================================================

const connectDB = require("./config/db");

// ============================================================
// ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ============================================================
// APP
// ============================================================

const app = express();

// ============================================================
// PORT
// ============================================================

const PORT = process.env.PORT || 5000;

// ============================================================
// CORS CONFIGURATION
// ============================================================

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests without an origin
    // such as Postman or server-to-server requests.

    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost and 127.0.0.1
    // on any port.

    const allowedLocalhost =
      /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

    if (allowedLocalhost.test(origin)) {
      return callback(null, true);
    }

    // Additional allowed origins.

    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(
      "CORS blocked origin:",
      origin
    );

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};

// ============================================================
// CORS MIDDLEWARE
// ============================================================

app.use(cors(corsOptions));

// ============================================================
// BODY PARSERS
// ============================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ============================================================
// REQUEST LOGGER
// ============================================================

app.use(
  (req, res, next) => {

    console.log(
      `${req.method} ${req.originalUrl}`
    );

    next();
  }
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "CRM360 API Server is running",
      status: "OK",
    });

  }
);

// ============================================================
// API HEALTH CHECK
// ============================================================

app.get(
  "/api",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "CRM360 API is running",
    });

  }
);

// ============================================================
// AUTH ROUTES
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================================
// CUSTOMER ROUTES
// ============================================================

app.use(
  "/api/customers",
  customerRoutes
);

// ============================================================
// LEAD ROUTES
// ============================================================

app.use(
  "/api/leads",
  leadRoutes
);

// ============================================================
// DASHBOARD ROUTES
// ============================================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// ============================================================
// ANALYTICS ROUTES
// ============================================================

app.use(
  "/api/analytics",
  analyticsRoutes
);

// ============================================================
// SETTINGS ROUTES
// ============================================================

app.use(
  "/api/settings",
  settingsRoutes
);

// ============================================================
// NOTIFICATION ROUTES
// ============================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use(
  (req, res) => {

    console.warn(
      "404 - Route not found:",
      req.method,
      req.originalUrl
    );

    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });

  }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    // --------------------------------------------------------
    // CORS ERROR
    // --------------------------------------------------------

    if (
      error.message ===
      "Not allowed by CORS"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "CORS policy blocked this request",
      });

    }

    // --------------------------------------------------------
    // MULTER ERROR
    // --------------------------------------------------------

    if (
      error.name === "MulterError"
    ) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });

    }

    // --------------------------------------------------------
    // GENERAL ERROR
    // --------------------------------------------------------

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });

  }
);

// ============================================================
// START SERVER
// ============================================================

const startServer = async () => {

  try {

    // --------------------------------------------------------
    // CONNECT DATABASE
    // --------------------------------------------------------

    await connectDB();

    // --------------------------------------------------------
    // START EXPRESS SERVER
    // --------------------------------------------------------

    app.listen(
      PORT,
      () => {

        console.log(
          "=========================================="
        );

        console.log(
          "        CRM360 SERVER STARTED"
        );

        console.log(
          "=========================================="
        );

        console.log(
          `Server: http://localhost:${PORT}`
        );

        console.log(
          `API:    http://localhost:${PORT}/api`
        );

        console.log(
          `Settings: http://localhost:${PORT}/api/settings`
        );

        console.log(
          "Database: Connected"
        );

        console.log(
          "=========================================="
        );

      }
    );

  } catch (error) {

    console.error(
      "SERVER START ERROR:",
      error
    );

    process.exit(1);

  }

};

// ============================================================
// START
// ============================================================

startServer();