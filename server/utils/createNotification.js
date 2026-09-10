const Notification =
  require("../models/Notification");


// ============================================================
// CREATE NOTIFICATION
// ============================================================

const createNotification = async ({
  userId,
  type = "system",
  title,
  message,
  link = "",
  relatedId = null,
}) => {

  console.log("");
  console.log(
    "----------------------------------------------"
  );

  console.log(
    "CREATE NOTIFICATION CALLED"
  );

  console.log(
    "userId:",
    userId
  );

  console.log(
    "type:",
    type
  );

  console.log(
    "title:",
    title
  );

  console.log(
    "message:",
    message
  );

  console.log(
    "link:",
    link
  );

  console.log(
    "relatedId:",
    relatedId
  );


  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  if (!userId) {

    throw new Error(
      "Notification userId is missing"
    );

  }


  if (!title) {

    throw new Error(
      "Notification title is missing"
    );

  }


  if (!message) {

    throw new Error(
      "Notification message is missing"
    );

  }


  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  const notification =
    await Notification.create({

      user:
        userId,

      type:
        type,

      title:
        title,

      message:
        message,

      link:
        link,

      relatedId:
        relatedId,

    });


  console.log(
    "✅ NOTIFICATION SAVED TO MONGODB"
  );

  console.log(
    "Notification ID:",
    notification._id
  );

  console.log(
    "Notification user:",
    notification.user
  );

  console.log(
    "----------------------------------------------"
  );
  console.log("");


  return notification;

};


// ============================================================
// EXPORT
// ============================================================

module.exports =
  createNotification;