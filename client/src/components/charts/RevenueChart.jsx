import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ==========================================================
// CRM360 - PROFESSIONAL REVENUE CHART
// Demo Data
// ==========================================================

const demoData = [
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 58000 },
  { month: "Jun", revenue: 51000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 68000 },
  { month: "Sep", revenue: 84564 },
];

// ==========================================================
// INR FORMATTER
// ==========================================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

// ==========================================================
// Y-AXIS FORMATTER
// ==========================================================

const formatYAxis = (value) => {
  if (value === 0) return "₹0";

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}k`;
  }

  return `₹${value}`;
};

// ==========================================================
// TOOLTIP
// ==========================================================

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const revenue = payload[0]?.value || 0;

  return (
    <div
      className="
        min-w-[175px]
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-xl
      "
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

        <span className="text-xs font-medium text-slate-500">
          {label} Revenue
        </span>
      </div>

      <p className="text-lg font-bold text-slate-900">
        {formatCurrency(revenue)}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        Monthly converted revenue
      </p>
    </div>
  );
};

// ==========================================================
// CUSTOM DOT
// ==========================================================

const RevenueDot = (props) => {
  const { cx, cy } = props;

  return (
    <g>
      {/* Soft outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="#dcfce7"
      />

      {/* White border */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#ffffff"
        stroke="#16a34a"
        strokeWidth={2.5}
      />

      {/* Green center */}
      <circle
        cx={cx}
        cy={cy}
        r={2.5}
        fill="#16a34a"
      />
    </g>
  );
};

// ==========================================================
// ACTIVE DOT
// ==========================================================

const ActiveRevenueDot = (props) => {
  const { cx, cy } = props;

  return (
    <g>
      {/* Larger highlight */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="#bbf7d0"
        opacity={0.55}
      />

      {/* White outer */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#ffffff"
        stroke="#16a34a"
        strokeWidth={3}
      />

      {/* Center */}
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#16a34a"
      />
    </g>
  );
};

// ==========================================================
// REVENUE CHART
// ==========================================================

const RevenueChart = () => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={demoData}
          margin={{
            top: 18,
            right: 18,
            left: 2,
            bottom: 4,
          }}
        >
          {/* ==================================================
              GRADIENT
          ================================================== */}

          <defs>
            <linearGradient
              id="crmRevenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#22c55e"
                stopOpacity={0.20}
              />

              <stop
                offset="60%"
                stopColor="#22c55e"
                stopOpacity={0.07}
              />

              <stop
                offset="100%"
                stopColor="#22c55e"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* ==================================================
              GRID
          ================================================== */}

          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="#e2e8f0"
            strokeDasharray="4 5"
          />

          {/* ==================================================
              X AXIS
          ================================================== */}

          <XAxis
            dataKey="month"
            axisLine={{
              stroke: "#cbd5e1",
              strokeWidth: 1,
            }}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 12,
              fontWeight: 500,
            }}
            dy={10}
          />

          {/* ==================================================
              Y AXIS
          ================================================== */}

          <YAxis
            domain={[0, 100000]}
            ticks={[
              0,
              25000,
              50000,
              75000,
              100000,
            ]}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 12,
              fontWeight: 500,
            }}
            tickFormatter={formatYAxis}
            width={62}
          />

          {/* ==================================================
              TOOLTIP
          ================================================== */}

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#94a3b8",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            wrapperStyle={{
              outline: "none",
            }}
          />

          {/* ==================================================
              REVENUE AREA + LINE
          ================================================== */}

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#16a34a"
            strokeWidth={3}
            fill="url(#crmRevenueGradient)"
            fillOpacity={1}
            dot={<RevenueDot />}
            activeDot={<ActiveRevenueDot />}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;