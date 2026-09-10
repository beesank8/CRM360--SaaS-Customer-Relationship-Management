import { useCallback, useEffect, useState } from "react";

import RevenueChart from "../components/charts/RevenueChart";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICards from "../components/dashboard/KPICards";
import ActivityCard from "../components/dashboard/ActivityCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentCustomers from "../components/dashboard/RecentCustomers";

import { getDashboardStats } from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState(null);

  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();

      console.log("LIVE DASHBOARD STATS:", data);

      setStats(data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  /* =======================================================
     LIVE DASHBOARD REFRESH
     
     1. Refresh every 5 seconds
     2. Refresh when browser window gets focus
     3. Refresh when tab becomes visible
     4. Refresh when CRM data-updated event is fired
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 5000);

    const handleFocus = () => {
      console.log("Dashboard focused — refreshing stats");
      loadStats();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Dashboard visible — refreshing stats");
        loadStats();
      }
    };

    const handleCrmDataUpdate = () => {
      console.log(
        "CRM data changed — refreshing dashboard immediately"
      );

      loadStats();
    };

    window.addEventListener("focus", handleFocus);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "crm:data-updated",
      handleCrmDataUpdate
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "crm:data-updated",
        handleCrmDataUpdate
      );
    };
  }, [loadStats]);

  /* =======================================================
     DASHBOARD UI
  ======================================================= */

  return (
    <div className="h-full flex flex-col gap-3 overflow-y-auto">

      {/* Dashboard Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <KPICards stats={stats} />

      {/* ===================================================
          REVENUE + ACTIVITY
      =================================================== */}

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-3 min-h-0">

        {/* Revenue */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 min-h-0">

          <div className="mb-2 flex justify-between items-center">

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500">
                Monthly business performance
              </p>
            </div>

            {/* Revenue Growth */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                Number(stats?.revenueGrowth) < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {(() => {
                const growth =
                  Number(stats?.revenueGrowth) || 0;

                const sign = growth > 0 ? "+" : "";

                return `${sign}${growth}%`;
              })()}
            </span>
          </div>

          {/* Revenue Chart */}
          <div className="h-[220px] lg:h-[250px]">
            <RevenueChart stats={stats} />
          </div>
        </div>

        {/* Activity */}
        <div className="min-h-0 overflow-hidden">
          <ActivityCard stats={stats} />
        </div>
      </div>

      {/* ===================================================
          QUICK ACTIONS + RECENT CUSTOMERS
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

        <div className="xl:col-span-2">
          <QuickActions />
        </div>

        <div>
          <RecentCustomers />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;