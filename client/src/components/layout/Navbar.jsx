import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProfilePicture } from "../../services/settingsService";

// ==========================================
// DAILY MOTIVATION QUOTES
// ==========================================

const dailyQuotes = [
  {
    day: "Sunday",
    quote:
      "Success is the sum of small efforts, repeated day in and day out.",
  },
  {
    day: "Monday",
    quote:
      "The secret of getting ahead is getting started.",
  },
  {
    day: "Tuesday",
    quote:
      "Great things are done by a series of small things brought together.",
  },
  {
    day: "Wednesday",
    quote:
      "Believe you can, and you're halfway there.",
  },
  {
    day: "Thursday",
    quote:
      "Do something today that your future self will thank you for.",
  },
  {
    day: "Friday",
    quote:
      "Success doesn't come from what you do occasionally. It comes from what you do consistently.",
  },
  {
    day: "Saturday",
    quote:
      "Your only limit is the one you set for yourself.",
  },
];

// ==========================================
// NAVBAR
// ==========================================

function Navbar() {
  const navigate = useNavigate();

  const [showMotivation, setShowMotivation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    }
  });
  const [profileImage, setProfileImage] = useState(null);

  const motivationRef = useRef(null);
  const profileRef = useRef(null);

  // ==========================================
  // LOAD PROFILE PICTURE
  // ==========================================

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadProfilePicture = async () => {
      if (!user) {
        setProfileImage(null);
        return;
      }

      try {
        const result = await getProfilePicture();

        if (cancelled || !result) {
          return;
        }

        /*
         * getProfilePicture() normally returns the Blob directly.
         *
         * This also supports an Axios response:
         * result.data
         */

        const imageBlob = result?.data || result;

        if (!(imageBlob instanceof Blob)) {
          console.warn(
            "Profile picture response is not a valid Blob:",
            imageBlob
          );

          if (!cancelled) {
            setProfileImage(null);
          }

          return;
        }

        objectUrl = URL.createObjectURL(imageBlob);

        if (!cancelled) {
          setProfileImage(objectUrl);
        }
      } catch (error) {
        console.error(
          "Failed to load profile picture:",
          error
        );

        if (!cancelled) {
          setProfileImage(null);
        }
      }
    };

    loadProfilePicture();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user]);

  // ==========================================
  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        motivationRef.current &&
        !motivationRef.current.contains(event.target)
      ) {
        setShowMotivation(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
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

  // ==========================================
  // TODAY'S MOTIVATION
  // ==========================================

  const today = new Date();

  const todayMotivation =
    dailyQuotes[today.getDay()] || dailyQuotes[0];

  // ==========================================
  // GET USER NAME
  // ==========================================

  const getUserName = () => {
    if (!user) {
      return "User";
    }

    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();
    }

    if (user.name) {
      return user.name;
    }

    return "User";
  };

  // ==========================================
  // GET USER INITIALS
  // ==========================================

  const getInitials = () => {
    const name = getUserName();

    const words = name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${
        words[words.length - 1][0]
      }`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setProfileImage(null);
    setShowProfile(false);
    setShowMotivation(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // PROFILE
  // ==========================================

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  // ==========================================
  // SETTINGS
  // ==========================================

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-16
        w-full
        border-b
        border-gray-200
        bg-white
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              text-xl
              font-bold
              tracking-tight
              text-gray-900
              transition
              hover:text-blue-600
            "
          >
            CRM<span className="text-blue-600">360</span>
          </button>
        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* ==========================================
              DAILY MOTIVATION
          ========================================== */}

          <div
            ref={motivationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowMotivation((prev) => !prev);
                setShowProfile(false);
              }}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-gray-600
                transition
                duration-200
                hover:bg-gray-100
                hover:text-blue-600
              "
              aria-label="Daily Motivation"
            >
              <Bell
                size={20}
                strokeWidth={2}
              />

              {/* ======================================
                  RED NOTIFICATION DOT
              ====================================== */}

              <span
                className="
                  absolute
                  right-[8px]
                  top-[8px]
                  flex
                  h-2
                  w-2
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-red-500
                    opacity-75
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                    ring-1
                    ring-white
                  "
                />
              </span>
            </button>

            {/* ==========================================
                DAILY MOTIVATION POPUP
            ========================================== */}

            {showMotivation && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-50
                  w-[calc(100vw-2rem)]
                  max-w-sm
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  shadow-[0_18px_45px_rgba(15,23,42,0.18)]
                "
              >
                {/* ======================================
                    POPUP HEADER
                ====================================== */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    px-4
                    py-3
                  "
                >
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    Daily Motivation
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowMotivation(false)
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      text-gray-400
                      transition
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                    aria-label="Close motivation"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* ======================================
                    QUOTE AREA
                ====================================== */}

                <div className="px-4 py-5 sm:px-5">

                  {/* ====================================
                      PREMIUM WAVE QUOTE CARD
                  ==================================== */}

                  <div
                    className="
                      relative
                      isolate
                      h-[270px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#78c1c7]
                      bg-gradient-to-br
                      from-[#8ac8cd]
                      via-[#429da7]
                      to-[#00636f]
                      shadow-[0_10px_28px_rgba(15,23,42,0.16)]
                    "
                  >

                    {/* ==================================
                        TOP LIGHT WAVE
                    ================================== */}

                    <svg
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        h-[135px]
                        w-full
                      "
                      viewBox="0 0 500 180"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="
                          M0 62
                          C50 55 72 78 112 61
                          C155 43 175 12 218 40
                          C258 66 300 70 342 43
                          C390 13 430 30 500 0
                          L500 180
                          L0 180
                          Z
                        "
                        fill="rgba(255,255,255,0.13)"
                      />
                    </svg>

                    {/* ==================================
                        MIDDLE WAVE
                    ================================== */}

                    <svg
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-[55px]
                        h-[155px]
                        w-full
                      "
                      viewBox="0 0 500 180"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="
                          M0 94
                          C48 112 77 123 113 89
                          C152 53 191 48 237 64
                          C282 80 324 66 367 43
                          C419 15 457 30 500 7
                          L500 180
                          L0 180
                          Z
                        "
                        fill="rgba(20,112,123,0.24)"
                      />
                    </svg>

                    {/* ==================================
                        LOWER DARK WAVE
                    ================================== */}

                    <svg
                      className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-0
                        h-[125px]
                        w-full
                      "
                      viewBox="0 0 500 180"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="
                          M0 75
                          C48 48 82 79 127 94
                          C180 112 219 116 266 99
                          C316 81 360 99 403 117
                          C445 135 475 145 500 153
                          L500 180
                          L0 180
                          Z
                        "
                        fill="rgba(0,67,78,0.28)"
                      />
                    </svg>

                    {/* ==================================
                        DECORATIVE DOTS
                    ================================== */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-4
                        z-10
                        grid
                        grid-cols-4
                        gap-1.5
                        opacity-30
                      "
                    >
                      {Array.from({
                        length: 16,
                      }).map((_, index) => (
                        <span
                          key={index}
                          className="
                            h-1
                            w-1
                            rounded-full
                            bg-white
                          "
                        />
                      ))}
                    </div>

                    {/* ==================================
                        TRANSLUCENT QUOTE PLATE
                    ================================== */}

                    <div
                      className="
                        absolute
                        left-5
                        right-5
                        top-[48px]
                        bottom-[48px]
                        z-20
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/45
                        bg-white/20
                        shadow-[0_8px_22px_rgba(0,40,50,0.12)]
                        backdrop-blur-[3px]
                      "
                    >

                      {/* INNER BORDER */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-[1px]
                          rounded-[10px]
                          border
                          border-white/15
                        "
                      />

                      {/* ==================================
                          OPENING QUOTATION MARK
                      ================================== */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-1/2
                          top-[2px]
                          z-30
                          -translate-x-1/2
                          select-none
                          font-serif
                          text-[52px]
                          font-bold
                          leading-none
                          text-white
                          drop-shadow-[0_2px_3px_rgba(0,0,0,0.14)]
                        "
                      >
                        “
                      </div>

                      {/* ==================================
                          QUOTE CONTENT
                      ================================== */}

                      <div
                        className="
                          relative
                          z-20
                          flex
                          h-full
                          flex-col
                          items-center
                          justify-center
                          px-6
                          pb-3
                          pt-10
                          text-center
                        "
                      >

                        {/* ACCENT LINE */}

                        <div
                          className="
                            mb-4
                            h-[3px]
                            w-10
                            rounded-full
                            bg-cyan-300
                            shadow-[0_0_8px_rgba(103,232,249,0.5)]
                          "
                        />

                        {/* QUOTE */}

                        <blockquote
                          className="
                            max-w-[275px]
                            font-serif
                            text-[17px]
                            font-semibold
                            leading-[1.55]
                            tracking-[-0.01em]
                            text-white
                            drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                            sm:text-[18px]
                          "
                        >
                          {todayMotivation.quote}
                        </blockquote>

                        {/* ==================================
                            CLOSING QUOTATION MARK
                        ================================== */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            bottom-[2px]
                            right-4
                            z-10
                            select-none
                            font-serif
                            text-[52px]
                            font-bold
                            leading-none
                            text-white/40
                          "
                        >
                          ”
                        </div>
                      </div>
                    </div>

                    {/* ==================================
                        CARD FOOTER
                    ================================== */}

                    <div
                      className="
                        absolute
                        bottom-3
                        left-7
                        z-40
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          h-px
                          w-7
                          bg-cyan-200
                        "
                      />

                      <span
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.13em]
                          text-white/85
                        "
                      >
                        {todayMotivation.day}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              PROFILE
          ========================================== */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowMotivation(false);
              }}
              className="
                flex
                items-center
                gap-2
                rounded-full
                py-1
                pl-1
                pr-2
                transition
                duration-200
                hover:bg-gray-100
              "
            >

              {/* ======================================
                  PROFILE IMAGE
              ====================================== */}

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${getUserName()} profile`}
                  className="
                    h-9
                    w-9
                    rounded-full
                    object-cover
                    ring-2
                    ring-gray-100
                  "
                  onError={() => {
                    setProfileImage(null);
                  }}
                />
              ) : (
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-xs
                    font-bold
                    text-white
                    ring-2
                    ring-blue-100
                  "
                >
                  {getInitials()}
                </div>
              )}

              {/* ======================================
                  USER INFO
              ====================================== */}

              <div
                className="
                  hidden
                  text-left
                  sm:block
                "
              >
                <p
                  className="
                    max-w-[130px]
                    truncate
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  {getUserName()}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                  "
                >
                  {user?.jobTitle ||
                    "CRM Administrator"}
                </p>
              </div>

              {/* ======================================
                  DROPDOWN ARROW
              ====================================== */}

              <ChevronDown
                size={16}
                className={`
                  hidden
                  text-gray-500
                  transition-transform
                  duration-200
                  sm:block
                  ${
                    showProfile
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* ==========================================
                PROFILE MENU
            ========================================== */}

            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-50
                  w-64
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  shadow-xl
                "
              >

                {/* ======================================
                    PROFILE HEADER
                ====================================== */}

                <div
                  className="
                    border-b
                    border-gray-100
                    px-4
                    py-4
                  "
                >
                  <div className="flex items-center gap-3">

                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={`${getUserName()} profile`}
                        className="
                          h-11
                          w-11
                          rounded-full
                          object-cover
                        "
                        onError={() => {
                          setProfileImage(null);
                        }}
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-600
                          text-sm
                          font-bold
                          text-white
                        "
                      >
                        {getInitials()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {getUserName()}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-gray-500
                        "
                      >
                        {user?.email ||
                          "No email available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ======================================
                    MENU ITEMS
                ====================================== */}

                <div className="p-2">

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={handleProfile}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      hover:text-gray-900
                    "
                  >
                    <User
                      size={17}
                      className="text-gray-500"
                    />

                    <span>Profile</span>
                  </button>

                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={handleSettings}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      hover:text-gray-900
                    "
                  >
                    <Settings
                      size={17}
                      className="text-gray-500"
                    />

                    <span>Settings</span>
                  </button>
                </div>

                {/* ======================================
                    LOGOUT
                ====================================== */}

                <div
                  className="
                    border-t
                    border-gray-100
                    p-2
                  "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    <LogOut size={17} />

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;