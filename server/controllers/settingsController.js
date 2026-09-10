const User = require("../models/User");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Notification = require("../models/Notification");
const Deal = require("../models/Deal");
const bcrypt = require("bcryptjs");


// ============================================================
// GET SETTINGS
// GET /api/settings
// ============================================================

exports.getSettings = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(req.user.id)
        .select("-password -profileImage.data");


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    return res.status(200).json({

      success: true,

      settings: user,

    });

  } catch (error) {

    console.error(
      "GET SETTINGS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load settings",

    });

  }

};


// ============================================================
// UPDATE PROFILE
// PUT /api/settings/profile
// ============================================================

exports.updateProfile = async (
  req,
  res
) => {

  try {

    const {
      firstName,
      lastName,
      name,
      email,
      phone,
      jobTitle,
    } = req.body;


    const user =
      await User.findById(req.user.id);


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    // --------------------------------------------------------
    // NAME
    // --------------------------------------------------------

    if (
      firstName !== undefined ||
      lastName !== undefined
    ) {

      const currentName =
        user.name || "";


      const parts =
        currentName
          .trim()
          .split(/\s+/)
          .filter(Boolean);


      const currentFirstName =
        parts[0] || "";


      const currentLastName =
        parts.slice(1).join(" ");


      const newFirstName =
        firstName !== undefined
          ? String(firstName).trim()
          : currentFirstName;


      const newLastName =
        lastName !== undefined
          ? String(lastName).trim()
          : currentLastName;


      user.name =
        `${newFirstName} ${newLastName}`.trim();

    } else if (
      name !== undefined
    ) {

      user.name =
        String(name).trim();

    }


    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    if (
      email !== undefined
    ) {

      user.email =
        String(email)
          .trim()
          .toLowerCase();

    }


    // --------------------------------------------------------
    // PHONE
    // --------------------------------------------------------

    if (
      phone !== undefined
    ) {

      user.phone =
        String(phone).trim();

    }


    // --------------------------------------------------------
    // JOB TITLE
    // --------------------------------------------------------

    if (
      jobTitle !== undefined
    ) {

      user.jobTitle =
        String(jobTitle).trim();

    }


    await user.save();


    return res.status(200).json({

      success: true,

      message:
        "Profile updated successfully",

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        jobTitle: user.jobTitle,

        role: user.role,

        createdAt:
          user.createdAt,

      },

    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );


    // --------------------------------------------------------
    // DUPLICATE EMAIL
    //
    // Changing the email to one already used by another user
    // trips the unique index on User.email. That is a normal,
    // expected conflict (not a server fault), so it should come
    // back as 409 with a useful message instead of a generic
    // 500.
    // --------------------------------------------------------

    if (error.code === 11000) {

      return res.status(409).json({

        success: false,

        message:
          "This email is already in use by another account",

      });

    }


    // --------------------------------------------------------
    // VALIDATION ERROR
    // --------------------------------------------------------

    if (error.name === "ValidationError") {

      return res.status(400).json({

        success: false,

        message:
          error.message,

      });

    }


    return res.status(500).json({

      success: false,

      message:
        "Failed to update profile",

    });

  }

};


// ============================================================
// UPLOAD PROFILE PICTURE
// POST /api/settings/profile-picture
// ============================================================

exports.uploadProfilePicture =
  async (
    req,
    res
  ) => {

    try {

      // ------------------------------------------------------
      // CHECK FILE
      // ------------------------------------------------------

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a profile picture",

        });

      }


      // ------------------------------------------------------
      // FIND USER
      // ------------------------------------------------------

      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // ------------------------------------------------------
      // SAVE IMAGE
      // ------------------------------------------------------

      user.profileImage = {

        data:
          req.file.buffer,

        contentType:
          req.file.mimetype,

      };


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "Profile picture updated successfully",

      });

    } catch (error) {

      console.error(
        "UPLOAD PROFILE IMAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// GET PROFILE PICTURE
// GET /api/settings/profile-picture
// ============================================================

exports.getProfilePicture =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select(
          "profileImage"
        );


      if (
        !user ||
        !user.profileImage ||
        !user.profileImage.data
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Profile picture not found",

        });

      }


      res.set(
        "Content-Type",
        user.profileImage.contentType ||
        "image/jpeg"
      );


      res.set(
        "Cache-Control",
        "no-store"
      );


      return res.send(
        user.profileImage.data
      );

    } catch (error) {

      console.error(
        "GET PROFILE IMAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// DELETE PROFILE PICTURE
// DELETE /api/settings/profile-picture
// ============================================================

exports.deleteProfilePicture =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      user.profileImage = {

        data: null,

        contentType: "",

      };


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "Profile picture removed successfully",

      });

    } catch (error) {

      console.error(
        "DELETE PROFILE IMAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

exports.changePassword =
  async (
    req,
    res
  ) => {

    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;


      if (
        !currentPassword ||
        !newPassword
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Both passwords are required",

        });

      }


      if (
        newPassword.length < 6
      ) {

        return res.status(400).json({

          success: false,

          message:
            "New password must be at least 6 characters",

        });

      }


      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );


      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Current password is incorrect",

        });

      }


      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      // Bump tokenVersion so any JWTs issued before this
      // point (e.g. an already-logged-in session on another
      // device) stop being accepted by authMiddleware.
      user.tokenVersion =
        (user.tokenVersion || 0) + 1;


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "Password changed successfully. Please log in again.",

      });

    } catch (error) {

      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// UPDATE NOTIFICATIONS
// PUT /api/settings/notifications
// ============================================================

exports.updateNotifications =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      user.notifications = {

        ...(user.notifications
          ? user.notifications.toObject()
          : {}),

        ...req.body,

      };


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "Notification settings updated",

        notifications:
          user.notifications,

      });

    } catch (error) {

      console.error(
        "UPDATE NOTIFICATIONS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// UPDATE APPEARANCE
// PUT /api/settings/appearance
// ============================================================

exports.updateAppearance =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      user.appearance = {

        ...(user.appearance
          ? user.appearance.toObject()
          : {}),

        ...req.body,

      };


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "Appearance updated",

        appearance:
          user.appearance,

      });

    } catch (error) {

      console.error(
        "UPDATE APPEARANCE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// UPDATE CRM PREFERENCES
// PUT /api/settings/preferences
// ============================================================

exports.updatePreferences =
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      user.preferences = {

        ...(user.preferences
          ? user.preferences.toObject()
          : {}),

        ...req.body,

      };


      await user.save();


      return res.status(200).json({

        success: true,

        message:
          "CRM preferences updated",

        preferences:
          user.preferences,

      });

    } catch (error) {

      console.error(
        "UPDATE PREFERENCES ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ============================================================
// DELETE ACCOUNT
// DELETE /api/settings/account
// ============================================================

exports.deleteAccount =
  async (
    req,
    res
  ) => {

    try {

      const userId = req.user.id;

      const user =
        await User.findById(
          userId
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // ------------------------------------------------------
      // CASCADE DELETE OWNED CRM DATA
      //
      // Deleting only the User document left every Customer,
      // Lead, Deal, and Notification they owned behind, with
      // an `owner`/`user` field pointing at an ID that no
      // longer exists (orphaned records). Remove everything
      // scoped to this user before removing the account
      // itself.
      // ------------------------------------------------------

      await Promise.all([
        Customer.deleteMany({ owner: userId }),
        Lead.deleteMany({ owner: userId }),
        Deal.deleteMany({ owner: userId }),
        Notification.deleteMany({ user: userId }),
      ]);

      await User.findByIdAndDelete(userId);


      return res.status(200).json({

        success: true,

        message:
          "Account deleted successfully",

      });

    } catch (error) {

      console.error(
        "DELETE ACCOUNT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };