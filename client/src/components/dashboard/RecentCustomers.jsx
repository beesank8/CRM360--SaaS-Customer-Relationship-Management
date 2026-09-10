import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronRight } from "lucide-react";

import { getCustomers } from "../../services/customerService";

// ============================================================
// RECENT CUSTOMERS
// Shows the most recently added customers on the dashboard.
// ============================================================

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function RecentCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getCustomers();
        const list = Array.isArray(data) ? data : data?.customers || [];

        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (isMounted) setCustomers(sorted.slice(0, 5));
      } catch (err) {
        console.error("Recent customers load error:", err);
        if (isMounted) setError("Unable to load customers");
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Customers
        </h2>

        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View all
          <ChevronRight size={14} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && customers.length === 0 && (
        <p className="text-sm text-gray-400">No customers yet.</p>
      )}

      {!loading && !error && customers.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {customers.map((customer) => (
            <li
              key={customer._id}
              className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
              onClick={() => navigate("/customers")}
            >
              <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold flex items-center justify-center shrink-0">
                {initials(customer.name)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {customer.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {customer.company}
                </p>
              </div>

              <span
                className={`
                  text-xs px-2 py-1 rounded-full font-medium shrink-0
                  ${
                    customer.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {customer.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentCustomers;
