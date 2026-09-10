import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============================================================
// LEAD STATUS CHART
// Breaks down leads by their current pipeline status.
// ============================================================

const STATUS_COLORS = {
  New: "#6366f1",
  Contacted: "#3b82f6",
  Interested: "#8b5cf6",
  Qualified: "#f59e0b",
  Negotiation: "#f97316",
  Won: "#10b981",
  Lost: "#ef4444",
  Converted: "#14b8a6",
};

function LeadStatusChart({ leads = [] }) {
  const counts = leads.reduce((acc, lead) => {
    const status = lead.status || "New";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([status, value]) => ({
    name: status,
    value,
  }));

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
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] || "#94a3b8"}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeadStatusChart;
