import { useNavigate } from "react-router-dom";
import { UserPlus, Target, BarChart3, Settings } from "lucide-react";

// ============================================================
// QUICK ACTIONS
// Shortcut buttons to the most common tasks from the dashboard.
// ============================================================

const ACTIONS = [
  {
    label: "Add Lead",
    description: "Create a new lead",
    icon: Target,
    path: "/leads",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Add Customer",
    description: "Create a new customer",
    icon: UserPlus,
    path: "/customers",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "View Analytics",
    description: "Check performance",
    icon: BarChart3,
    path: "/analytics",
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Settings",
    description: "Manage your workspace",
    icon: Settings,
    path: "/settings",
    color: "text-gray-600 bg-gray-100",
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="
                flex flex-col items-start gap-2
                rounded-xl border border-gray-200
                p-3 text-left
                hover:border-gray-300 hover:shadow-sm
                transition-all
              "
            >
              <span className={`p-2 rounded-lg ${action.color}`}>
                <Icon size={18} />
              </span>

              <span className="text-sm font-medium text-gray-800">
                {action.label}
              </span>

              <span className="text-xs text-gray-500">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
