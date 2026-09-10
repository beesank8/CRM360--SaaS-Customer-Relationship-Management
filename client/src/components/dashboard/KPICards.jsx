import {
  Users,
  UserPlus,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function KPICards({ stats }) {
  /* =======================================================
     SAFE NUMBER
  ======================================================= */

  const getGrowthValue = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return number;
  };

  /* =======================================================
     FORMAT GROWTH
  ======================================================= */

  const formatGrowth = (value) => {
    const number = getGrowthValue(value);

    const sign = number > 0 ? "+" : "";

    return `${sign}${number}%`;
  };

  /* =======================================================
     FORMAT REVENUE
  ======================================================= */

  const formatRevenue = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "₹0";
    }

    return `₹${number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  /* =======================================================
     KPI CARDS
  ======================================================= */

  const cards = [
    {
      title: "Total Customers",

      value: stats?.customers ?? 0,

      growth: stats?.customerGrowth ?? 0,

      subtitle: "Total registered customers",

      icon: <Users size={22} />,

      bg: "bg-blue-100",

      color: "text-blue-600",
    },

    {
      title: "Total Leads",

      value: stats?.leads ?? 0,

      growth: stats?.leadGrowth ?? 0,

      subtitle: "Total active leads",

      icon: <UserPlus size={22} />,

      bg: "bg-purple-100",

      color: "text-purple-600",
    },

    {
      title: "Revenue",

      value: formatRevenue(stats?.revenue),

      growth: stats?.revenueGrowth ?? 0,

      subtitle: "Converted lead revenue",

      live: true,

      icon: <IndianRupee size={22} />,

      bg: "bg-green-100",

      color: "text-green-600",
    },

    {
      title: "Growth Rate",

      value: formatGrowth(stats?.growth),

      growth: stats?.growth ?? 0,

      subtitle: "Business growth",

      icon: <TrendingUp size={22} />,

      bg: "bg-orange-100",

      color: "text-orange-600",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {cards.map((card, index) => {
        const growthValue = getGrowthValue(card.growth);

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-5"
          >

            {/* =================================================
                TOP ROW
            ================================================= */}

            <div className="flex justify-between items-start">

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}
              >
                {card.icon}
              </div>

              {/* Growth */}
              <div
                className={`flex items-center gap-1 ${
                  growthValue < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >

                {growthValue < 0 ? (
                  <ArrowDownRight size={15} />
                ) : (
                  <ArrowUpRight size={15} />
                )}

                <span className="text-xs font-semibold">
                  {formatGrowth(card.growth)}
                </span>
              </div>

            </div>

            {/* =================================================
                TITLE + LIVE STATUS
            ================================================= */}

            <div className="mt-4 flex items-center gap-2">

              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              {card.live && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-600"
                  title="Revenue updates automatically"
                >

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

                  Live
                </span>
              )}

            </div>

            {/* =================================================
                VALUE
            ================================================= */}

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {card.value}
            </h2>

            {/* =================================================
                SUBTITLE
            ================================================= */}

            <p className="text-xs text-gray-400 mt-2">
              {card.subtitle}
            </p>

          </div>
        );
      })}

    </div>
  );
}

export default KPICards;