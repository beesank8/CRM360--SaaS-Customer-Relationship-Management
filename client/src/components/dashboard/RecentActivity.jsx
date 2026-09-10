import { useEffect, useState } from "react";
import {
  Bell,
  UserPlus,
  Target,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { getNotifications } from "../../services/notificationService";

// ============================================================
// RECENT ACTIVITY
// Shows the latest notifications/events as an activity feed.
// ============================================================

const TYPE_ICON = {
  lead: Target,
  customer: UserPlus,
  success: CheckCircle2,
  default: Bell,
};

function timeAgo(dateString) {
  if (!dateString) return "";

  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getNotifications();

        if (isMounted) {
          setActivities(
            Array.isArray(data?.notifications)
              ? data.notifications.slice(0, 6)
              : []
          );
        }
      } catch (err) {
        console.error("Recent activity load error:", err);
        if (isMounted) setError("Unable to load recent activity");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Recent Activity
      </h2>

      {loading && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && activities.length === 0 && (
        <p className="text-sm text-gray-400">No recent activity yet.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <ul className="flex-1 overflow-y-auto space-y-3">
          {activities.map((activity) => {
            const Icon = TYPE_ICON[activity.type] || TYPE_ICON.default;

            return (
              <li
                key={activity._id}
                className="flex items-start gap-3"
              >
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                  <Icon size={16} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {activity.message || activity.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {timeAgo(activity.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;
