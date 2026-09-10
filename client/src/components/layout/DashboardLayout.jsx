import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function DashboardLayout() {
  return (
    <div
      className="
        min-h-screen
        flex
        bg-gray-100
      "
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className="
          fixed
          left-0
          top-0
          h-screen
          w-64
          bg-white
          border-r
          z-40
        "
      >
        <Sidebar />
      </div>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className="
          ml-64
          flex-1
          min-h-screen
          flex
          flex-col
        "
      >

        {/* ===================================================
            NAVBAR
        =================================================== */}

        <div
          className="
            sticky
            top-0
            z-30
            bg-white
          "
        >
          <Navbar />
        </div>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main
          className="
            flex-1
            p-6
          "
        >
          <Outlet />
        </main>


        {/* ===================================================
            GLOBAL FOOTER
        =================================================== */}

        <Footer />

      </div>

    </div>
  );
}

export default DashboardLayout;