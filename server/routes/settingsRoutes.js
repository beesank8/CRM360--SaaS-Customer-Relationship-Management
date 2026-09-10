const express = require("express");
const multer = require("multer");

const router = express.Router();


// ============================================================
// MIDDLEWARE
// ============================================================

const authMiddleware =
  require("../middleware/authMiddleware");


// ============================================================
// CONTROLLERS
// ============================================================

const {
  getSettings,
  updateProfile,
  uploadProfilePicture,
  getProfilePicture,
  deleteProfilePicture,
  changePassword,
  updateNotifications,
  updateAppearance,
  updatePreferences,
  deleteAccount,
} = require("../controllers/settingsController");


// ============================================================
// MULTER CONFIGURATION
// ============================================================

const storage =
  multer.memoryStorage();


// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype &&
    file.mimetype.startsWith("image/")
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only image files are allowed"
      ),
      false
    );

  }

};


// ============================================================
// MULTER UPLOAD
// ============================================================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        5 * 1024 * 1024,

    },

  });


// ============================================================
// GET SETTINGS
// GET /api/settings
// ============================================================

router.get(
  "/",
  authMiddleware,
  getSettings
);


// ============================================================
// UPDATE PROFILE
// PUT /api/settings/profile
// ============================================================

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


// ============================================================
// UPLOAD PROFILE PICTURE
// POST /api/settings/profile-picture
// ============================================================

router.post(
  "/profile-picture",

  authMiddleware,

  upload.single(
    "profilePicture"
  ),

  uploadProfilePicture
);


// ============================================================
// GET PROFILE PICTURE
// GET /api/settings/profile-picture
// ============================================================

router.get(
  "/profile-picture",
  authMiddleware,
  getProfilePicture
);


// ============================================================
// DELETE PROFILE PICTURE
// DELETE /api/settings/profile-picture
// ============================================================

router.delete(
  "/profile-picture",
  authMiddleware,
  deleteProfilePicture
);


// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

router.put(
  "/password",
  authMiddleware,
  changePassword
);


// ============================================================
// UPDATE NOTIFICATIONS
// PUT /api/settings/notifications
// ============================================================

router.put(
  "/notifications",
  authMiddleware,
  updateNotifications
);


// ============================================================
// UPDATE APPEARANCE
// PUT /api/settings/appearance
// ============================================================

router.put(
  "/appearance",
  authMiddleware,
  updateAppearance
);


// ============================================================
// UPDATE CRM PREFERENCES
// PUT /api/settings/preferences
// ============================================================

router.put(
  "/preferences",
  authMiddleware,
  updatePreferences
);


// ============================================================
// DELETE ACCOUNT
// DELETE /api/settings/account
// ============================================================

router.delete(
  "/account",
  authMiddleware,
  deleteAccount
);


// ============================================================
// MULTER ERROR HANDLER
// ============================================================

router.use(
  (
    error,
    req,
    res,
    next
  ) => {

    // --------------------------------------------------------
    // MULTER ERRORS
    // --------------------------------------------------------

    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Profile picture must be less than 5MB",

        });

      }


      return res.status(400).json({

        success: false,

        message:
          error.message,

      });

    }


    // --------------------------------------------------------
    // FILE FILTER ERROR
    // --------------------------------------------------------

    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.message ||
          "File upload failed",

      });

    }


    next();

  }
);


// ============================================================
// EXPORT
// ============================================================

module.exports =
  router;