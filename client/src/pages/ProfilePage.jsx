import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  User,
  Camera,
  Pencil,
  Save,
  X,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import {
  getSettings,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
} from "../services/settingsService";


// ============================================================
// PROFILE PAGE
// ============================================================

function Profile() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    createdAt: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const profileImageRef = useRef(null);

  useEffect(() => {
    profileImageRef.current = profileImage;
  }, [profileImage]);


  // ==========================================================
  // LOAD PROFILE DATA
  // ==========================================================

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getSettings();

      const user =
        response?.settings ||
        response?.user ||
        response;

      if (!user) {
        throw new Error("Profile information not found");
      }


      // ------------------------------------------------------
      // NAME
      // ------------------------------------------------------

      const nameParts =
        (user.name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);


      setProfile({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" "),
        email: user.email || "",
        phone: user.phone || "",
        jobTitle: user.jobTitle || "CRM Administrator",
        role: user.role || "user",
        createdAt: user.createdAt || "",
      });


      // ------------------------------------------------------
      // PROFILE IMAGE
      // ------------------------------------------------------

      try {
        const imageBlob = await getProfilePicture();

        if (imageBlob) {
          const imageUrl =
            URL.createObjectURL(imageBlob);

          setProfileImage(imageUrl);
        }
      } catch (imageError) {
        if (imageError?.response?.status !== 404) {
          console.warn(
            "PROFILE IMAGE LOAD ERROR:",
            imageError
          );
        }
      }

    } catch (error) {
      console.error(
        "LOAD PROFILE ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {
    loadProfile();

    return () => {
      if (profileImageRef.current) {
        URL.revokeObjectURL(profileImageRef.current);
      }
    };
  }, [loadProfile]);


  // ==========================================================
  // PROFILE INPUT CHANGE
  // ==========================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

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
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          jobTitle: profile.jobTitle,
        });


      const user = response?.user;

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
            user.email || prev.email,

          phone:
            user.phone || "",

          jobTitle:
            user.jobTitle ||
            prev.jobTitle,

          role:
            user.role ||
            prev.role,
        }));
      }


      // Update localStorage user if available
      try {
        const storedUser =
          JSON.parse(
            localStorage.getItem("user") || "{}"
          );

        const updatedStoredUser = {
          ...storedUser,
          ...(user || {}),
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedStoredUser)
        );

      } catch (storageError) {
        console.warn(
          "LOCAL USER UPDATE ERROR:",
          storageError
        );
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
  // IMAGE CLICK
  // ==========================================================

  const handleImageClick = () => {
    if (saving) {
      return;
    }

    fileInputRef.current?.click();
  };


  // ==========================================================
  // IMAGE UPLOAD
  // ==========================================================

  const handleImageChange = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    // --------------------------------------------------------
    // FILE TYPE
    // --------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );

      e.target.value = "";

      return;
    }


    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Profile picture must be less than 5MB"
      );

      e.target.value = "";

      return;
    }


    let previewUrl = null;

    try {
      setSaving(true);


      // ------------------------------------------------------
      // PREVIEW
      // ------------------------------------------------------

      previewUrl =
        URL.createObjectURL(file);

      setProfileImage(previewUrl);


      // ------------------------------------------------------
      // UPLOAD
      // ------------------------------------------------------

      await uploadProfilePicture(file);


      toast.success(
        "Profile picture updated"
      );

    } catch (error) {
      console.error(
        "UPLOAD PROFILE IMAGE ERROR:",
        error
      );


      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
          URL.revokeObjectURL(profileImage);
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
  // HELPERS
  // ==========================================================

  const fullName =
    `${profile.firstName} ${profile.lastName}`
      .trim() || "User";


  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";


  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
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
      <div className="space-y-6">

        <div>
          <h1 className="
            text-3xl
            font-bold
            text-gray-800
          ">
            Profile
          </h1>

          <p className="
            text-gray-500
            mt-1
          ">
            Manage your personal and professional information
          </p>
        </div>


        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          p-12
          text-center
          text-gray-500
        ">
          Loading profile...
        </div>

      </div>
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="
      space-y-6
      pb-8
    ">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="
          text-3xl
          font-bold
          text-gray-800
        ">
          Profile
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Manage your personal and professional information
        </p>
      </div>


      {/* ======================================================
          PROFILE CARD
      ====================================================== */}

      <div className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      ">


        {/* ====================================================
            PROFILE HEADER
        ==================================================== */}

        <div className="
          px-6
          py-6
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          gap-4
        ">

          <div className="
            flex
            items-center
            gap-4
          ">


            {/* PROFILE IMAGE */}

            <div className="
              relative
              shrink-0
            ">

              <div className="
                w-20
                h-20
                rounded-full
                overflow-hidden
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                font-bold
                text-2xl
                border-4
                border-white
                shadow
              ">

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


              {/* CAMERA BUTTON */}

              <button
                type="button"
                onClick={handleImageClick}
                disabled={saving}
                title="Change profile picture"
                className="
                  absolute
                  -bottom-1
                  -right-1
                  w-8
                  h-8
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  border-2
                  border-white
                  hover:bg-blue-700
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Camera size={15} />
              </button>


              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>


            {/* NAME */}

            <div>

              <h2 className="
                text-xl
                font-bold
                text-gray-800
              ">
                {fullName}
              </h2>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                {profile.jobTitle}
              </p>


              <div className="
                flex
                items-center
                gap-2
                mt-2
              ">

                <span className="
                  inline-flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-emerald-600
                ">
                  <CheckCircle size={13} />
                  Account Active
                </span>

              </div>

            </div>

          </div>


          <div className="
            hidden
            md:flex
            items-center
            gap-2
            text-xs
            text-gray-400
          ">
            <ShieldCheck size={16} />
            Secure CRM Account
          </div>

        </div>


        {/* ====================================================
            PROFILE BODY
        ==================================================== */}

        <div className="
          p-6
        ">


          {/* ==================================================
              PROFILE PICTURE
          ================================================== */}

          <div className="
            rounded-xl
            border
            border-gray-200
            p-5
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-4
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                w-14
                h-14
                rounded-full
                overflow-hidden
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                font-bold
                text-lg
                shrink-0
              ">

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

                <p className="
                  text-sm
                  font-semibold
                  text-gray-800
                ">
                  Profile Picture
                </p>

                <p className="
                  text-xs
                  text-gray-500
                  mt-1
                ">
                  JPG, PNG or WEBP. Maximum 5MB.
                </p>

              </div>

            </div>


            <div className="
              flex
              items-center
              gap-2
            ">

              <button
                type="button"
                onClick={handleImageClick}
                disabled={saving}
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                  text-xs
                  font-semibold
                  hover:bg-blue-100
                  transition
                  disabled:opacity-50
                "
              >
                <span className="
                  flex
                  items-center
                  gap-1.5
                ">
                  <Camera size={14} />
                  Change
                </span>
              </button>


              {profileImage && (
                <button
                  type="button"
                  onClick={handleDeleteProfilePicture}
                  disabled={saving}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-red-50
                    text-red-600
                    text-xs
                    font-semibold
                    hover:bg-red-100
                    transition
                    disabled:opacity-50
                  "
                >
                  Remove
                </button>
              )}

            </div>

          </div>


          {/* ==================================================
              PROFILE INFORMATION
          ================================================== */}

          <div className="
            mt-6
          ">

            <div className="
              flex
              items-center
              gap-2
              mb-5
            ">

              <div className="
                w-8
                h-8
                rounded-lg
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              ">
                <User size={16} />
              </div>

              <div>
                <h2 className="
                  text-lg
                  font-bold
                  text-gray-800
                ">
                  Profile Information
                </h2>

                <p className="
                  text-xs
                  text-gray-500
                ">
                  Your personal and professional information
                </p>
              </div>

            </div>


            {/* FORM */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              <InputField
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                icon={User}
                disabled={!editingProfile}
              />


              <InputField
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                icon={User}
                disabled={!editingProfile}
              />


              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                icon={Mail}
                disabled={!editingProfile}
              />


              <InputField
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                icon={Phone}
                disabled={!editingProfile}
              />


              <InputField
                label="Job Title"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleProfileChange}
                icon={Briefcase}
                disabled={!editingProfile}
              />


              <InputField
                label="Role"
                name="role"
                value={profile.role}
                icon={ShieldCheck}
                disabled={true}
              />

            </div>

          </div>


          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <div className="
            mt-6
            rounded-xl
            bg-gray-50
            border
            border-gray-200
            p-5
          ">

            <h3 className="
              text-sm
              font-bold
              text-gray-800
              mb-3
            ">
              Account Information
            </h3>


            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            ">

              <div>
                <p className="
                  text-xs
                  text-gray-500
                ">
                  Account Status
                </p>

                <p className="
                  text-sm
                  font-semibold
                  text-emerald-600
                  mt-1
                ">
                  Active
                </p>
              </div>


              <div>
                <p className="
                  text-xs
                  text-gray-500
                ">
                  Joined
                </p>

                <p className="
                  text-sm
                  font-semibold
                  text-gray-700
                  mt-1
                ">
                  {formatDate(profile.createdAt)}
                </p>
              </div>

            </div>

          </div>


          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="
            flex
            justify-end
            gap-2
            mt-6
          ">

            {!editingProfile ? (

              <button
                type="button"
                onClick={() =>
                  setEditingProfile(true)
                }
                className="
                  px-5
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
                  onClick={() => {
                    setEditingProfile(false);
                    loadProfile();
                  }}
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-lg
                    bg-gray-100
                    text-gray-700
                    text-sm
                    font-semibold
                    flex
                    items-center
                    gap-2
                    hover:bg-gray-200
                    transition
                    disabled:opacity-50
                  "
                >
                  <X size={15} />
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="
                    px-5
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

      </div>

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

      <label className="
        block
        text-xs
        font-semibold
        text-gray-600
        mb-1.5
      ">
        {label}
      </label>


      <div className="relative">

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
            h-11
            rounded-lg
            border
            border-gray-200
            pl-9
            pr-3
            text-sm
            text-gray-800
            outline-none
            transition

            ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
          `}
        />

      </div>

    </div>
  );
}


export default Profile;