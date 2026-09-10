import {
  LayoutDashboard,
  Users,
  Target,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // MAIN MENU
  // ==========================================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: <Target size={20} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <aside
      className="
        w-64
        h-screen
        bg-gray-900
        text-white
        flex
        flex-col
        shadow-xl
      "
    >

      {/* ====================================================
          LOGO
      ==================================================== */}

      <div
        className="
          px-6
          py-6
          border-b
          border-gray-800
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-11
              h-11
              bg-blue-600
              rounded-xl
              flex
              items-center
              justify-center
              text-xl
              font-bold
            "
          >
            C
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
              "
            >
              CRM360
            </h1>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Smart CRM Platform
            </p>
          </div>

        </div>
      </div>

      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      <nav
        className="
          flex-1
          px-4
          py-6
          space-y-2
          overflow-y-auto
        "
      >

        <p
          className="
            text-xs
            text-gray-500
            uppercase
            px-3
            mb-3
          "
        >
          Main Menu
        </p>

        {/* ==================================================
            MAIN MENU
        ================================================== */}

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200

              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            {item.icon}

            <span
              className="
                font-medium
              "
            >
              {item.name}
            </span>
          </NavLink>
        ))}

        {/* ==================================================
            ACCOUNT
        ================================================== */}

        <p
          className="
            text-xs
            text-gray-500
            uppercase
            px-3
            mt-8
            mb-3
          "
        >
          Account
        </p>

        {/* ==================================================
            PROFILE
        ================================================== */}

        <NavLink
          to="/profile"
          className={({ isActive }) => `
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            transition-all
            duration-200

            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          `}
        >
          <UserCircle size={20} />

          <span
            className="
              font-medium
            "
          >
            Profile
          </span>
        </NavLink>

        {/* ==================================================
            SETTINGS
        ================================================== */}

        <NavLink
          to="/settings"
          className={({ isActive }) => `
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            transition-all
            duration-200

            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          `}
        >
          <Settings size={20} />

          <span
            className="
              font-medium
            "
          >
            Settings
          </span>
        </NavLink>

      </nav>

      {/* ====================================================
          LOGOUT + DEVELOPER CREDIT
      ==================================================== */}

      <div
        className="
          p-4
          pt-3
          border-t
          border-gray-800
        "
      >

        <button
          type="button"
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-red-600
            hover:bg-red-700
            py-3
            rounded-xl
            transition
            font-medium
          "
        >
          <LogOut size={20} />

          <span>
            Logout
          </span>
        </button>

        {/* ==================================================
            CREATOR CREDIT
        ================================================== */}

        <div className="pt-4 text-center">

          <p
            className="
              text-sm
              font-semibold
              text-gray-200
            "
          >
            Sanket
          </p>

          <p
            className="
              mt-1
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-gray-500
            "
          >
            Developer
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;