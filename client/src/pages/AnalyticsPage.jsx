import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  IndianRupee,
  UserCheck,
  BarChart3,
  PieChart as PieChartIcon,
  CalendarDays,
  Sparkles,
  Activity,
  Zap,
  Globe,
  Megaphone,
  CheckCircle2
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";


// ======================================================
// DATA
// ======================================================

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 68000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 79000 },
  { month: "Aug", revenue: 85000 }
];


const leadSourceData = [
  {
    name: "Website",
    value: 35
  },
  {
    name: "Social Media",
    value: 25
  },
  {
    name: "Referral",
    value: 20
  },
  {
    name: "Advertisement",
    value: 12
  },
  {
    name: "Other",
    value: 8
  }
];


const leadFunnelData = [
  {
    name: "New",
    value: 642,
    color: "#2563EB"
  },
  {
    name: "Contacted",
    value: 482,
    color: "#3B82F6"
  },
  {
    name: "Qualified",
    value: 296,
    color: "#6366F1"
  },
  {
    name: "Converted",
    value: 119,
    color: "#10B981"
  }
];


const campaignData = [
  {
    campaign: "Google Ads",
    leads: 124,
    conversions: 28
  },
  {
    campaign: "Social",
    leads: 108,
    conversions: 31
  },
  {
    campaign: "Email",
    leads: 87,
    conversions: 19
  },
  {
    campaign: "Referral",
    leads: 72,
    conversions: 16
  }
];


const customerGrowthData = [
  {
    month: "Jan",
    customers: 62
  },
  {
    month: "Feb",
    customers: 78
  },
  {
    month: "Mar",
    customers: 91
  },
  {
    month: "Apr",
    customers: 108
  },
  {
    month: "May",
    customers: 117
  },
  {
    month: "Jun",
    customers: 126
  },
  {
    month: "Jul",
    customers: 136
  },
  {
    month: "Aug",
    customers: 148
  }
];


// ======================================================
// COLORS
// ======================================================

const PIE_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#06B6D4",
  "#F59E0B",
  "#94A3B8"
];


// ======================================================
// HELPERS
// ======================================================

function formatCurrency(value) {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

}


// ======================================================
// TOOLTIP
// ======================================================

function ChartTooltip({ active, payload, label }) {

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-xl
        shadow-xl
        px-3
        py-2
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          text-slate-400
          mb-1
        "
      >
        {label}
      </p>

      {payload.map((item, index) => (

        <div
          key={index}
          className="
            flex
            items-center
            justify-between
            gap-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
              "
              style={{
                backgroundColor: item.color
              }}
            />

            <span
              className="
                text-[11px]
                text-slate-600
              "
            >
              {item.name}
            </span>

          </div>


          <span
            className="
              text-[11px]
              font-bold
              text-slate-900
            "
          >
            {typeof item.value === "number" &&
            item.name === "Revenue"
              ? formatCurrency(item.value)
              : item.value}
          </span>

        </div>

      ))}

    </div>
  );

}


// ======================================================
// KPI CARD
// ======================================================

function KPICard({
  title,
  value,
  growth,
  icon,
  iconBg,
  positive = true,
  subtitle
}) {

  return (

    <div
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all
        duration-200
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-wider
              font-semibold
              text-slate-400
            "
          >
            {title}
          </p>


          <h2
            className="
              text-xl
              font-bold
              text-slate-900
              mt-1
            "
          >
            {value}
          </h2>

        </div>


        <div
          className={`
            w-9
            h-9
            rounded-xl
            flex
            items-center
            justify-center
            ${iconBg}
          `}
        >
          {icon}
        </div>

      </div>


      <div
        className="
          flex
          items-center
          gap-1.5
          mt-2
        "
      >

        {positive ? (

          <TrendingUp
            size={12}
            className="text-emerald-500"
          />

        ) : (

          <TrendingDown
            size={12}
            className="text-red-500"
          />

        )}


        <span
          className={`
            text-[10px]
            font-bold
            ${
              positive
                ? "text-emerald-600"
                : "text-red-600"
            }
          `}
        >
          {growth}
        </span>


        <span
          className="
            text-[9px]
            text-slate-400
          "
        >
          {subtitle}
        </span>

      </div>

    </div>

  );

}


// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({
  icon,
  title,
  subtitle,
  badge
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        mb-3
      "
    >

      <div
        className="
          flex
          items-center
          gap-2.5
        "
      >

        <div
          className="
            w-8
            h-8
            rounded-xl
            bg-blue-50
            text-blue-600
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>


        <div>

          <h3
            className="
              text-sm
              font-bold
              text-slate-800
            "
          >
            {title}
          </h3>


          <p
            className="
              text-[9px]
              text-slate-400
              mt-0.5
            "
          >
            {subtitle}
          </p>

        </div>

      </div>


      {badge && (

        <span
          className="
            px-2.5
            py-1
            rounded-full
            bg-slate-100
            text-[9px]
            font-semibold
            text-slate-500
          "
        >
          {badge}
        </span>

      )}

    </div>

  );

}


// ======================================================
// ANALYTICS
// ======================================================

function Analytics() {

  return (

    <div
      className="
        h-[calc(100vh-64px)]
        overflow-y-auto
        bg-slate-50
        px-5
        py-3
      "
    >

      <div
        className="
          max-w-[1800px]
          mx-auto
          space-y-3
          pb-8
        "
      >


        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            justify-between
            gap-3
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
                relative
                w-11
                h-11
                rounded-2xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                shadow-blue-500/20
              "
            >

              <BarChart3 size={21} />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  w-3
                  h-3
                  rounded-full
                  bg-emerald-400
                  border-2
                  border-slate-50
                "
              />

            </div>


            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                  "
                >
                  Analytics
                </h1>


                <span
                  className="
                    px-2
                    py-0.5
                    rounded-full
                    bg-blue-50
                    text-blue-600
                    text-[8px]
                    font-bold
                    uppercase
                  "
                >
                  Live
                </span>

              </div>


              <p
                className="
                  text-[11px]
                  text-slate-500
                "
              >
                Track revenue, customers, leads and campaign performance
              </p>

            </div>

          </div>


          {/* DATE FILTER */}

          <div
            className="
              flex
              items-center
              gap-1
              bg-white
              border
              border-slate-200
              rounded-xl
              p-1
              shadow-sm
              self-start
              sm:self-auto
            "
          >

            <CalendarDays
              size={14}
              className="
                text-slate-400
                ml-2
              "
            />


            {[
              "7D",
              "30D",
              "90D",
              "12M"
            ].map((period) => (

              <button
                key={period}
                className={`
                  px-3
                  py-1.5
                  rounded-lg
                  text-[10px]
                  font-semibold
                  transition-all

                  ${
                    period === "30D"
                      ? `
                        bg-blue-600
                        text-white
                        shadow-sm
                      `
                      : `
                        text-slate-500
                        hover:bg-slate-100
                      `
                  }
                `}
              >
                {period}
              </button>

            ))}

          </div>

        </div>


        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
            gap-3
          "
        >

          <KPICard
            title="Total Revenue"
            value="₹8.42L"
            growth="+12.8%"
            subtitle="vs last month"
            icon={
              <IndianRupee
                size={17}
                className="text-blue-600"
              />
            }
            iconBg="bg-blue-50"
          />


          <KPICard
            title="Customers"
            value="1,284"
            growth="+8.4%"
            subtitle="vs last month"
            icon={
              <Users
                size={17}
                className="text-violet-600"
              />
            }
            iconBg="bg-violet-50"
          />


          <KPICard
            title="Total Leads"
            value="642"
            growth="+14.2%"
            subtitle="vs last month"
            icon={
              <Target
                size={17}
                className="text-cyan-600"
              />
            }
            iconBg="bg-cyan-50"
          />


          <KPICard
            title="Conversion Rate"
            value="18.6%"
            growth="+3.1%"
            subtitle="vs last month"
            icon={
              <UserCheck
                size={17}
                className="text-emerald-600"
              />
            }
            iconBg="bg-emerald-50"
          />


          <KPICard
            title="Average Deal"
            value="₹13.1K"
            growth="+6.7%"
            subtitle="vs last month"
            icon={
              <Activity
                size={17}
                className="text-orange-600"
              />
            }
            iconBg="bg-orange-50"
          />

        </div>


        {/* ==================================================
            REVENUE + LEAD SOURCES
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-3
          "
        >


          {/* REVENUE */}

          <div
            className="
              lg:col-span-7
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-4
              overflow-hidden
            "
          >

            <SectionHeader
              icon={
                <TrendingUp size={15} />
              }
              title="Revenue Performance"
              subtitle="Monthly revenue trend"
              badge="+12.8%"
            />


            <div
              className="
                flex
                items-center
                gap-4
                mb-2
              "
            >

              <div>

                <p
                  className="
                    text-2xl
                    font-bold
                    text-slate-900
                  "
                >
                  ₹8.42L
                </p>

                <p
                  className="
                    text-[9px]
                    text-slate-400
                  "
                >
                  Total revenue
                </p>

              </div>


              <div
                className="
                  h-8
                  w-px
                  bg-slate-200
                "
              />


              <div>

                <p
                  className="
                    text-sm
                    font-bold
                    text-emerald-600
                  "
                >
                  +₹95.4K
                </p>

                <p
                  className="
                    text-[9px]
                    text-slate-400
                  "
                >
                  Growth
                </p>

              </div>

            </div>


            <div className="h-[190px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 8,
                    left: 0,
                    bottom: 0
                  }}
                >

                  <defs>

                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#2563EB"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#2563EB"
                        stopOpacity={0.01}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#64748B"
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#64748B"
                    }}
                    tickFormatter={(value) =>
                      `₹${value / 1000}k`
                    }
                  />


                  <Tooltip
                    content={<ChartTooltip />}
                  />


                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{
                      r: 2.5,
                      fill: "#2563EB"
                    }}
                    activeDot={{
                      r: 5
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* LEAD SOURCES */}

          <div
            className="
              lg:col-span-5
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-4
            "
          >

            <SectionHeader
              icon={
                <PieChartIcon size={15} />
              }
              title="Lead Sources"
              subtitle="Distribution by acquisition channel"
              badge="642 leads"
            />


            <div
              className="
                flex
                items-center
                h-[200px]
              "
            >

              <div
                className="
                  w-[55%]
                  h-full
                "
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={leadSourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={3}
                      stroke="#fff"
                      strokeWidth={3}
                    >

                      {leadSourceData.map(
                        (entry, index) => (

                          <Cell
                            key={`cell-${index}`}
                            fill={
                              PIE_COLORS[index]
                            }
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip
                      formatter={(value) =>
                        `${value}%`
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>


              <div
                className="
                  flex-1
                  space-y-2.5
                "
              >

                {leadSourceData.map(
                  (source, index) => (

                    <div
                      key={source.name}
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          min-w-0
                        "
                      >

                        <span
                          className="
                            w-2
                            h-2
                            rounded-full
                            shrink-0
                          "
                          style={{
                            backgroundColor:
                              PIE_COLORS[index]
                          }}
                        />


                        <span
                          className="
                            text-[10px]
                            text-slate-600
                            truncate
                          "
                        >
                          {source.name}
                        </span>

                      </div>


                      <span
                        className="
                          text-[10px]
                          font-bold
                          text-slate-800
                        "
                      >
                        {source.value}%
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            LEAD FUNNEL + CAMPAIGN
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-3
          "
        >


          {/* LEAD FUNNEL */}

          <div
            className="
              lg:col-span-6
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-4
            "
          >

            <SectionHeader
              icon={
                <Target size={15} />
              }
              title="Lead Funnel"
              subtitle="Pipeline movement and conversion"
              badge="18.6% overall"
            />


            <div
              className="
                h-[270px]
                flex
                flex-col
                justify-center
                gap-5
              "
            >

              {leadFunnelData.map(
                (item, index) => {

                  const percentage =
                    (item.value /
                      leadFunnelData[0].value) *
                    100;


                  const previous =
                    index === 0
                      ? item.value
                      : leadFunnelData[
                          index - 1
                        ].value;


                  const stageConversion =
                    (item.value /
                      previous) *
                    100;


                  return (

                    <div
                      key={item.name}
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-1.5
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <span
                            className="
                              w-2.5
                              h-2.5
                              rounded-full
                            "
                            style={{
                              backgroundColor:
                                item.color
                            }}
                          />


                          <span
                            className="
                              text-[11px]
                              font-semibold
                              text-slate-700
                            "
                          >
                            {item.name}
                          </span>

                        </div>


                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <span
                            className="
                              text-[11px]
                              font-bold
                              text-slate-900
                            "
                          >
                            {item.value}
                          </span>


                          <span
                            className="
                              px-2
                              py-0.5
                              rounded-full
                              bg-slate-100
                              text-[9px]
                              font-semibold
                              text-slate-500
                            "
                          >
                            {stageConversion.toFixed(
                              0
                            )}%
                          </span>

                        </div>

                      </div>


                      <div
                        className="
                          h-7
                          bg-slate-100
                          rounded-lg
                          overflow-hidden
                        "
                      >

                        <div
                          className="
                            h-full
                            rounded-lg
                            transition-all
                          "
                          style={{
                            width:
                              `${percentage}%`,
                            backgroundColor:
                              item.color
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </div>


          {/* CAMPAIGN PERFORMANCE */}

          <div
            className="
              lg:col-span-6
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-4
            "
          >

            <SectionHeader
              icon={
                <Megaphone size={15} />
              }
              title="Campaign Performance"
              subtitle="Lead generation vs conversions"
              badge="4 campaigns"
            />


            <div
              className="
                flex
                items-center
                gap-3
                mb-1
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-blue-600
                  "
                />

                <span
                  className="
                    text-[9px]
                    text-slate-500
                  "
                >
                  Leads
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span
                  className="
                    text-[9px]
                    text-slate-500
                  "
                >
                  Conversions
                </span>

              </div>

            </div>


            <div
              className="
                h-[250px]
              "
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={campaignData}
                  margin={{
                    top: 5,
                    right: 8,
                    left: -5,
                    bottom: 5
                  }}
                  barGap={8}
                >

                  <CartesianGrid
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="campaign"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#64748B"
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#64748B"
                    }}
                  />


                  <Tooltip
                    cursor={{
                      fill: "#F8FAFC"
                    }}
                    contentStyle={{
                      borderRadius: "10px",
                      border:
                        "1px solid #E2E8F0",
                      fontSize: "10px"
                    }}
                  />


                  <Bar
                    dataKey="leads"
                    name="Leads"
                    fill="#2563EB"
                    radius={[
                      5,
                      5,
                      0,
                      0
                    ]}
                    barSize={22}
                  />


                  <Bar
                    dataKey="conversions"
                    name="Conversions"
                    fill="#10B981"
                    radius={[
                      5,
                      5,
                      0,
                      0
                    ]}
                    barSize={22}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* ==================================================
            CUSTOMER GROWTH
        ================================================== */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-4
          "
        >

          <SectionHeader
            icon={
              <Users size={15} />
            }
            title="Customer Growth"
            subtitle="Customer acquisition over time"
            badge="+8.4%"
          />


          <div
            className="
              flex
              items-center
              gap-5
              mb-2
            "
          >

            <div>

              <p
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                1,284
              </p>

              <p
                className="
                  text-[9px]
                  text-slate-400
                "
              >
                Total customers
              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-1
                text-emerald-600
              "
            >

              <TrendingUp size={13} />

              <span
                className="
                  text-[10px]
                  font-bold
                "
              >
                +8.4%
              </span>

            </div>

          </div>


          <div
            className="
              h-[280px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={customerGrowthData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 5
                }}
              >

                <defs>

                  <linearGradient
                    id="customerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#7C3AED"
                      stopOpacity={0.22}
                    />

                    <stop
                      offset="100%"
                      stopColor="#7C3AED"
                      stopOpacity={0.01}
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  vertical={false}
                />


                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#64748B"
                  }}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#64748B"
                  }}
                />


                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border:
                      "1px solid #E2E8F0",
                    fontSize: "10px"
                  }}
                />


                <Area
                  type="monotone"
                  dataKey="customers"
                  name="Customers"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  fill="url(#customerGradient)"
                  dot={{
                    r: 3,
                    fill: "#7C3AED"
                  }}
                  activeDot={{
                    r: 6
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ==================================================
            AI INSIGHTS
        ================================================== */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-indigo-950
            rounded-2xl
            p-5
            text-white
            shadow-lg
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-20
              w-64
              h-64
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              lg:flex-row
              lg:items-center
              justify-between
              gap-5
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-600
                  flex
                  items-center
                  justify-center
                  shrink-0
                  shadow-lg
                  shadow-blue-500/30
                "
              >

                <Sparkles size={19} />

              </div>


              <div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <h3
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    CRM360 Intelligence
                  </h3>


                  <span
                    className="
                      px-2
                      py-0.5
                      rounded-full
                      bg-emerald-500/15
                      border
                      border-emerald-400/20
                      text-[8px]
                      font-bold
                      text-emerald-300
                    "
                  >
                    AI INSIGHT
                  </span>

                </div>


                <p
                  className="
                    text-[11px]
                    text-slate-300
                    mt-1.5
                    max-w-2xl
                  "
                >
                  Revenue is trending upward by 12.8%.
                  Website continues to be your strongest
                  acquisition channel, while Social Media
                  has the highest campaign conversion rate.
                </p>

              </div>

            </div>


            <div
              className="
                grid
                grid-cols-3
                gap-3
                lg:min-w-[430px]
              "
            >

              <div
                className="
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <TrendingUp
                    size={12}
                    className="
                      text-emerald-400
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      text-slate-400
                    "
                  >
                    Revenue
                  </span>

                </div>


                <p
                  className="
                    text-sm
                    font-bold
                    mt-1
                  "
                >
                  +12.8%
                </p>

              </div>


              <div
                className="
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <Globe
                    size={12}
                    className="
                      text-blue-400
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      text-slate-400
                    "
                  >
                    Best Source
                  </span>

                </div>


                <p
                  className="
                    text-sm
                    font-bold
                    mt-1
                  "
                >
                  Website
                </p>

              </div>


              <div
                className="
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <CheckCircle2
                    size={12}
                    className="
                      text-violet-400
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      text-slate-400
                    "
                  >
                    Conversion
                  </span>

                </div>


                <p
                  className="
                    text-sm
                    font-bold
                    mt-1
                  "
                >
                  18.6%
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            FOOTER STATUS
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-1
            py-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-emerald-500
              "
            />

            <span
              className="
                text-[9px]
                text-slate-400
              "
            >
              Analytics updated just now
            </span>

          </div>


          <div
            className="
              flex
              items-center
              gap-1
              text-[9px]
              text-slate-400
            "
          >

            <Zap size={10} />

            CRM360 Analytics

          </div>

        </div>

      </div>

    </div>

  );

}


export default Analytics;
