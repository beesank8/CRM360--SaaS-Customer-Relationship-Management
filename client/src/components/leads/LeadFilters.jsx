// ============================================================
// LEAD FILTERS
// ============================================================

function LeadFilters({
  search,
  setSearch,

  statusFilter,
  setStatusFilter,

  sourceFilter,
  setSourceFilter,

  priorityFilter,
  setPriorityFilter,

  dateFilter,
  setDateFilter,

  onReset,

  sources = [],
  priorities = [],
}) {
  // ============================================================
  // IMPORTANT STATUS OPTIONS
  // These match the important KPI statuses.
  // ============================================================

  const statusOptions = [
    "New",
    "Interested",
    "Qualified",
    "Lost",
  ];

  // ============================================================
  // SOURCE OPTIONS
  // Use actual sources from the loaded leads.
  // ============================================================

  const sourceOptions = [
    ...new Set(
      Array.isArray(sources)
        ? sources.filter(Boolean)
        : []
    ),
  ];

  // ============================================================
  // PRIORITY OPTIONS
  // ============================================================

  const priorityOptions = [
    ...new Set(
      (
        Array.isArray(priorities) &&
        priorities.length > 0
          ? priorities
          : ["High", "Medium", "Low"]
      ).filter(Boolean)
    ),
  ];

  return (
    <div
      className="
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
      "
    >

      {/* ======================================================
          FILTER ROW
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >

        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="min-w-[220px] flex-1">

          <input
            type="text"
            value={search || ""}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="
              Search name, email, phone or company...
            "
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-800
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>


        {/* ====================================================
            STATUS
        ==================================================== */}

        <select
          value={
            statusFilter === "all"
              ? ""
              : statusFilter || ""
          }
          onChange={(e) =>
            setStatusFilter(
              e.target.value || "all"
            )
          }
          className="
            min-w-[150px]
            cursor-pointer
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2.5
            text-sm
            text-gray-800
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >

          <option value="">
            All Status
          </option>

          {statusOptions.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            )
          )}

        </select>


        {/* ====================================================
            SOURCE
        ==================================================== */}

        <select
          value={
            sourceFilter === "all"
              ? ""
              : sourceFilter || ""
          }
          onChange={(e) =>
            setSourceFilter(
              e.target.value || "all"
            )
          }
          className="
            min-w-[150px]
            cursor-pointer
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2.5
            text-sm
            text-gray-800
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >

          <option value="">
            All Sources
          </option>

          {sourceOptions.map(
            (source) => (
              <option
                key={source}
                value={source}
              >
                {source}
              </option>
            )
          )}

        </select>


        {/* ====================================================
            PRIORITY
        ==================================================== */}

        <select
          value={
            priorityFilter === "all"
              ? ""
              : priorityFilter || ""
          }
          onChange={(e) =>
            setPriorityFilter(
              e.target.value || "all"
            )
          }
          className="
            min-w-[140px]
            cursor-pointer
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2.5
            text-sm
            text-gray-800
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >

          <option value="">
            All Priority
          </option>

          {priorityOptions.map(
            (priority) => (
              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>
            )
          )}

        </select>


        {/* ====================================================
            DATE
        ==================================================== */}

        <select
          value={
            dateFilter === "all"
              ? ""
              : dateFilter || ""
          }
          onChange={(e) =>
            setDateFilter(
              e.target.value || "all"
            )
          }
          className="
            min-w-[135px]
            cursor-pointer
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2.5
            text-sm
            text-gray-800
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        >

          <option value="">
            All Time
          </option>

          <option value="today">
            Today
          </option>

          <option value="week">
            This Week
          </option>

          <option value="month">
            This Month
          </option>

          <option value="year">
            This Year
          </option>

        </select>


        {/* ====================================================
            CLEAR
        ==================================================== */}

        <button
          type="button"
          onClick={onReset}
          className="
            rounded-lg
            border
            border-gray-200
            bg-gray-100
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-200
            active:scale-[0.98]
          "
        >
          Clear
        </button>

      </div>

    </div>
  );
}

export default LeadFilters;