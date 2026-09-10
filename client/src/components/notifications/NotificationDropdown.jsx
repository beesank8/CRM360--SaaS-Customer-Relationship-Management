import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Trash2,
  UserPlus,
  Users,
  ArrowRightLeft,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";


const typeConfig = {

  lead: {
    icon: UserPlus,
    wrapper:
      "bg-purple-50 text-purple-600",
  },

  customer: {
    icon: Users,
    wrapper:
      "bg-blue-50 text-blue-600",
  },

  conversion: {
    icon: ArrowRightLeft,
    wrapper:
      "bg-green-50 text-green-600",
  },

  followup: {
    icon: Bell,
    wrapper:
      "bg-orange-50 text-orange-600",
  },

  system: {
    icon: Bell,
    wrapper:
      "bg-gray-100 text-gray-600",
  },

};


const formatTime =
  (dateValue) => {

    if (!dateValue) {
      return "";
    }


    const date =
      new Date(dateValue);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }


    const diff =
      Date.now() -
      date.getTime();


    const minutes =
      Math.floor(
        diff / 60000
      );


    const hours =
      Math.floor(
        diff / 3600000
      );


    const days =
      Math.floor(
        diff / 86400000
      );


    if (minutes < 1) {
      return "Just now";
    }


    if (minutes < 60) {
      return `${minutes}m ago`;
    }


    if (hours < 24) {
      return `${hours}h ago`;
    }


    if (days < 7) {
      return `${days}d ago`;
    }


    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(date);

  };


function NotificationDropdown() {

  const navigate =
    useNavigate();


  const dropdownRef =
    useRef(null);


  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    actionId,
    setActionId,
  ] = useState(null);


  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  const loadNotifications = useCallback(
    async (showLoader = false) => {

      try {

        if (showLoader) {
          setLoading(true);
        }


        const data =
          await getNotifications();


        setNotifications(
          data?.notifications || []
        );


        setUnreadCount(
          data?.unreadCount || 0
        );

      } catch (error) {

        if (
          error?.response?.status !==
          401
        ) {

          console.error(
            "Failed to load notifications:",
            error
          );

        }

      } finally {

        if (showLoader) {
          setLoading(false);
        }

      }

    },
    []
  );


  // ==========================================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================================

  useEffect(() => {

    loadNotifications();


    const interval =
      window.setInterval(
        () => {
          loadNotifications();
        },
        15000
      );


    return () =>
      window.clearInterval(
        interval
      );

  }, [loadNotifications]);


  // ==========================================================
  // CLICK OUTSIDE
  // ==========================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setIsOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ==========================================================
  // TOGGLE
  // ==========================================================

  const handleToggle =
    () => {

      const nextState =
        !isOpen;


      setIsOpen(
        nextState
      );


      if (nextState) {

        loadNotifications(
          true
        );

      }

    };


  // ==========================================================
  // OPEN NOTIFICATION
  // ==========================================================

  const handleNotificationClick =
    async (notification) => {

      try {

        setActionId(
          notification._id
        );


        if (
          !notification.read
        ) {

          await markNotificationAsRead(
            notification._id
          );


          setNotifications(
            (current) =>
              current.map(
                (item) =>
                  item._id ===
                  notification._id
                    ? {
                        ...item,
                        read: true,
                      }
                    : item
              )
          );


          setUnreadCount(
            (current) =>
              Math.max(
                0,
                current - 1
              )
          );

        }


        if (
          notification.link
        ) {

          setIsOpen(false);

          navigate(
            notification.link
          );

        }

      } catch (error) {

        console.error(
          "Failed to open notification:",
          error
        );

      } finally {

        setActionId(null);

      }

    };


  // ==========================================================
  // MARK ALL READ
  // ==========================================================

  const handleMarkAllRead =
    async () => {

      if (
        unreadCount === 0
      ) {
        return;
      }


      try {

        setActionId(
          "all"
        );


        await markAllNotificationsAsRead();


        setNotifications(
          (current) =>
            current.map(
              (item) => ({
                ...item,
                read: true,
              })
            )
        );


        setUnreadCount(0);

      } catch (error) {

        console.error(
          "Failed to mark all notifications as read:",
          error
        );

      } finally {

        setActionId(null);

      }

    };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete =
    async (
      event,
      id
    ) => {

      event.stopPropagation();


      try {

        setActionId(id);


        const deleted =
          notifications.find(
            (item) =>
              item._id === id
          );


        await deleteNotification(
          id
        );


        setNotifications(
          (current) =>
            current.filter(
              (item) =>
                item._id !== id
            )
        );


        if (
          deleted &&
          !deleted.read
        ) {

          setUnreadCount(
            (current) =>
              Math.max(
                0,
                current - 1
              )
          );

        }

      } catch (error) {

        console.error(
          "Failed to delete notification:",
          error
        );

      } finally {

        setActionId(null);

      }

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* ====================================================
          BELL
      ==================================================== */}

      <button
        type="button"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="
          relative
          w-10
          h-10
          rounded-xl
          flex
          items-center
          justify-center
          text-gray-500
          hover:bg-gray-100
          hover:text-gray-700
          transition
        "
      >

        <Bell size={19} />


        {unreadCount > 0 && (

          <span
            className="
              absolute
              -top-0.5
              -right-0.5
              min-w-4
              h-4
              px-1
              rounded-full
              bg-red-500
              text-white
              text-[9px]
              font-bold
              flex
              items-center
              justify-center
              border-2
              border-white
            "
          >

            {
              unreadCount > 99
                ? "99+"
                : unreadCount
            }

          </span>

        )}

      </button>


      {/* ====================================================
          DROPDOWN
      ==================================================== */}

      {isOpen && (

        <div
          className="
            absolute
            right-0
            top-full
            mt-2
            w-[380px]
            max-w-[calc(100vw-2rem)]
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-[60]
          "
        >

          {/* HEADER */}

          <div
            className="
              px-4
              py-3
              border-b
              border-gray-200
              flex
              items-center
              justify-between
              bg-gray-50
            "
          >

            <div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-gray-800
                "
              >
                Notifications
              </h3>


              <p
                className="
                  text-[11px]
                  text-gray-500
                  mt-0.5
                "
              >

                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount === 1
                        ? ""
                        : "s"
                    }`
                  : "You're all caught up"}

              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-1
              "
            >

              <button
                type="button"
                title="Refresh"
                onClick={() =>
                  loadNotifications(true)
                }
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:bg-white
                  hover:text-blue-600
                  transition
                "
              >

                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

              </button>


              {unreadCount > 0 && (

                <button
                  type="button"
                  onClick={
                    handleMarkAllRead
                  }
                  disabled={
                    actionId === "all"
                  }
                  className="
                    text-[11px]
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                    disabled:opacity-50
                    px-2
                    py-1
                  "
                >
                  Mark all read
                </button>

              )}

            </div>

          </div>


          {/* NOTIFICATIONS */}

          <div
            className="
              max-h-[430px]
              overflow-y-auto
            "
          >

            {loading &&
            notifications.length === 0 ? (

              <div
                className="
                  py-12
                  text-center
                  text-gray-500
                  text-sm
                "
              >
                Loading notifications...
              </div>

            ) : notifications.length ===
              0 ? (

              <div
                className="
                  py-12
                  px-6
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    w-12
                    h-12
                    rounded-full
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    mb-3
                  "
                >

                  <Bell size={21} />

                </div>


                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  No notifications yet
                </p>


                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                    leading-5
                  "
                >
                  New leads, customers and
                  conversions will appear here.
                </p>

              </div>

            ) : (

              notifications.map(
                (notification) => {

                  const config =
                    typeConfig[
                      notification.type
                    ] ||
                    typeConfig.system;


                  const Icon =
                    config.icon;


                  return (

                    <div
                      key={
                        notification._id
                      }
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      onKeyDown={
                        (event) => {

                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {

                            handleNotificationClick(
                              notification
                            );

                          }

                        }
                      }
                      className={`
                        px-4
                        py-3
                        border-b
                        border-gray-100
                        cursor-pointer
                        transition
                        hover:bg-gray-50
                        ${
                          notification.read
                            ? "bg-white"
                            : "bg-blue-50/40"
                        }
                      `}
                    >

                      <div
                        className="
                          flex
                          gap-3
                        "
                      >

                        <div
                          className={`
                            w-9
                            h-9
                            rounded-xl
                            shrink-0
                            flex
                            items-center
                            justify-center
                            ${config.wrapper}
                          `}
                        >

                          <Icon size={16} />

                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            "
                          >

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-gray-800
                                leading-5
                              "
                            >
                              {notification.title}
                            </p>


                            {!notification.read && (

                              <span
                                className="
                                  w-2
                                  h-2
                                  rounded-full
                                  bg-blue-600
                                  shrink-0
                                  mt-1.5
                                "
                              />

                            )}

                          </div>


                          <p
                            className="
                              text-xs
                              text-gray-500
                              mt-0.5
                              leading-5
                            "
                          >
                            {notification.message}
                          </p>


                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              mt-2
                            "
                          >

                            <span
                              className="
                                text-[10px]
                                text-gray-400
                              "
                            >
                              {
                                formatTime(
                                  notification.createdAt
                                )
                              }
                            </span>


                            <div
                              className="
                                flex
                                items-center
                                gap-1
                              "
                            >

                              {!notification.read && (

                                <button
                                  type="button"
                                  title="Mark as read"
                                  onClick={
                                    (event) => {

                                      event.stopPropagation();

                                      handleNotificationClick(
                                        notification
                                      );

                                    }
                                  }
                                  className="
                                    w-7
                                    h-7
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-green-50
                                    hover:text-green-600
                                    transition
                                  "
                                >

                                  {actionId ===
                                  notification._id ? (

                                    <CheckCheck
                                      size={14}
                                    />

                                  ) : (

                                    <Check
                                      size={14}
                                    />

                                  )}

                                </button>

                              )}


                              <button
                                type="button"
                                title="Delete notification"
                                onClick={
                                  (event) =>
                                    handleDelete(
                                      event,
                                      notification._id
                                    )
                                }
                                className="
                                  w-7
                                  h-7
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                  text-gray-400
                                  hover:bg-red-50
                                  hover:text-red-600
                                  transition
                                "
                              >

                                <Trash2
                                  size={14}
                                />

                              </button>


                              {notification.link && (

                                <span
                                  className="
                                    w-7
                                    h-7
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                  "
                                >

                                  <ExternalLink
                                    size={13}
                                  />

                                </span>

                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>


          {/* FOOTER */}

          {notifications.length > 0 && (

            <div
              className="
                px-4
                py-2.5
                border-t
                border-gray-200
                bg-gray-50
                text-center
              "
            >

              <span
                className="
                  text-[11px]
                  text-gray-500
                "
              >

                Showing your latest{" "}
                {notifications.length}{" "}
                notification
                {notifications.length === 1
                  ? ""
                  : "s"}

              </span>

            </div>

          )}

        </div>

      )}

    </div>

  );

}

export default NotificationDropdown;