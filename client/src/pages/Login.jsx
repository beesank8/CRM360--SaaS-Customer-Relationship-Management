import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  registerUser,
} from "../services/authService";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  User,
  UserPlus,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  // ============================================================
  // MODE
  // ============================================================

  const [isRegistering, setIsRegistering] =
    useState(false);

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // SWITCH LOGIN / REGISTER
  // ============================================================

  const switchMode = () => {
    setIsRegistering(
      (prev) => !prev
    );

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setError("");
    setSuccess("");

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!formData.email.trim()) {
        setError(
          "Please enter your email address."
        );
        return;
      }

      if (!formData.password) {
        setError(
          "Please enter your password."
        );
        return;
      }

      const response =
        await loginUser(
          formData.email.trim(),
          formData.password
        );

      
      if (!response?.token) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      // --------------------------------------------------------
      // SAVE TOKEN
      // --------------------------------------------------------

      localStorage.setItem(
        "token",
        response.token
      );

      // --------------------------------------------------------
      // SAVE USER
      // --------------------------------------------------------

      if (response.user) {
        const user = {
          _id:
            response.user._id,

          name:
            response.user.name || "",

          email:
            response.user.email || "",

          phone:
            response.user.phone || "",

          jobTitle:
            response.user.jobTitle ||
            "CRM Administrator",

          role:
            response.user.role ||
            "user",

          createdAt:
            response.user.createdAt || "",
        };

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // --------------------------------------------------------
      // DASHBOARD
      // --------------------------------------------------------

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // --------------------------------------------------------
      // NAME
      // --------------------------------------------------------

      if (!formData.name.trim()) {
        setError(
          "Please enter your full name."
        );
        return;
      }

      // --------------------------------------------------------
      // EMAIL
      // --------------------------------------------------------

      if (!formData.email.trim()) {
        setError(
          "Please enter your email address."
        );
        return;
      }

      // --------------------------------------------------------
      // PASSWORD
      // --------------------------------------------------------

      if (
        formData.password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      // --------------------------------------------------------
      // CONFIRM PASSWORD
      // --------------------------------------------------------

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      // --------------------------------------------------------
      // REGISTER API
      // --------------------------------------------------------

      const response =
        await registerUser(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );

      
      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      setSuccess(
        response?.message ||
        "Registration successful. Please login."
      );

      // --------------------------------------------------------
      // CLEAR PASSWORDS
      // --------------------------------------------------------

      setFormData({
        name: "",
        email: formData.email.trim(),
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      // --------------------------------------------------------
      // SWITCH TO LOGIN
      // --------------------------------------------------------

      setTimeout(() => {
        setIsRegistering(false);

        setSuccess(
          "Registration successful. Please login."
        );
      }, 1200);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (isRegistering) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-gradient-to-br
        from-blue-50
        via-white
        to-indigo-50
        relative
        px-8
      "
    >

      {/* ======================================================
          CRM360 LOGO
      ====================================================== */}

      <div
        className="
          absolute
          top-5
          left-1/2
          -translate-x-1/2
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            w-12
            h-12
            bg-blue-600
            rounded-xl
            text-white
            flex
            items-center
            justify-center
            text-2xl
            font-bold
            shadow-lg
          "
        >
          C
        </div>

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-blue-600
              tracking-tight
            "
          >
            CRM360
          </h1>

          <p
            className="
              text-xs
              text-gray-500
              text-center
            "
          >
            Smart CRM Solutions
          </p>

        </div>

      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          max-w-6xl
          h-full
          mx-auto
          grid
          lg:grid-cols-2
          gap-12
          items-center
          pt-12
        "
      >

        {/* ====================================================
            LEFT BRANDING
        ==================================================== */}

        <div className="hidden lg:block">

          <div
            className="
              inline-flex
              items-center
              gap-2
              bg-blue-100
              text-blue-700
              px-3
              py-1.5
              rounded-full
              text-sm
              mb-4
            "
          >
            <CheckCircle size={16} />

            Trusted CRM Platform
          </div>

          <h2
            className="
              text-5xl
              font-bold
              text-gray-900
              leading-tight
            "
          >
            Smart CRM.

            <br />

            Smarter Business Growth.
          </h2>

          <p
            className="
              mt-4
              text-gray-600
              max-w-lg
              leading-relaxed
            "
          >
            CRM360 is a powerful

            <span className="block mt-2">

              <strong className="text-gray-800">
                Customer Relationship Management
              </strong>

            </span>

            platform designed to help businesses
            manage customers, track leads, analyze
            performance, and build stronger
            relationships through one smart and
            secure dashboard.
          </p>

          <div className="mt-6 space-y-4">

            {/* CUSTOMER MANAGEMENT */}

            <div className="flex items-center gap-4">

              <div
                className="
                  bg-blue-600
                  text-white
                  p-3
                  rounded-xl
                "
              >
                <Users size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Customer Management
                </h3>

                <p className="text-sm text-gray-500">
                  Organize customer information easily
                </p>

              </div>

            </div>

            {/* ANALYTICS */}

            <div className="flex items-center gap-4">

              <div
                className="
                  bg-indigo-600
                  text-white
                  p-3
                  rounded-xl
                "
              >
                <BarChart3 size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Business Analytics
                </h3>

                <p className="text-sm text-gray-500">
                  Monitor growth and performance
                </p>

              </div>

            </div>

            {/* SECURITY */}

            <div className="flex items-center gap-4">

              <div
                className="
                  bg-green-600
                  text-white
                  p-3
                  rounded-xl
                "
              >
                <ShieldCheck size={20} />
              </div>

              <div>

                <h3 className="font-semibold text-gray-800">
                  Secure Workspace
                </h3>

                <p className="text-sm text-gray-500">
                  Protected business environment
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            LOGIN / REGISTER CARD
        ==================================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-100
            p-8
            max-w-md
            w-full
            mx-auto
          "
        >

          {/* ==================================================
              CARD HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-2
            "
          >

            <div
              className="
                w-11
                h-11
                bg-blue-100
                text-blue-600
                rounded-xl
                flex
                items-center
                justify-center
              "
            >

              {isRegistering ? (
                <UserPlus size={22} />
              ) : (
                <User size={22} />
              )}

            </div>

            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                "
              >
                {isRegistering
                  ? "Create Account"
                  : "Login to CRM360"}
              </h2>

            </div>

          </div>

          <p
            className="
              text-gray-500
              mt-2
              mb-6
            "
          >
            {isRegistering
              ? "Create your CRM360 account and start managing your business."
              : "Access your CRM360 workspace and manage your business smarter."}
          </p>

          {/* ==================================================
              ERROR MESSAGE
          ================================================== */}

          {error && (

            <div
              className="
                bg-red-50
                border
                border-red-200
                text-red-600
                rounded-xl
                p-3
                text-sm
                mb-4
              "
            >
              {error}
            </div>

          )}

          {/* ==================================================
              SUCCESS MESSAGE
          ================================================== */}

          {success && (

            <div
              className="
                bg-green-50
                border
                border-green-200
                text-green-700
                rounded-xl
                p-3
                text-sm
                mb-4
              "
            >
              {success}
            </div>

          )}

          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ==================================================
                FULL NAME
            ================================================== */}

            {isRegistering && (

              <div>

                <label
                  className="
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Full Name
                </label>

                <div
                  className="
                    relative
                    mt-2
                  "
                >

                  <User
                    size={19}
                    className="
                      absolute
                      left-3
                      top-3.5
                      text-gray-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="
                      w-full
                      border
                      rounded-xl
                      py-3
                      pl-11
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                    required
                  />

                </div>

              </div>

            )}

            {/* ==================================================
                EMAIL
            ==================================================== */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Email Address
              </label>

              <div
                className="
                  relative
                  mt-2
                "
              >

                <Mail
                  size={19}
                  className="
                    absolute
                    left-3
                    top-3.5
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="
                    w-full
                    border
                    rounded-xl
                    py-3
                    pl-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  required
                />

              </div>

            </div>

            {/* ==================================================
                PASSWORD
            ==================================================== */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Password
              </label>

              <div
                className="
                  relative
                  mt-2
                "
              >

                <Lock
                  size={19}
                  className="
                    absolute
                    left-3
                    top-3.5
                    text-gray-400
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegistering
                      ? "new-password"
                      : "current-password"
                  }
                  className="
                    w-full
                    border
                    rounded-xl
                    py-3
                    pl-11
                    pr-11
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  required
                />

                {/* ==================================================
                    PASSWORD EYE
                    EYE = VISIBLE
                    EYE-OFF = HIDDEN
                ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-3.5
                    text-gray-400
                    hover:text-gray-600
                    transition
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}

                </button>

              </div>

            </div>

            {/* ==================================================
                CONFIRM PASSWORD
            ==================================================== */}

            {isRegistering && (

              <div>

                <label
                  className="
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Confirm Password
                </label>

                <div
                  className="
                    relative
                    mt-2
                  "
                >

                  <Lock
                    size={19}
                    className="
                      absolute
                      left-3
                      top-3.5
                      text-gray-400
                    "
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="
                      w-full
                      border
                      rounded-xl
                      py-3
                      pl-11
                      pr-11
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                    required
                  />

                  {/* ==================================================
                      CONFIRM PASSWORD EYE
                      EYE = VISIBLE
                      EYE-OFF = HIDDEN
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-3.5
                      text-gray-400
                      hover:text-gray-600
                      transition
                    "
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >

                    {showConfirmPassword ? (
                      <Eye size={19} />
                    ) : (
                      <EyeOff size={19} />
                    )}

                  </button>

                </div>

              </div>

            )}

            {/* ==================================================
                SUBMIT BUTTON
            ==================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-blue-300
                text-white
                py-3
                rounded-xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                transition
              "
            >

              {loading ? (

                isRegistering
                  ? "Creating account..."
                  : "Signing in..."

              ) : (

                <>
                  {isRegistering
                    ? "Create Account"
                    : "Login"}

                  <ArrowRight size={18} />

                </>

              )}

            </button>

          </form>

          {/* ==================================================
              SWITCH LOGIN / REGISTER
          ==================================================== */}

          <div
            className="
              text-center
              mt-6
              pt-5
              border-t
              border-gray-100
            "
          >

            <p
              className="
                text-sm
                text-gray-500
              "
            >

              {isRegistering
                ? "Already have an account?"
                : "New user?"}

              <button
                type="button"
                onClick={switchMode}
                className="
                  ml-1
                  text-blue-600
                  font-semibold
                  hover:text-blue-700
                  hover:underline
                "
              >

                {isRegistering
                  ? "Login here"
                  : "Register here"}

              </button>

            </p>

          </div>

          {/* ==================================================
              SECURITY
          ==================================================== */}

          <div
            className="
              mt-6
              flex
              justify-center
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >

            <ShieldCheck size={14} />

            Secure Authentication

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <p
            className="
              text-center
              text-xs
              text-gray-400
              mt-4
            "
          >

            <span className="font-medium text-gray-500">
              CRM360
            </span>

            <span className="mx-1">
              •
            </span>

            Designed &amp; Developed by{" "}

            <span
              className="
                font-semibold
                text-gray-600
              "
            >
              Sanket
            </span>

            <span className="mx-1">
              •
            </span>

            © 2026

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;