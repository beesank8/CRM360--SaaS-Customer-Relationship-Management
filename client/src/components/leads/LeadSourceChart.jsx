import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ============================================================
// LEAD SOURCE CHART
// Compares how many leads came from each acquisition channel.
// ============================================================

const BAR_COLORS = [
  "#6366f1",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#f97316",
  "#14b8a6",
  "#ef4444",
];

function LeadSourceChart({ leads = [] }) {
  const counts = leads.reduce((acc, lead) => {
    const source = lead.source || "Other";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        No lead data yet
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="source" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Bar dataKey="count" name="Leads" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.source}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeadSourceChart;
