import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Search,
  Plus,
  Users,
  X,
  Filter,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

import AddCustomerModal from "../components/customers/AddCustomerModal";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerKPICards from "../components/customers/CustomerKPICards";
import CustomerDetailsDrawer from "../components/customers/CustomerDetailsDrawer";

// ============================================================
// CUSTOMERS PAGE
// ============================================================

function Customers() {
  // ==========================================================
  // CUSTOMERS
  // ==========================================================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const [search, setSearch] = useState("");

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [statusFilter, setStatusFilter] = useState("");

  const [timeFilter, setTimeFilter] = useState("");

  // ==========================================================
  // MODALS / DRAWER
  // ==========================================================

  const [showAddModal, setShowAddModal] = useState(false);

  const [editCustomer, setEditCustomer] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ==========================================================
  // KPI STATS
  // ==========================================================

  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    todayCustomers: 0,
    companies: 0,
  });

  // ==========================================================
  // FETCH CUSTOMERS
  // ==========================================================

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/customers");

      const data =
        response?.data?.customers ||
        response?.data ||
        [];

      let customerList = Array.isArray(data)
        ? data
        : [];

      // ========================================================
      // CUSTOMER ORDER
      // ========================================================
      //
      // Keep customers in the same chronological order as Leads.
      //
      // Converted Lead:
      //     convertedLead.createdAt
      //
      // Normal Customer:
      //     createdAt
      //
      // Newest → Oldest
      // ========================================================

      customerList = [...customerList].sort(
        (a, b) => {
          const dateA =
            a?.convertedLead?.createdAt ||
            a?.createdAt ||
            0;

          const dateB =
            b?.convertedLead?.createdAt ||
            b?.createdAt ||
            0;

          const timeA = new Date(dateA).getTime();

          const timeB = new Date(dateB).getTime();

          const validA = !Number.isNaN(timeA);

          const validB = !Number.isNaN(timeB);

          if (!validA && !validB) {
            return 0;
          }

          if (!validA) {
            return 1;
          }

          if (!validB) {
            return -1;
          }

          return timeB - timeA;
        }
      );

      setCustomers(customerList);

      // ========================================================
      // KPI STATISTICS
      // ========================================================

      const today = new Date();

      // --------------------------------------------------------
      // ACTIVE CUSTOMERS
      // --------------------------------------------------------

      const activeCustomers =
        customerList.filter(
          (customer) =>
            (customer?.status || "Active") ===
            "Active"
        ).length;

      // --------------------------------------------------------
      // ADDED TODAY
      // --------------------------------------------------------

      const todayCustomers =
        customerList.filter((customer) => {
          if (!customer?.createdAt) {
            return false;
          }

          const created = new Date(
            customer.createdAt
          );

          if (
            Number.isNaN(created.getTime())
          ) {
            return false;
          }

          return (
            created.toDateString() ===
            today.toDateString()
          );
        }).length;

      // --------------------------------------------------------
      // UNIQUE COMPANIES
      // --------------------------------------------------------

      const companies =
        new Set(
          customerList
            .map(
              (customer) =>
                customer?.company
            )
            .filter(Boolean)
        ).size;

      // --------------------------------------------------------
      // SAVE KPI STATS
      // --------------------------------------------------------

      setCustomerStats({
        totalCustomers:
          customerList.length,

        activeCustomers,

        todayCustomers,

        companies,
      });
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    await fetchCustomers();

    toast.success(
      "Customers refreshed"
    );
  };

  // ==========================================================
  // DELETE CUSTOMER
  // ==========================================================

  const deleteCustomer = async (id) => {
    if (!id) {
      toast.error(
        "Customer ID not found"
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/customers/${id}`
      );

      toast.success(
        "Customer deleted successfully"
      );

      // ------------------------------------------------------
      // CLOSE DRAWER
      // ------------------------------------------------------

      if (
        selectedCustomer?._id === id
      ) {
        setSelectedCustomer(null);
      }

      // ------------------------------------------------------
      // CLOSE EDIT MODAL
      // ------------------------------------------------------

      if (
        editCustomer?._id === id
      ) {
        setEditCustomer(null);
      }

      // ------------------------------------------------------
      // REMOVE IMMEDIATELY FROM UI
      // ------------------------------------------------------

      setCustomers((current) =>
        current.filter(
          (customer) =>
            customer?._id !== id
        )
      );

      // ------------------------------------------------------
      // REFRESH DATA
      // ------------------------------------------------------

      await fetchCustomers();
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ==========================================================
  // SEARCH + FILTER
  // ==========================================================

  const filteredCustomers = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    const now = new Date();

    return customers.filter(
      (customer) => {
        // ====================================================
        // SEARCH
        // ====================================================

        const name =
          String(
            customer?.name || ""
          ).toLowerCase();

        const email =
          String(
            customer?.email || ""
          ).toLowerCase();

        const company =
          String(
            customer?.company || ""
          ).toLowerCase();

        const phone =
          String(
            customer?.phone || ""
          ).toLowerCase();

        const status =
          String(
            customer?.status || ""
          ).toLowerCase();

        const location =
          String(
            customer?.location ||
              customer?.address ||
              ""
          ).toLowerCase();

        const industry =
          String(
            customer?.industry || ""
          ).toLowerCase();

        const matchesSearch =
          !keyword ||
          name.includes(keyword) ||
          email.includes(keyword) ||
          company.includes(keyword) ||
          phone.includes(keyword) ||
          status.includes(keyword) ||
          location.includes(keyword) ||
          industry.includes(keyword);

        // ====================================================
        // STATUS FILTER
        // ====================================================

        const customerStatus =
          String(
            customer?.status ||
              "Active"
          )
            .trim()
            .toLowerCase();

        const selectedStatus =
          String(
            statusFilter || ""
          )
            .trim()
            .toLowerCase();

        const matchesStatus =
          !selectedStatus ||
          customerStatus ===
            selectedStatus;

        // ====================================================
        // TIME FILTER
        // ====================================================

        const customerDate =
          customer?.convertedLead
            ?.createdAt ||
          customer?.createdAt;

        let matchesTime = true;

        if (timeFilter) {
          if (!customerDate) {
            matchesTime = false;
          } else {
            const created =
              new Date(
                customerDate
              );

            if (
              Number.isNaN(
                created.getTime()
              )
            ) {
              matchesTime = false;
            } else {
              // ----------------------------------------------
              // TODAY
              // ----------------------------------------------

              if (
                timeFilter === "today"
              ) {
                matchesTime =
                  created.toDateString() ===
                  now.toDateString();
              }

              // ----------------------------------------------
              // THIS WEEK
              // ----------------------------------------------

              if (
                timeFilter === "week"
              ) {
                const weekStart =
                  new Date(now);

                weekStart.setDate(
                  now.getDate() - 7
                );

                weekStart.setHours(
                  0,
                  0,
                  0,
                  0
                );

                matchesTime =
                  created >=
                  weekStart;
              }

              // ----------------------------------------------
              // THIS MONTH
              // ----------------------------------------------

              if (
                timeFilter === "month"
              ) {
                const monthStart =
                  new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                  );

                matchesTime =
                  created >=
                  monthStart;
              }

              // ----------------------------------------------
              // THIS YEAR
              // ----------------------------------------------

              if (
                timeFilter === "year"
              ) {
                const yearStart =
                  new Date(
                    now.getFullYear(),
                    0,
                    1
                  );

                matchesTime =
                  created >=
                  yearStart;
              }
            }
          }
        }

        // ====================================================
        // FINAL FILTER RESULT
        // ====================================================

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTime
        );
      }
    );
  }, [
    customers,
    search,
    statusFilter,
    timeFilter,
  ]);

  // ==========================================================
  // ACTIVE FILTER CHECK
  // ==========================================================

  const hasActiveFilters =
    Boolean(
      search ||
        statusFilter ||
        timeFilter
    );

  // ==========================================================
  // CLEAR ALL FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTimeFilter("");
  };

  // ==========================================================
  // CLEAR SEARCH ONLY
  // ==========================================================

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================================
  // ADD CUSTOMER SUCCESS
  // ==========================================================

  const handleAddSuccess =
    async () => {
      setShowAddModal(false);

      await fetchCustomers();
    };

  // ==========================================================
  // EDIT CUSTOMER SUCCESS
  // ==========================================================

  const handleEditSuccess =
    async () => {
      setEditCustomer(null);

      await fetchCustomers();
    };

  // ==========================================================
  // VIEW CUSTOMER
  // ==========================================================

  const handleViewCustomer =
    (customer) => {
      setSelectedCustomer(
        customer
      );
    };

  // ==========================================================
  // EDIT CUSTOMER
  // ==========================================================

  const handleEditCustomer =
    (customer) => {
      setSelectedCustomer(null);

      setEditCustomer(
        customer
      );
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-5">

      {/* ====================================================
          HEADER
          SEARCH IS HERE
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >

        {/* ==================================================
            PAGE TITLE
        =================================================== */}

        <div className="min-w-0">

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Users size={20} />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-gray-800
                "
              >
                Customers
              </h1>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-0.5
                "
              >
                Manage your customer relationships
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            SEARCH + REFRESH + ADD CUSTOMER
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            w-full
            lg:w-auto
          "
        >

          {/* ==================================================
              SINGLE SEARCH BAR
          =================================================== */}

          <div
            className="
              relative
              flex-1
              lg:w-[350px]
              lg:flex-none
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customers..."
              className="
                w-full
                h-11
                pl-10
                pr-10
                bg-white
                border
                border-gray-200
                rounded-xl
                outline-none
                text-sm
                text-gray-700
                placeholder:text-gray-400
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
                transition
              "
            />

            {/* CLEAR SEARCH */}

            {search && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                title="Clear search"
                className="
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  w-6
                  h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:bg-gray-100
                  hover:text-gray-600
                  transition
                "
              >
                <X size={14} />
              </button>
            )}

          </div>

          {/* ==================================================
              REFRESH
          =================================================== */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            title="Refresh customers"
            className="
              h-11
              w-11
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-600
              flex
              items-center
              justify-center
              hover:bg-gray-50
              hover:text-blue-600
              transition
              shrink-0
            "
          >
            <RefreshCw
              size={18}
            />
          </button>

          {/* ==================================================
              ADD CUSTOMER
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
            className="
              h-11
              px-4
              rounded-xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-semibold
              whitespace-nowrap
              hover:bg-blue-700
              active:bg-blue-800
              transition
              shadow-sm
            "
          >

            <Plus size={18} />

            <span>
              Add Customer
            </span>

          </button>

        </div>

      </div>


      {/* ====================================================
          KPI CARDS
      ===================================================== */}

      <CustomerKPICards
        stats={customerStats}
      />


      {/* ====================================================
          FILTERS
      ===================================================== */}

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-xl
          shadow-sm
          px-4
          py-3
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* ==================================================
              FILTER LABEL
          =================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-700
              mr-1
            "
          >

            <Filter
              size={17}
              className="text-blue-600"
            />

            <span>
              Filters
            </span>

          </div>


          {/* ==================================================
              STATUS FILTER
          =================================================== */}

          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="
              h-10
              min-w-[170px]
              px-3
              rounded-lg
              border
              border-gray-200
              bg-white
              text-sm
              text-gray-700
              outline-none
              cursor-pointer
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
              transition
            "
          >

            <option value="">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>


          {/* ==================================================
              TIME FILTER
          =================================================== */}

          <select
            value={
              timeFilter
            }
            onChange={(event) =>
              setTimeFilter(
                event.target.value
              )
            }
            className="
              h-10
              min-w-[170px]
              px-3
              rounded-lg
              border
              border-gray-200
              bg-white
              text-sm
              text-gray-700
              outline-none
              cursor-pointer
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
              transition
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


          {/* ==================================================
              CLEAR FILTERS
          =================================================== */}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                h-10
                px-4
                rounded-lg
                bg-gray-100
                border
                border-gray-200
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-200
                transition
              "
            >
              Clear
            </button>
          )}

        </div>

      </div>


      {/* ====================================================
          RESULT COUNT
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          px-1
        "
      >

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          Showing{" "}

          <span
            className="
              font-semibold
              text-gray-800
            "
          >
            {
              filteredCustomers.length
            }
          </span>

          {" "}of{" "}

          <span
            className="
              font-semibold
              text-gray-800
            "
          >
            {
              customers.length
            }
          </span>

          {" "}customers

        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="
              text-sm
              font-medium
              text-blue-600
              hover:text-blue-700
              transition
            "
          >
            Clear all filters
          </button>
        )}

      </div>


      {/* ====================================================
          CUSTOMERS LIST
      ===================================================== */}

      {loading ? (

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-10
            text-center
          "
        >

          <div
            className="
              w-8
              h-8
              border-2
              border-blue-600
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-3
            "
          />

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Loading customers...
          </p>

        </div>

      ) : filteredCustomers.length === 0 ? (

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            shadow-sm
            p-12
            text-center
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-gray-100
              text-gray-400
              flex
              items-center
              justify-center
              mx-auto
              mb-3
            "
          >
            <Search size={22} />
          </div>

          <h3
            className="
              text-sm
              font-semibold
              text-gray-700
            "
          >
            No customers found
          </h3>

          <p
            className="
              text-xs
              text-gray-500
              mt-1
            "
          >
            {hasActiveFilters
              ? "No customers match your search or selected filters."
              : "No customers have been added yet."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                mt-4
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
              "
            >
              Clear filters
            </button>
          )}

        </div>

      ) : (

        <CustomerTable
          customers={
            filteredCustomers
          }
          onViewCustomer={
            handleViewCustomer
          }
          onEditCustomer={
            handleEditCustomer
          }
          onDeleteCustomer={
            deleteCustomer
          }
        />

      )}


      {/* ====================================================
          ADD CUSTOMER MODAL
      ===================================================== */}

      {showAddModal && (
        <AddCustomerModal
          onClose={() =>
            setShowAddModal(
              false
            )
          }
          onSuccess={
            handleAddSuccess
          }
        />
      )}


      {/* ====================================================
          EDIT CUSTOMER MODAL
      ===================================================== */}

      {editCustomer && (
        <EditCustomerModal
          customer={
            editCustomer
          }
          onClose={() =>
            setEditCustomer(
              null
            )
          }
          onSuccess={
            handleEditSuccess
          }
        />
      )}


      {/* ====================================================
          CUSTOMER DETAILS DRAWER
      ===================================================== */}

      <CustomerDetailsDrawer
        customer={
          selectedCustomer
        }
        onClose={() =>
          setSelectedCustomer(
            null
          )
        }
        onEditCustomer={
          handleEditCustomer
        }
        onDeleteCustomer={
          (id) => {
            setSelectedCustomer(
              null
            );

            deleteCustomer(id);
          }
        }
      />

    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default Customers;