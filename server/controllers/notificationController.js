const mongoose =
  require("mongoose");

const Notification =
  require("../models/Notification");


// ============================================================
// GET NOTIFICATIONS
// GET /api/notifications
// ============================================================

exports.getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          user: req.user.id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .lean();


      const unreadCount =
        await Notification.countDocuments({
          user: req.user.id,
          read: false,
        });


      return res.status(200).json({

        success: true,

        notifications,

        unreadCount,

      });

    } catch (error) {

      console.error(
        "GET NOTIFICATIONS ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch notifications",

      });

    }

  };


// ============================================================
// GET UNREAD COUNT
// GET /api/notifications/unread-count
// ============================================================

exports.getUnreadCount =
  async (req, res) => {

    try {

      const unreadCount =
        await Notification.countDocuments({

          user: req.user.id,

          read: false,

        });


      return res.status(200).json({

        success: true,

        unreadCount,

      });

    } catch (error) {

      console.error(
        "GET UNREAD COUNT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch unread notification count",

      });

    }

  };


// ============================================================
// MARK ONE AS READ
// PATCH /api/notifications/:id/read
// ============================================================

exports.markAsRead =
  async (req, res) => {

    try {

      const { id } =
        req.params;


      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid notification ID",

        });

      }


      const notification =
        await Notification.findOneAndUpdate(

          {
            _id: id,

            user: req.user.id,
          },

          {
            $set: {
              read: true,
            },
          },

          {
            new: true,
          }

        );


      if (!notification) {

        return res.status(404).json({

          success: false,

          message:
            "Notification not found",

        });

      }


      return res.status(200).json({

        success: true,

        notification,

      });

    } catch (error) {

      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to mark notification as read",

      });

    }

  };


// ============================================================
// MARK ALL AS READ
// PATCH /api/notifications/read-all
// ============================================================

exports.markAllAsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {
          user: req.user.id,

          read: false,
        },

        {
          $set: {
            read: true,
          },
        }

      );


      return res.status(200).json({

        success: true,

        message:
          "All notifications marked as read",

      });

    } catch (error) {

      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to mark notifications as read",

      });

    }

  };


// ============================================================
// DELETE NOTIFICATION
// DELETE /api/notifications/:id
// ============================================================

exports.deleteNotification =
  async (req, res) => {

    try {

      const { id } =
        req.params;


      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid notification ID",

        });

      }


      const notification =
        await Notification.findOneAndDelete({

          _id: id,

          user: req.user.id,

        });


      if (!notification) {

        return res.status(404).json({

          success: false,

          message:
            "Notification not found",

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Notification deleted successfully",

      });

    } catch (error) {

      console.error(
        "DELETE NOTIFICATION ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete notification",

      });

    }

  };