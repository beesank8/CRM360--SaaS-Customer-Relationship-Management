import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ============================================================
// MONTHLY LEAD CHART
// Shows how many leads were created per month over the last
// 6 months, based on each lead's createdAt timestamp.
// ============================================================

function buildMonthlyBuckets(leads) {
  const now = new Date();
  const buckets = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleString("en-US", { month: "short" }),
      leads: 0,
    });
  }

  const bucketMap = new Map(buckets.map((b) => [b.key, b]));

  leads.forEach((lead) => {
    if (!lead.createdAt) return;

    const d = new Date(lead.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = bucketMap.get(key);

    if (bucket) bucket.leads += 1;
  });

  return buckets;
}

function MonthlyLeadChart({ leads = [] }) {
  const data = buildMonthlyBuckets(leads);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#leadsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyLeadChart;
