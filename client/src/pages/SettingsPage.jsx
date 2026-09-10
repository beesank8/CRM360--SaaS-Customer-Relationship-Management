import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  User,
  Camera,
  Pencil,
  Save,
  X,
  Lock,
  Bell,
  Palette,
  Settings as SettingsIcon,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  CalendarDays,
  Clock,
  IndianRupee,
  Eye,
  EyeOff,
  Target,
  Info,
} from "lucide-react";

import {
  getSettings,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  updateNotifications,
  updateAppearance,
  updatePreferences,
  getProfilePicture,
} from "../services/settingsService";


// ============================================================
// SETTINGS
// ============================================================

function Settings({
  initialSection = "profile",
  profileOnly = false,
}) {

  const fileInputRef = useRef(null);

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    activeSection,
    setActiveSection,
  ] = useState(initialSection);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    editingProfile,
    setEditingProfile,
  ] = useState(false);

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    createdAt: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    leadUpdates: true,
    customerUpdates: true,
    weeklyReports: true,
    marketing: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
  });

  const [preferences, setPreferences] = useState({
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    defaultLeadStatus: "New",
    timezone: "Asia/Kolkata",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [
    profileImage,
    setProfileImage,
  ] = useState(null);


  // ==========================================================
  // SETTINGS SIDEBAR
  // ==========================================================

  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "preferences",
      label: "CRM Preferences",
      icon: SettingsIcon,
    },
    {
      id: "about",
      label: "About CRM360",
      icon: Info,
    },
  ];


  // ==========================================================
  // APPLY THEME
  // ==========================================================

  useEffect(() => {

    const root =
      document.documentElement;

    const theme =
      appearance.theme || "light";


    // --------------------------------------------------------
    // LIGHT
    // --------------------------------------------------------

    if (theme === "light") {

      root.classList.remove("dark");

      return;

    }


    // --------------------------------------------------------
    // DARK
    // --------------------------------------------------------

    if (theme === "dark") {

      root.classList.add("dark");

      return;

    }


    // --------------------------------------------------------
    // SYSTEM
    // --------------------------------------------------------

    if (theme === "system") {

      const mediaQuery =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        );


      root.classList.toggle(
        "dark",
        mediaQuery.matches
      );


      const handleSystemThemeChange =
        (event) => {

          root.classList.toggle(
            "dark",
            event.matches
          );

        };


      mediaQuery.addEventListener(
        "change",
        handleSystemThemeChange
      );


      return () => {

        mediaQuery.removeEventListener(
          "change",
          handleSystemThemeChange
        );

      };

    }

  }, [appearance.theme]);


  // ==========================================================
  // LOAD SETTINGS FUNCTION
  // ==========================================================

  const loadSettings = useCallback(async () => {

    try {

      setLoading(true);


      const response =
        await getSettings();


      const user =
        response?.settings ||
        response?.user ||
        response;


      if (!user) {

        throw new Error(
          "User settings not found"
        );

      }


      // ------------------------------------------------------
      // PROFILE
      // ------------------------------------------------------

      const nameParts =
        (user.name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);


      setProfile({

        firstName:
          nameParts[0] || "",

        lastName:
          nameParts.slice(1).join(" "),

        email:
          user.email || "",

        phone:
          user.phone || "",

        jobTitle:
          user.jobTitle ||
          "CRM Administrator",

        role:
          user.role || "user",

        createdAt:
          user.createdAt || "",

      });


      // ------------------------------------------------------
      // NOTIFICATIONS
      // ------------------------------------------------------

      if (user.notifications) {

        setNotifications({

          emailNotifications:
            user.notifications.emailNotifications ??
            true,

          leadUpdates:
            user.notifications.leadUpdates ??
            true,

          customerUpdates:
            user.notifications.customerUpdates ??
            true,

          weeklyReports:
            user.notifications.weeklyReports ??
            true,

          marketing:
            user.notifications.marketing ??
            false,

        });

      }


      // ------------------------------------------------------
      // APPEARANCE
      // ------------------------------------------------------

      if (user.appearance) {

        const theme =
          user.appearance.theme ||
          localStorage.getItem(
            "crm360-theme"
          ) ||
          "light";


        setAppearance({

          theme,

        });


        localStorage.setItem(
          "crm360-theme",
          theme
        );

      } else {

        const savedTheme =
          localStorage.getItem(
            "crm360-theme"
          ) || "light";


        setAppearance({

          theme:
            savedTheme,

        });

      }


      // ------------------------------------------------------
      // CRM PREFERENCES
      // ------------------------------------------------------

      if (user.preferences) {

        setPreferences({

          currency:
            user.preferences.currency ||
            "INR",

          dateFormat:
            user.preferences.dateFormat ||
            "DD/MM/YYYY",

          defaultLeadStatus:
            user.preferences.defaultLeadStatus ||
            "New",

          timezone:
            user.preferences.timezone ||
            "Asia/Kolkata",

        });

      } else {

        setPreferences({

          currency: "INR",

          dateFormat: "DD/MM/YYYY",

          defaultLeadStatus: "New",

          timezone: "Asia/Kolkata",

        });

      }


      // ------------------------------------------------------
      // PROFILE IMAGE
      // ------------------------------------------------------

      try {

        const imageBlob =
          await getProfilePicture();


        if (imageBlob) {

          const imageUrl =
            URL.createObjectURL(
              imageBlob
            );


          setProfileImage(
            imageUrl
          );

        }

      } catch (imageError) {

        if (
          imageError?.response?.status !==
          404
        ) {

          console.warn(
            "PROFILE IMAGE LOAD ERROR:",
            imageError
          );

        }

      }

    } catch (error) {

      console.error(
        "LOAD SETTINGS ERROR:",
        error
      );


      toast.error(
        error?.response?.data?.message ||
        "Failed to load settings"
      );

    } finally {

      setLoading(false);

    }

  }, []);


  // ==========================================================
  // LOAD SETTINGS
  // ==========================================================

  useEffect(() => {

    loadSettings();

  }, [loadSettings]);





  // ==========================================================
  // PROFILE CHANGE
  // ==========================================================

  const handleProfileChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setProfile((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSaveProfile = async () => {

    try {

      setSaving(true);


      const response =
        await updateProfile({

          firstName:
            profile.firstName,

          lastName:
            profile.lastName,

          email:
            profile.email,

          phone:
            profile.phone,

          jobTitle:
            profile.jobTitle,

        });


      const user =
        response?.user;


      if (user) {

        const nameParts =
          (user.name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);


        setProfile((prev) => ({

          ...prev,

          firstName:
            nameParts[0] || "",

          lastName:
            nameParts.slice(1).join(" "),

          email:
            user.email ||
            prev.email,

          phone:
            user.phone ??
            "",

          jobTitle:
            user.jobTitle ||
            prev.jobTitle,

          role:
            user.role ||
            prev.role,

        }));

      }


      setEditingProfile(false);


      toast.success(
        "Profile updated successfully"
      );

    } catch (error) {

      console.error(
        "SAVE PROFILE ERROR:",
        error
      );


      toast.error(
        error?.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================================
  // PROFILE IMAGE CLICK
  // ==========================================================

  const handleImageClick = () => {

    if (saving) {

      return;

    }


    fileInputRef.current?.click();

  };


  // ==========================================================
  // UPLOAD PROFILE IMAGE
  // ==========================================================

  const handleImageChange = async (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {

      return;

    }


    if (!file.type.startsWith("image/")) {

      toast.error(
        "Please select an image file"
      );

      e.target.value = "";

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Profile picture must be less than 5MB"
      );

      e.target.value = "";

      return;

    }


    let previewUrl = null;


    try {

      setSaving(true);


      previewUrl =
        URL.createObjectURL(file);


      setProfileImage(
        previewUrl
      );


      await uploadProfilePicture(
        file
      );


      toast.success(
        "Profile picture updated"
      );

    } catch (error) {

      console.error(
        "UPLOAD PROFILE IMAGE ERROR:",
        error
      );


      if (previewUrl) {

        URL.revokeObjectURL(
          previewUrl
        );

      }


      setProfileImage(null);


      toast.error(
        error?.response?.data?.message ||
        "Failed to upload profile picture"
      );

    } finally {

      setSaving(false);

      e.target.value = "";

    }

  };


  // ==========================================================
  // DELETE PROFILE IMAGE
  // ==========================================================

  const handleDeleteProfilePicture =
    async () => {

      try {

        setSaving(true);


        await deleteProfilePicture();


        if (profileImage) {

          URL.revokeObjectURL(
            profileImage
          );

        }


        setProfileImage(null);


        toast.success(
          "Profile picture removed"
        );

      } catch (error) {

        console.error(
          "DELETE PROFILE IMAGE ERROR:",
          error
        );


        toast.error(
          error?.response?.data?.message ||
          "Failed to remove profile picture"
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================================
  // PASSWORD CHANGE
  // ==========================================================

  const handlePasswordChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setPasswordData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  const handleChangePassword =
    async () => {

      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword
      ) {

        toast.error(
          "Please fill both password fields"
        );

        return;

      }


      if (
        passwordData.newPassword.length <
        6
      ) {

        toast.error(
          "New password must be at least 6 characters"
        );

        return;

      }


      try {

        setSaving(true);


        await changePassword(
          passwordData
        );


        setPasswordData({

          currentPassword: "",

          newPassword: "",

        });


        toast.success(
          "Password changed successfully"
        );

      } catch (error) {

        console.error(
          "CHANGE PASSWORD ERROR:",
          error
        );


        toast.error(
          error?.response?.data?.message ||
          "Failed to change password"
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const handleNotificationChange =
    async (key) => {

      const newValue =
        !notifications[key];


      const previous = {
        ...notifications,
      };


      const updated = {

        ...notifications,

        [key]: newValue,

      };


      setNotifications(
        updated
      );


      try {

        await updateNotifications({

          [key]: newValue,

        });


        toast.success(
          "Notification preference updated"
        );

      } catch (error) {

        console.error(
          "NOTIFICATION UPDATE ERROR:",
          error
        );


        setNotifications(
          previous
        );


        toast.error(
          error?.response?.data?.message ||
          "Failed to update notification"
        );

      }

    };


  // ==========================================================
  // APPEARANCE
  // ==========================================================

  const handleThemeChange =
    async (theme) => {

      const previous =
        appearance.theme;


      // ------------------------------------------------------
      // UPDATE LOCAL STORAGE FIRST
      // ------------------------------------------------------

      localStorage.setItem(
        "crm360-theme",
        theme
      );


      // ------------------------------------------------------
      // UPDATE UI IMMEDIATELY
      // ------------------------------------------------------

      setAppearance({

        theme,

      });


      try {

        await updateAppearance({

          theme,

        });


        toast.success(
          `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled`
        );

      } catch (error) {

        console.error(
          "APPEARANCE UPDATE ERROR:",
          error
        );


        // ----------------------------------------------------
        // RESTORE PREVIOUS
        // ----------------------------------------------------

        setAppearance({

          theme:
            previous,

        });


        localStorage.setItem(
          "crm360-theme",
          previous
        );


        toast.error(
          error?.response?.data?.message ||
          "Failed to update appearance"
        );

      }

    };


  // ==========================================================
  // CRM PREFERENCES
  // ==========================================================

  const handlePreferenceChange =
    async (e) => {

      const {
        name,
        value,
      } = e.target;


      const previous = {
        ...preferences,
      };


      const updated = {

        ...preferences,

        [name]: value,

      };


      // ------------------------------------------------------
      // UPDATE UI IMMEDIATELY
      // ------------------------------------------------------

      setPreferences(
        updated
      );


      try {

        await updatePreferences({

          [name]: value,

        });


        toast.success(
          "Preference updated"
        );

      } catch (error) {

        console.error(
          "PREFERENCE UPDATE ERROR:",
          error
        );


        setPreferences(
          previous
        );


        toast.error(
          error?.response?.data?.message ||
          "Failed to update preference"
        );

      }

    };


  // ==========================================================
  // HELPERS
  // ==========================================================

  const fullName =
    `${profile.firstName} ${profile.lastName}`
      .trim() ||
    "User";


  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "US";


  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    const d =
      new Date(date);


    if (
      Number.isNaN(
        d.getTime()
      )
    ) {

      return "-";

    }


    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div
        className="
          space-y-6
          pb-8
          text-gray-800
          dark:text-gray-100
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
              dark:text-white
            "
          >

            {profileOnly
              ? "Profile"
              : "Settings"}

          </h1>


          <p
            className="
              text-gray-500
              dark:text-gray-400
              mt-1
            "
          >

            {profileOnly
              ? "Manage your profile information and profile picture"
              : "Manage your account, security and CRM preferences"}

          </p>

        </div>


        <div
          className="
            bg-white
            dark:bg-slate-900
            rounded-2xl
            border
            border-gray-200
            dark:border-slate-700
            p-12
            text-center
            text-gray-500
            dark:text-gray-400
          "
        >

          Loading settings...

        </div>

      </div>

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        space-y-6
        pb-8
        text-gray-800
        dark:text-gray-100
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-gray-800
            dark:text-white
          "
        >

          {profileOnly
            ? "Profile"
            : "Settings"}

        </h1>


        <p
          className="
            text-gray-500
            dark:text-gray-400
            mt-1
          "
        >

          {profileOnly
            ? "Manage your personal and professional information"
            : "Manage your account, security and CRM preferences"}

        </p>

      </div>


      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          border
          border-gray-200
          dark:border-slate-700
          shadow-sm
          overflow-hidden
        "
      >

        {/* ====================================================
            PROFILE SUMMARY
        ==================================================== */}

        <div
          className="
            px-6
            py-5
            border-b
            border-gray-200
            dark:border-slate-700
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                relative
                shrink-0
              "
            >

              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  overflow-hidden
                  bg-blue-100
                  dark:bg-blue-950
                  text-blue-600
                  dark:text-blue-400
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-xl
                "
              >

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  initials

                )}

              </div>


              <button
                type="button"
                onClick={handleImageClick}
                disabled={saving}
                className="
                  absolute
                  -bottom-1
                  -right-1
                  w-7
                  h-7
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  border-2
                  border-white
                  dark:border-slate-900
                  hover:bg-blue-700
                  transition
                  disabled:opacity-50
                "
                title="Change profile picture"
              >

                <Camera size={13} />

              </button>


              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>


            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-gray-800
                  dark:text-white
                "
              >

                {fullName}

              </h2>


              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >

                {profile.jobTitle}

              </p>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-1
                "
              >

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-[11px]
                    font-semibold
                    text-emerald-600
                  "
                >

                  <CheckCircle size={12} />

                  Account Active

                </span>

              </div>

            </div>

          </div>


          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              text-xs
              text-gray-400
              dark:text-gray-500
            "
          >

            <ShieldCheck size={15} />

            Secure CRM Account

          </div>

        </div>


        {/* ====================================================
            BODY
        ==================================================== */}

        <div
          className={`
            grid
            grid-cols-1
            min-h-[600px]
            ${
              profileOnly
                ? ""
                : "lg:grid-cols-[210px_1fr]"
            }
          `}
        >

          {/* ==================================================
              SETTINGS SIDEBAR
          ================================================== */}

          {!profileOnly && (

            <div
              className="
                border-b
                lg:border-b-0
                lg:border-r
                border-gray-200
                dark:border-slate-700
                p-3
                bg-white
                dark:bg-slate-900
              "
            >

              <div
                className="
                  space-y-1
                "
              >

                {sections.map(
                  (section) => {

                    const Icon =
                      section.icon;


                    const active =
                      activeSection ===
                      section.id;


                    return (

                      <button
                        key={section.id}
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            section.id
                          )
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          font-medium
                          transition

                          ${
                            active
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                              : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800"
                          }
                        `}
                      >

                        <Icon size={17} />

                        {section.label}

                      </button>

                    );

                  }
                )}

              </div>


              {/* ACCOUNT INFORMATION */}

              <div
                className="
                  mt-6
                  pt-5
                  border-t
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-gray-400
                    mb-2
                    px-3
                  "
                >

                  Account

                </p>


                <div
                  className="
                    px-3
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    space-y-1
                  "
                >

                  <p>

                    Role:{" "}

                    <span
                      className="
                        font-semibold
                        text-gray-700
                        dark:text-gray-200
                      "
                    >

                      {profile.role}

                    </span>

                  </p>


                  <p>

                    Joined:{" "}

                    <span
                      className="
                        font-semibold
                        text-gray-700
                        dark:text-gray-200
                      "
                    >

                      {formatDate(
                        profile.createdAt
                      )}

                    </span>

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              p-5
              md:p-6
              bg-white
              dark:bg-slate-900
            "
          >

            {/* =================================================
                PROFILE
            ================================================= */}

            {(profileOnly ||
              activeSection === "profile") && (

              <ProfileSection

                profile={profile}

                profileImage={profileImage}

                initials={initials}

                editingProfile={
                  editingProfile
                }

                saving={saving}

                fileInputRef={
                  fileInputRef
                }

                handleImageClick={
                  handleImageClick
                }

                handleImageChange={
                  handleImageChange
                }

                handleDeleteProfilePicture={
                  handleDeleteProfilePicture
                }

                handleProfileChange={
                  handleProfileChange
                }

                handleSaveProfile={
                  handleSaveProfile
                }

                setEditingProfile={
                  setEditingProfile
                }

              />

            )}


            {/* =================================================
                SECURITY
            ================================================= */}

            {!profileOnly &&
              activeSection === "security" && (

              <div
                className="
                  space-y-6
                "
              >

                <SectionHeader
                  icon={Lock}
                  title="Security"
                  description="Protect your CRM360 account and update your password."
                />


                <div
                  className="
                    max-w-xl
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-slate-700
                    p-5
                    bg-white
                    dark:bg-slate-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-5
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-blue-50
                        dark:bg-blue-950
                        text-blue-600
                        dark:text-blue-400
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Lock size={18} />

                    </div>


                    <div>

                      <h3
                        className="
                          text-sm
                          font-bold
                          text-gray-800
                          dark:text-white
                        "
                      >

                        Change Password

                      </h3>


                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                          mt-0.5
                        "
                      >

                        Use a strong password with at least 6 characters.

                      </p>

                    </div>

                  </div>


                  {/* CURRENT PASSWORD */}

                  <div className="mb-4">

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        dark:text-gray-300
                        mb-1.5
                      "
                    >

                      Current Password

                    </label>


                    <div
                      className="
                        relative
                      "
                    >

                      <Lock
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />


                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        name="currentPassword"
                        value={
                          passwordData.currentPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter current password"
                        className="
                          w-full
                          h-11
                          rounded-lg
                          border
                          border-gray-200
                          dark:border-slate-700
                          bg-white
                          dark:bg-slate-800
                          pl-9
                          pr-10
                          text-sm
                          text-gray-800
                          dark:text-white
                          placeholder:text-gray-400
                          outline-none
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-100
                        "
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          hover:text-gray-600
                          dark:hover:text-gray-200
                        "
                      >

                        {showCurrentPassword ? (

                          <EyeOff size={17} />

                        ) : (

                          <Eye size={17} />

                        )}

                      </button>

                    </div>

                  </div>


                  {/* NEW PASSWORD */}

                  <div className="mb-5">

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                        dark:text-gray-300
                        mb-1.5
                      "
                    >

                      New Password

                    </label>


                    <div
                      className="
                        relative
                      "
                    >

                      <Lock
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />


                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        name="newPassword"
                        value={
                          passwordData.newPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter new password"
                        className="
                          w-full
                          h-11
                          rounded-lg
                          border
                          border-gray-200
                          dark:border-slate-700
                          bg-white
                          dark:bg-slate-800
                          pl-9
                          pr-10
                          text-sm
                          text-gray-800
                          dark:text-white
                          placeholder:text-gray-400
                          outline-none
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-100
                        "
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          hover:text-gray-600
                          dark:hover:text-gray-200
                        "
                      >

                        {showNewPassword ? (

                          <EyeOff size={17} />

                        ) : (

                          <Eye size={17} />

                        )}

                      </button>

                    </div>

                  </div>


                  <div
                    className="
                      flex
                      justify-end
                    "
                  >

                    <button
                      type="button"
                      onClick={
                        handleChangePassword
                      }
                      disabled={saving}
                      className="
                        px-4
                        py-2.5
                        rounded-lg
                        bg-blue-600
                        text-white
                        text-sm
                        font-semibold
                        flex
                        items-center
                        gap-2
                        hover:bg-blue-700
                        disabled:opacity-60
                      "
                    >

                      <Lock size={15} />

                      {saving
                        ? "Changing..."
                        : "Change Password"}

                    </button>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            {!profileOnly &&
              activeSection === "notifications" && (

              <NotificationsSection

                notifications={
                  notifications
                }

                handleNotificationChange={
                  handleNotificationChange
                }

              />

            )}


            {/* =================================================
                APPEARANCE
            ================================================= */}

            {!profileOnly &&
              activeSection === "appearance" && (

              <AppearanceSection

                appearance={appearance}

                handleThemeChange={
                  handleThemeChange
                }

              />

            )}


            {/* =================================================
                CRM PREFERENCES
            ================================================= */}

            {!profileOnly &&
              activeSection === "preferences" && (

              <PreferencesSection

                preferences={preferences}

                handlePreferenceChange={
                  handlePreferenceChange
                }

              />

            )}


            {/* =================================================
                ABOUT CRM360
            ================================================= */}

            {!profileOnly &&
              activeSection === "about" && (

              <AboutSection />

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


// ============================================================
// PROFILE SECTION
// ============================================================

function ProfileSection({
  profile,
  profileImage,
  initials,
  editingProfile,
  saving,
  fileInputRef,
  handleImageClick,
  handleImageChange,
  handleDeleteProfilePicture,
  handleProfileChange,
  handleSaveProfile,
  setEditingProfile,
}) {

  return (

    <div
      className="
        space-y-6
      "
    >

      <SectionHeader
        icon={User}
        title="Profile Information"
        description="Update your personal and professional information."
      />


      {/* ======================================================
          PROFILE PICTURE
      ====================================================== */}

      <div
        className="
          rounded-xl
          border
          border-gray-200
          dark:border-slate-700
          p-4
          flex
          flex-col
          sm:flex-row
          items-start
          sm:items-center
          justify-between
          gap-4
          bg-white
          dark:bg-slate-900
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-full
              overflow-hidden
              bg-blue-100
              dark:bg-blue-950
              text-blue-600
              dark:text-blue-400
              flex
              items-center
              justify-center
              font-bold
              text-lg
              shrink-0
            "
          >

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              initials

            )}

          </div>


          <div>

            <p
              className="
                text-sm
                font-semibold
                text-gray-800
                dark:text-white
              "
            >

              Profile Picture

            </p>


            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >

              JPG, PNG or WEBP. Maximum 5MB.

            </p>

          </div>

        </div>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <button
            type="button"
            onClick={handleImageClick}
            disabled={saving}
            className="
              px-3
              py-2
              rounded-lg
              bg-blue-50
              dark:bg-blue-950
              text-blue-600
              dark:text-blue-400
              text-xs
              font-semibold
              hover:bg-blue-100
              dark:hover:bg-blue-900
              transition
              disabled:opacity-50
            "
          >

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >

              <Camera size={14} />

              Change

            </span>

          </button>


          {profileImage && (

            <button
              type="button"
              onClick={
                handleDeleteProfilePicture
              }
              disabled={saving}
              className="
                px-3
                py-2
                rounded-lg
                bg-red-50
                dark:bg-red-950
                text-red-600
                dark:text-red-400
                text-xs
                font-semibold
                hover:bg-red-100
                dark:hover:bg-red-900
                transition
                disabled:opacity-50
              "
            >

              Remove

            </button>

          )}

        </div>


        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          onChange={handleImageChange}
          className="hidden"
        />

      </div>


      {/* ======================================================
          FORM
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

        <InputField
          label="First Name"
          name="firstName"
          value={
            profile.firstName
          }
          onChange={
            handleProfileChange
          }
          icon={User}
          disabled={!editingProfile}
        />


        <InputField
          label="Last Name"
          name="lastName"
          value={
            profile.lastName
          }
          onChange={
            handleProfileChange
          }
          icon={User}
          disabled={!editingProfile}
        />


        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={
            profile.email
          }
          onChange={
            handleProfileChange
          }
          icon={Mail}
          disabled={!editingProfile}
        />


        <InputField
          label="Phone Number"
          name="phone"
          value={
            profile.phone
          }
          onChange={
            handleProfileChange
          }
          icon={Phone}
          disabled={!editingProfile}
        />


        <InputField
          label="Job Title"
          name="jobTitle"
          value={
            profile.jobTitle
          }
          onChange={
            handleProfileChange
          }
          icon={Briefcase}
          disabled={!editingProfile}
        />

      </div>


      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div
        className="
          flex
          justify-end
          gap-2
        "
      >

        {!editingProfile ? (

          <button
            type="button"
            onClick={() =>
              setEditingProfile(true)
            }
            className="
              px-4
              py-2.5
              rounded-lg
              bg-blue-600
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              hover:bg-blue-700
              transition
            "
          >

            <Pencil size={15} />

            Edit Profile

          </button>

        ) : (

          <>

            <button
              type="button"
              onClick={() =>
                setEditingProfile(false)
              }
              disabled={saving}
              className="
                px-4
                py-2.5
                rounded-lg
                bg-gray-100
                dark:bg-slate-800
                text-gray-700
                dark:text-gray-200
                text-sm
                font-semibold
                flex
                items-center
                gap-2
                hover:bg-gray-200
                dark:hover:bg-slate-700
                disabled:opacity-50
              "
            >

              <X size={15} />

              Cancel

            </button>


            <button
              type="button"
              onClick={
                handleSaveProfile
              }
              disabled={saving}
              className="
                px-4
                py-2.5
                rounded-lg
                bg-blue-600
                text-white
                text-sm
                font-semibold
                flex
                items-center
                gap-2
                hover:bg-blue-700
                disabled:opacity-60
              "
            >

              <Save size={15} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </>

        )}

      </div>

    </div>

  );

}


// ============================================================
// NOTIFICATIONS
// ============================================================

function NotificationsSection({
  notifications,
  handleNotificationChange,
}) {

  return (

    <div
      className="
        space-y-6
      "
    >

      <SectionHeader
        icon={Bell}
        title="Notifications"
        description="Choose which CRM updates you want to receive."
      />


      <div
        className="
          max-w-2xl
          divide-y
          divide-gray-100
          dark:divide-slate-700
          border
          border-gray-200
          dark:border-slate-700
          rounded-xl
          overflow-hidden
        "
      >

        <NotificationRow
          title="Email Notifications"
          description="Receive important CRM notifications by email."
          checked={
            notifications.emailNotifications
          }
          onChange={() =>
            handleNotificationChange(
              "emailNotifications"
            )
          }
        />


        <NotificationRow
          title="Lead Updates"
          description="Get notified when lead information changes."
          checked={
            notifications.leadUpdates
          }
          onChange={() =>
            handleNotificationChange(
              "leadUpdates"
            )
          }
        />


        <NotificationRow
          title="Customer Updates"
          description="Get notified about customer activity."
          checked={
            notifications.customerUpdates
          }
          onChange={() =>
            handleNotificationChange(
              "customerUpdates"
            )
          }
        />


        <NotificationRow
          title="Weekly Reports"
          description="Receive weekly CRM performance summaries."
          checked={
            notifications.weeklyReports
          }
          onChange={() =>
            handleNotificationChange(
              "weeklyReports"
            )
          }
        />


        <NotificationRow
          title="Product & Marketing"
          description="Receive product announcements and marketing updates."
          checked={
            notifications.marketing
          }
          onChange={() =>
            handleNotificationChange(
              "marketing"
            )
          }
        />

      </div>

    </div>

  );

}


// ============================================================
// APPEARANCE
// ============================================================

function AppearanceSection({
  appearance,
  handleThemeChange,
}) {

  return (

    <div
      className="
        space-y-6
      "
    >

      <SectionHeader
        icon={Palette}
        title="Appearance"
        description="Customize how CRM360 looks on your device."
      />


      <div>

        <h3
          className="
            text-sm
            font-semibold
            text-gray-800
            dark:text-white
            mb-3
          "
        >

          Theme

        </h3>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-3
            max-w-2xl
          "
        >

          <ThemeOption
            icon={Sun}
            title="Light"
            value="light"
            selected={
              appearance.theme ===
              "light"
            }
            onClick={
              handleThemeChange
            }
          />


          <ThemeOption
            icon={Moon}
            title="Dark"
            value="dark"
            selected={
              appearance.theme ===
              "dark"
            }
            onClick={
              handleThemeChange
            }
          />


          <ThemeOption
            icon={Monitor}
            title="System"
            value="system"
            selected={
              appearance.theme ===
              "system"
            }
            onClick={
              handleThemeChange
            }
          />

        </div>

      </div>

    </div>

  );

}


// ============================================================
// CRM PREFERENCES
// ============================================================

function PreferencesSection({
  preferences,
  handlePreferenceChange,
}) {

  return (

    <div
      className="
        space-y-6
      "
    >

      <SectionHeader
        icon={SettingsIcon}
        title="CRM Preferences"
        description="Configure the default settings used across CRM360."
      />


      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
          max-w-2xl
        "
      >

        {/* ====================================================
            CURRENCY
        ==================================================== */}

        <SelectField
          label="Currency"
          name="currency"
          value={
            preferences.currency
          }
          onChange={
            handlePreferenceChange
          }
          icon={IndianRupee}
          options={[
            {
              value: "INR",
              label: "Indian Rupee (₹)",
            },
            {
              value: "USD",
              label: "US Dollar ($)",
            },
            {
              value: "EUR",
              label: "Euro (€)",
            },
            {
              value: "GBP",
              label: "British Pound (£)",
            },
          ]}
        />


        {/* ====================================================
            DATE FORMAT
        ==================================================== */}

        <SelectField
          label="Date Format"
          name="dateFormat"
          value={
            preferences.dateFormat
          }
          onChange={
            handlePreferenceChange
          }
          icon={CalendarDays}
          options={[
            {
              value: "DD/MM/YYYY",
              label: "DD/MM/YYYY",
            },
            {
              value: "MM/DD/YYYY",
              label: "MM/DD/YYYY",
            },
            {
              value: "YYYY-MM-DD",
              label: "YYYY-MM-DD",
            },
          ]}
        />


        {/* ====================================================
            DEFAULT LEAD STATUS
        ==================================================== */}

        <SelectField
          label="Default Lead Status"
          name="defaultLeadStatus"
          value={
            preferences.defaultLeadStatus ||
            "New"
          }
          onChange={
            handlePreferenceChange
          }
          icon={Target}
          options={[
            {
              value: "New",
              label: "New",
            },
            {
              value: "Contacted",
              label: "Contacted",
            },
            {
              value: "Interested",
              label: "Interested",
            },
            {
              value: "Qualified",
              label: "Qualified",
            },
          ]}
        />


        {/* ====================================================
            TIMEZONE
        ==================================================== */}

        <SelectField
          label="Timezone"
          name="timezone"
          value={
            preferences.timezone
          }
          onChange={
            handlePreferenceChange
          }
          icon={Clock}
          options={[
            {
              value: "Asia/Kolkata",
              label: "Asia/Kolkata",
            },
            {
              value: "UTC",
              label: "UTC",
            },
            {
              value: "Asia/Dubai",
              label: "Asia/Dubai",
            },
            {
              value: "Europe/London",
              label: "Europe/London",
            },
          ]}
        />

      </div>

    </div>

  );

}


// ============================================================
// ABOUT CRM360
// ============================================================

function AboutSection() {

  return (

    <div
      className="
        space-y-6
      "
    >

      <SectionHeader
        icon={Info}
        title="About CRM360"
        description="Learn more about CRM360 and the technology behind the platform."
      />


      {/* ======================================================
          PRODUCT INTRO
      ====================================================== */}

      <div
        className="
          max-w-3xl
          rounded-2xl
          border
          border-gray-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          overflow-hidden
        "
      >

        <div
          className="
            p-6
            bg-gradient-to-r
            from-blue-50
            to-indigo-50
            dark:from-blue-950
            dark:to-indigo-950
            border-b
            border-gray-200
            dark:border-slate-700
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                shrink-0
                shadow-sm
              "
            >

              <SettingsIcon size={23} />

            </div>


            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >

                CRM360

              </h3>


              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-blue-600
                  dark:text-blue-400
                "
              >

                Customer Relationship Management Platform

              </p>

            </div>

          </div>


          <p
            className="
              mt-5
              text-sm
              leading-6
              text-gray-600
              dark:text-gray-300
            "
          >

            CRM360 is a modern Customer Relationship Management
            platform designed to manage customers, leads, sales
            activities and business analytics from one centralized
            workspace.

          </p>

        </div>


        {/* ====================================================
            DEVELOPER
        ==================================================== */}

        <div
          className="
            p-6
            border-b
            border-gray-200
            dark:border-slate-700
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <User
              size={17}
              className="
                text-blue-600
                dark:text-blue-400
              "
            />

            <h3
              className="
                text-sm
                font-bold
                text-gray-800
                dark:text-white
              "
            >

              Development

            </h3>

          </div>


          <div
            className="
              rounded-xl
              bg-gray-50
              dark:bg-slate-800
              p-4
            "
          >

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >

              Designed &amp; Developed by

            </p>


            <p
              className="
                mt-1
                text-lg
                font-bold
                text-gray-800
                dark:text-white
              "
            >

              Sanket

            </p>


            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >

              CRM360 Developer

            </p>

          </div>

        </div>


        {/* ====================================================
            TECHNOLOGY STACK
        ==================================================== */}

        <div
          className="
            p-6
            border-b
            border-gray-200
            dark:border-slate-700
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <Briefcase
              size={17}
              className="
                text-blue-600
                dark:text-blue-400
              "
            />

            <h3
              className="
                text-sm
                font-bold
                text-gray-800
                dark:text-white
              "
            >

              Technology Stack

            </h3>

          </div>


          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-5
              gap-3
            "
          >

            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Tailwind CSS",
            ].map(
              (technology) => (

                <div
                  key={technology}
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-800
                    px-3
                    py-2.5
                    text-center
                  "
                >

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-gray-700
                      dark:text-gray-200
                    "
                  >

                    {technology}

                  </p>

                </div>

              )
            )}

          </div>

        </div>


        {/* ====================================================
            VERSION
        ==================================================== */}

        <div
          className="
            px-6
            py-4
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-2
          "
        >

          <div>

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >

              Version

            </p>


            <p
              className="
                mt-0.5
                text-sm
                font-semibold
                text-gray-800
                dark:text-white
              "
            >

              1.0.0

            </p>

          </div>


          <p
            className="
              text-xs
              text-gray-400
              dark:text-gray-500
            "
          >

            © 2026 Sanket

          </p>

        </div>

      </div>

    </div>

  );

}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-lg
            bg-blue-50
            dark:bg-blue-950
            text-blue-600
            dark:text-blue-400
            flex
            items-center
            justify-center
          "
        >

          <Icon size={16} />

        </div>


        <h2
          className="
            text-lg
            font-bold
            text-gray-800
            dark:text-white
          "
        >

          {title}

        </h2>

      </div>


      <p
        className="
          text-xs
          text-gray-500
          dark:text-gray-400
          mt-2
          ml-10
        "
      >

        {description}

      </p>

    </div>

  );

}


// ============================================================
// INPUT FIELD
// ============================================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  disabled,
}) {

  return (

    <div>

      <label
        className="
          block
          text-xs
          font-semibold
          text-gray-600
          dark:text-gray-300
          mb-1.5
        "
      >

        {label}

      </label>


      <div
        className="
          relative
        "
      >

        {Icon && (

          <Icon
            size={15}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

        )}


        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            h-10
            rounded-lg
            border
            border-gray-200
            dark:border-slate-700
            pl-9
            pr-3
            text-sm
            outline-none
            transition

            ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed dark:bg-slate-800 dark:text-gray-400"
                : "bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
          `}
        />

      </div>

    </div>

  );

}


// ============================================================
// NOTIFICATION ROW
// ============================================================

function NotificationRow({
  title,
  description,
  checked,
  onChange,
}) {

  return (

    <div
      className="
        px-4
        py-3.5
        flex
        items-center
        justify-between
        gap-4
        bg-white
        dark:bg-slate-900
      "
    >

      <div>

        <p
          className="
            text-sm
            font-semibold
            text-gray-800
            dark:text-white
          "
        >

          {title}

        </p>


        <p
          className="
            text-xs
            text-gray-500
            dark:text-gray-400
            mt-0.5
          "
        >

          {description}

        </p>

      </div>


      <button
        type="button"
        onClick={onChange}
        className={`
          relative
          w-10
          h-5
          rounded-full
          transition
          shrink-0

          ${
            checked
              ? "bg-blue-600"
              : "bg-gray-300 dark:bg-slate-600"
          }
        `}
      >

        <span
          className={`
            absolute
            top-0.5
            w-4
            h-4
            rounded-full
            bg-white
            shadow
            transition

            ${
              checked
                ? "left-5"
                : "left-0.5"
            }
          `}
        />

      </button>

    </div>

  );

}


// ============================================================
// THEME OPTION
// ============================================================

function ThemeOption({
  icon: Icon,
  title,
  value,
  selected,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={() =>
        onClick(value)
      }
      className={`
        p-4
        rounded-xl
        border
        text-left
        transition

        ${
          selected
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950 dark:border-blue-400 dark:ring-blue-900"
            : "border-gray-200 bg-white hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        }
      `}
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            w-9
            h-9
            rounded-lg
            bg-gray-100
            dark:bg-slate-700
            flex
            items-center
            justify-center
          "
        >

          <Icon
            size={17}
            className="
              text-gray-600
              dark:text-gray-200
            "
          />

        </div>


        {selected && (

          <CheckCircle
            size={17}
            className="
              text-blue-600
              dark:text-blue-400
            "
          />

        )}

      </div>


      <p
        className="
          text-sm
          font-semibold
          text-gray-800
          dark:text-white
          mt-3
        "
      >

        {title}

      </p>

    </button>

  );

}


// ============================================================
// SELECT FIELD
// ============================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  options,
}) {

  return (

    <div>

      <label
        className="
          block
          text-xs
          font-semibold
          text-gray-600
          dark:text-gray-300
          mb-1.5
        "
      >

        {label}

      </label>


      <div
        className="
          relative
        "
      >

        {Icon && (

          <Icon
            size={15}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              pointer-events-none
              z-10
            "
          />

        )}


        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="
            w-full
            h-10
            rounded-lg
            border
            border-gray-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-800
            pl-9
            pr-9
            text-sm
            text-gray-800
            dark:text-white
            outline-none
            appearance-auto
            cursor-pointer
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            transition
          "
        >

          {options.map(
            (option) => (

              <option
                key={option.value}
                value={option.value}
                className="
                  bg-white
                  dark:bg-slate-800
                  text-gray-800
                  dark:text-white
                "
              >

                {option.label}

              </option>

            )
          )}

        </select>

      </div>

    </div>

  );

}


// ============================================================
// EXPORT
// ============================================================

export default Settings;