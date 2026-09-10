import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import LeadHeader from "../components/leads/LeadHeader";
import LeadKPICards from "../components/leads/LeadKPICards";
import LeadTable from "../components/leads/LeadTable";
import AddLeadModal from "../components/leads/AddLeadModal";
import LeadDetailsDrawer from "../components/leads/LeadDetailsDrawer";
import EditLeadModal from "../components/leads/EditLeadModal";
import ConvertLeadModal from "../components/leads/ConvertLeadModal";
import DeleteLeadModal from "../components/leads/DeleteLeadModal";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
} from "../services/leadService";

import toast from "react-hot-toast";

// ============================================================
// LEADS PAGE
// ============================================================

function Leads() {
  // ============================================================
  // STATE
  // ============================================================

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [editLead, setEditLead] =
    useState(null);

  const [deleteLeadData, setDeleteLeadData] =
    useState(null);

  const [convertLeadData, setConvertLeadData] =
    useState(null);

  const [converting, setConverting] =
    useState(false);

  // ============================================================
  // FILTER STATE
  // ============================================================

  /*
   * IMPORTANT:
   *
   * This search state controls the FIRST search bar
   * in LeadHeader.
   *
   * There is NO second search input anymore.
   */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  // ============================================================
  // LOAD LEADS
  // ============================================================

  const loadLeads = useCallback(
    async () => {
      try {
        setLoading(true);

        const response =
          await getLeads();

        let leadData = [];

        // ------------------------------------------------------
        // SUPPORT DIFFERENT API RESPONSE SHAPES
        // ------------------------------------------------------

        if (Array.isArray(response)) {
          leadData = response;
        } else if (
          Array.isArray(response?.leads)
        ) {
          leadData = response.leads;
        } else if (
          Array.isArray(response?.data)
        ) {
          leadData = response.data;
        } else if (
          Array.isArray(response?.data?.leads)
        ) {
          leadData = response.data.leads;
        }

        // ------------------------------------------------------
        // REMOVE INVALID / CONVERTED LEADS
        // ------------------------------------------------------

        leadData = leadData.filter(
          (lead) => {
            if (!lead) {
              return false;
            }

            const isConverted =
              lead.converted === true ||
              lead.isConverted === true ||
              Boolean(
                lead.convertedCustomer
              ) ||
              String(
                lead.status || ""
              )
                .trim()
                .toLowerCase() ===
                "converted";

            return !isConverted;
          }
        );

        setLeads(leadData);
      } catch (error) {
        console.error(
          "Load leads error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load leads"
        );

        setLeads([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // ============================================================
  // ADD LEAD
  // ============================================================

  const handleAddLead = async (
    formData
  ) => {
    try {
      await createLead(formData);

      toast.success(
        "Lead created successfully"
      );

      setShowModal(false);

      await loadLeads();
    } catch (error) {
      console.error(
        "Create lead error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to create lead"
      );
    }
  };

  // ============================================================
  // EDIT LEAD
  // ============================================================

  const handleEditLead = (
    lead
  ) => {
    if (!lead?._id) {
      return;
    }

    const isConverted =
      lead.converted === true ||
      lead.isConverted === true ||
      Boolean(
        lead.convertedCustomer
      ) ||
      String(
        lead.status || ""
      )
        .trim()
        .toLowerCase() ===
        "converted";

    if (isConverted) {
      toast.error(
        "Converted leads cannot be edited"
      );

      return;
    }

    setEditLead(lead);
  };

  // ============================================================
  // UPDATE LEAD
  // ============================================================

  const handleUpdateLead =
    async (formData) => {
      if (!editLead?._id) {
        return;
      }

      try {
        await updateLead(
          editLead._id,
          formData
        );

        toast.success(
          "Lead updated successfully"
        );

        setEditLead(null);

        setSelectedLead(null);

        await loadLeads();
      } catch (error) {
        console.error(
          "Update lead error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update lead"
        );
      }
    };

  // ============================================================
  // DELETE LEAD
  // ============================================================

  const handleDeleteLead = (
    lead
  ) => {
    if (!lead?._id) {
      return;
    }

    const isConverted =
      lead.converted === true ||
      lead.isConverted === true ||
      Boolean(
        lead.convertedCustomer
      ) ||
      String(
        lead.status || ""
      )
        .trim()
        .toLowerCase() ===
        "converted";

    if (isConverted) {
      toast.error(
        "Converted leads cannot be deleted"
      );

      return;
    }

    setDeleteLeadData(lead);
  };

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  const handleConfirmDelete =
    async () => {
      if (!deleteLeadData?._id) {
        return;
      }

      const leadId =
        deleteLeadData._id;

      try {
        await deleteLead(leadId);

        // ------------------------------------------------------
        // REMOVE IMMEDIATELY FROM UI
        // ------------------------------------------------------

        setLeads(
          (currentLeads) =>
            currentLeads.filter(
              (lead) =>
                lead?._id !==
                leadId
            )
        );

        // ------------------------------------------------------
        // CLOSE MODALS / DRAWER
        // ------------------------------------------------------

        setDeleteLeadData(null);

        if (
          selectedLead?._id ===
          leadId
        ) {
          setSelectedLead(null);
        }

        toast.success(
          "Lead deleted successfully"
        );

        // ------------------------------------------------------
        // REFRESH
        // ------------------------------------------------------

        await loadLeads();
      } catch (error) {
        console.error(
          "Delete lead error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to delete lead"
        );
      }
    };

  // ============================================================
  // OPEN CONVERT MODAL
  // ============================================================

  const handleConvertLead = (
    lead
  ) => {
    if (!lead?._id) {
      return;
    }

    const isConverted =
      lead.converted === true ||
      lead.isConverted === true ||
      Boolean(
        lead.convertedCustomer
      ) ||
      String(
        lead.status || ""
      )
        .trim()
        .toLowerCase() ===
        "converted";

    if (isConverted) {
      toast.error(
        "This lead is already converted"
      );

      return;
    }

    setConvertLeadData(lead);
  };

  // ============================================================
  // CONFIRM CONVERSION
  // ============================================================
  //
  // Backend:
  //
  // Lead
  //   ↓
  // Customer
  //
  // Original Lead is deleted.
  //
  // Frontend:
  //
  // 1. Calls conversion API.
  // 2. Removes Lead immediately.
  // 3. Closes modal.
  // 4. Reloads Leads.
  //
  // ============================================================

  const handleConfirmConvert =
    async () => {
      if (!convertLeadData?._id) {
        return;
      }

      const leadId =
        convertLeadData._id;

      try {
        setConverting(true);

        const response =
          await convertLead(
            leadId
          );

        console.log(
          "Lead conversion response:",
          response
        );

        // ------------------------------------------------------
        // REMOVE CONVERTED LEAD IMMEDIATELY
        // ------------------------------------------------------

        setLeads(
          (currentLeads) =>
            currentLeads.filter(
              (lead) =>
                lead?._id !==
                leadId
            )
        );

        // ------------------------------------------------------
        // CLOSE CONVERSION MODAL
        // ------------------------------------------------------

        setConvertLeadData(null);

        // ------------------------------------------------------
        // CLOSE DETAILS DRAWER
        // ------------------------------------------------------

        setSelectedLead(null);

        // ------------------------------------------------------
        // SUCCESS MESSAGE
        // ------------------------------------------------------

        toast.success(
          "Lead converted to customer successfully"
        );

        // ------------------------------------------------------
        // REFRESH FROM BACKEND
        // ------------------------------------------------------

        await loadLeads();
      } catch (error) {
        console.error(
          "Lead conversion error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Lead conversion failed"
        );
      } finally {
        setConverting(false);
      }
    };

  // ============================================================
  // VIEW LEAD
  // ============================================================

  const handleViewLead = (
    lead
  ) => {
    if (!lead) {
      return;
    }

    setSelectedLead(lead);
  };

  // ============================================================
  // CLOSE DETAILS DRAWER
  // ============================================================

  const handleCloseDetails =
    () => {
      setSelectedLead(null);
    };

  // ============================================================
  // SEARCH
  // ============================================================
  //
  // THIS IS THE IMPORTANT FIX.
  //
  // LeadHeader receives:
  //
  // search={search}
  // setSearch={setSearch}
  //
  // The top search bar now filters:
  //
  // - Name
  // - Email
  // - Phone
  // - Company
  //
  // ============================================================

  const handleSearchChange = (
    value
  ) => {
    setSearch(
      String(value || "")
    );
  };

  // ============================================================
  // FILTER HANDLERS
  // ============================================================

  const handleStatusChange = (
    value
  ) => {
    setStatus(
      String(value || "")
    );
  };

  const handleSourceChange = (
    value
  ) => {
    setSource(
      String(value || "")
    );
  };

  const handlePriorityChange = (
    value
  ) => {
    setPriority(
      String(value || "")
    );
  };

  const handleDateFilterChange =
    (value) => {
      setDateFilter(
        String(value || "")
      );
    };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const handleClearFilters =
    () => {
      setSearch("");

      setStatus("");

      setSource("");

      setPriority("");

      setDateFilter("");
    };

  // ============================================================
  // DATE MATCHING
  // ============================================================

  const matchesDateFilter = (
    lead
  ) => {
    if (!dateFilter) {
      return true;
    }

    if (!lead?.createdAt) {
      return false;
    }

    const createdAt =
      new Date(
        lead.createdAt
      );

    if (
      Number.isNaN(
        createdAt.getTime()
      )
    ) {
      return false;
    }

    const now =
      new Date();

    // ----------------------------------------------------------
    // TODAY
    // ----------------------------------------------------------

    if (
      dateFilter === "today"
    ) {
      return (
        createdAt.toDateString() ===
        now.toDateString()
      );
    }

    // ----------------------------------------------------------
    // THIS WEEK
    // ----------------------------------------------------------

    if (
      dateFilter === "week"
    ) {
      const startOfWeek =
        new Date(now);

      startOfWeek.setDate(
        now.getDate() -
          now.getDay()
      );

      startOfWeek.setHours(
        0,
        0,
        0,
        0
      );

      return (
        createdAt >=
        startOfWeek
      );
    }

    // ----------------------------------------------------------
    // THIS MONTH
    // ----------------------------------------------------------

    if (
      dateFilter === "month"
    ) {
      const startOfMonth =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

      return (
        createdAt >=
        startOfMonth
      );
    }

    // ----------------------------------------------------------
    // THIS YEAR
    // ----------------------------------------------------------

    if (
      dateFilter === "year"
    ) {
      const startOfYear =
        new Date(
          now.getFullYear(),
          0,
          1
        );

      return (
        createdAt >=
        startOfYear
      );
    }

    return true;
  };

  // ============================================================
  // FILTER LEADS
  // ============================================================

  const filteredLeads =
    useMemo(() => {
      if (
        !Array.isArray(
          leads
        )
      ) {
        return [];
      }

      const searchText =
        search
          .trim()
          .toLowerCase();

      return leads.filter(
        (lead) => {
          // ----------------------------------------------------
          // SEARCH
          // ----------------------------------------------------

          const name =
            String(
              lead?.name || ""
            ).toLowerCase();

          const email =
            String(
              lead?.email || ""
            ).toLowerCase();

          const phone =
            String(
              lead?.phone || ""
            ).toLowerCase();

          const company =
            String(
              lead?.company || ""
            ).toLowerCase();

          const matchesSearch =
            !searchText ||
            name.includes(
              searchText
            ) ||
            email.includes(
              searchText
            ) ||
            phone.includes(
              searchText
            ) ||
            company.includes(
              searchText
            );

          // ----------------------------------------------------
          // STATUS
          // ----------------------------------------------------

          const matchesStatus =
            !status ||
            String(
              lead?.status || ""
            )
              .trim()
              .toLowerCase() ===
              String(
                status
              )
                .trim()
                .toLowerCase();

          // ----------------------------------------------------
          // SOURCE
          // ----------------------------------------------------

          const matchesSource =
            !source ||
            String(
              lead?.source || ""
            )
              .trim()
              .toLowerCase() ===
              String(
                source
              )
                .trim()
                .toLowerCase();

          // ----------------------------------------------------
          // PRIORITY
          // ----------------------------------------------------

          const matchesPriority =
            !priority ||
            String(
              lead?.priority || ""
            )
              .trim()
              .toLowerCase() ===
              String(
                priority
              )
                .trim()
                .toLowerCase();

          // ----------------------------------------------------
          // DATE
          // ----------------------------------------------------

          const matchesDate =
            matchesDateFilter(
              lead
            );

          return (
            matchesSearch &&
            matchesStatus &&
            matchesSource &&
            matchesPriority &&
            matchesDate
          );
        }
      );
    }, [
      leads,
      search,
      status,
      source,
      priority,
      dateFilter,
    ]);

  // ============================================================
  // KPI CALCULATIONS
  // ============================================================

  const totalLeads =
    leads.length;

  const newLeads =
    leads.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() ===
        "new"
    ).length;

  const contactedLeads =
    leads.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() ===
        "contacted"
    ).length;

  const qualifiedLeads =
    leads.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() ===
        "qualified"
    ).length;

  /*
   * Converted Leads are removed from this page after conversion.
   *
   * Therefore this should normally be zero.
   *
   * It is kept for compatibility with LeadKPICards.
   */

  const convertedLeads =
    leads.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() ===
          "converted" ||
        lead?.converted ===
          true ||
        lead?.isConverted ===
          true ||
        Boolean(
          lead?.convertedCustomer
        )
    ).length;

  // ============================================================
  // AVAILABLE SOURCES
  // ============================================================

  const sourceOptions =
    useMemo(() => {
      const uniqueSources =
        new Set();

      leads.forEach(
        (lead) => {
          if (
            lead?.source
          ) {
            uniqueSources.add(
              lead.source
            );
          }
        }
      );

      return Array.from(
        uniqueSources
      ).sort();
    }, [leads]);

  // ============================================================
  // PRIORITY OPTIONS
  // ============================================================

  const priorityOptions =
    [
      "High",
      "Medium",
      "Low",
    ];

  // ============================================================
  // MODAL CLOSE HANDLERS
  // ============================================================

  const handleCloseAddModal =
    () => {
      setShowModal(false);
    };

  const handleCloseEditModal =
    () => {
      setEditLead(null);
    };

  const handleCloseDeleteModal =
    () => {
      setDeleteLeadData(null);
    };

  const handleCloseConvertModal =
    () => {
      if (converting) {
        return;
      }

      setConvertLeadData(
        null
      );
    };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh =
    async () => {
      await loadLeads();

      toast.success(
        "Leads refreshed"
      );
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full min-h-screen bg-slate-50">

      {/* ======================================================
          PAGE CONTENT
      ======================================================= */}

      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <LeadHeader
          onAddLead={() =>
            setShowModal(true)
          }

          onRefresh={
            handleRefresh
          }

          /*
           * IMPORTANT:
           * These two props make the TOP search bar work.
           */

          search={search}

          setSearch={
            handleSearchChange
          }
        />

        {/* ====================================================
            KPI CARDS
        ===================================================== */}

        <div className="mt-6">

          <LeadKPICards
            leads={leads}

            totalLeads={
              totalLeads
            }

            newLeads={
              newLeads
            }

            contactedLeads={
              contactedLeads
            }

            qualifiedLeads={
              qualifiedLeads
            }

            convertedLeads={
              convertedLeads
            }
          />

        </div>

        {/* ====================================================
            FILTER BAR
           
            IMPORTANT:
            There is NO SEARCH INPUT here anymore.
            
            The search is only in the top LeadHeader.
        ===================================================== */}

        <div
          className="
            mt-6
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-sm
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
                STATUS
            =================================================== */}

            <select
              value={
                status
              }
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
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

              <option value="New">
                New
              </option>

              <option value="Interested">
                Interested
              </option>

              <option value="Qualified">
                Qualified
              </option>

              <option value="Lost">
                Lost
              </option>

            </select>

            {/* ==================================================
                SOURCE
            =================================================== */}

            <select
              value={
                source
              }
              onChange={(event) =>
                handleSourceChange(
                  event.target.value
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
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

            {/* ==================================================
                PRIORITY
            =================================================== */}

            <select
              value={
                priority
              }
              onChange={(event) =>
                handlePriorityChange(
                  event.target.value
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
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

            {/* ==================================================
                DATE
            =================================================== */}

            <select
              value={
                dateFilter
              }
              onChange={(event) =>
                handleDateFilterChange(
                  event.target.value
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

            {/* ==================================================
                CLEAR
            =================================================== */}

            <button
              type="button"
              onClick={
                handleClearFilters
              }
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

        {/* ====================================================
            RESULTS COUNT
        ===================================================== */}

        <div
          className="
            mt-4
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="text-sm text-slate-600">

            Showing{" "}

            <span
              className="
                font-semibold
                text-slate-900
              "
            >
              {
                filteredLeads.length
              }
            </span>

            {" "}of{" "}

            <span
              className="
                font-semibold
                text-slate-900
              "
            >
              {
                leads.length
              }
            </span>

            {" "}leads

          </div>

          {(search ||
            status ||
            source ||
            priority ||
            dateFilter) && (
            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
              "
            >
              Clear all filters
            </button>
          )}

        </div>

        {/* ====================================================
            TABLE / LOADING / EMPTY STATE
        ===================================================== */}

        <div className="mt-4">

          {/* ==================================================
              LOADING
          =================================================== */}

          {loading ? (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
              "
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-slate-200
                    border-t-blue-600
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Loading leads...
                </p>

              </div>

            </div>

          ) : filteredLeads.length ===
            0 ? (

            /* ==================================================
               EMPTY STATE
            =================================================== */

            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                text-center
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                "
              >
                <span className="text-2xl">
                  👥
                </span>
              </div>

              <h3
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                "
              >
                No leads found
              </h3>

              <p
                className="
                  mt-1
                  max-w-md
                  text-sm
                  text-slate-500
                "
              >
                {leads.length ===
                0
                  ? "You don't have any leads yet. Create your first lead to get started."
                  : "No leads match your current filters. Try changing or clearing the filters."}
              </p>

              {leads.length ===
              0 ? (

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(
                      true
                    )
                  }
                  className="
                    mt-5
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Add Your First Lead
                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="
                    mt-5
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Clear Filters
                </button>

              )}

            </div>

          ) : (

            /* ==================================================
               LEADS TABLE
            =================================================== */

            <LeadTable
              leads={
                filteredLeads
              }

              onViewLead={
                handleViewLead
              }

              onEditLead={
                handleEditLead
              }

              onDeleteLead={
                handleDeleteLead
              }

              onConvertLead={
                handleConvertLead
              }
            />

          )}

        </div>

      </main>

      {/* ======================================================
          ADD LEAD MODAL
      ======================================================= */}

      <AddLeadModal
        open={showModal}
        onClose={
          handleCloseAddModal
        }
        onSubmit={
          handleAddLead
        }
      />

      {/* ======================================================
          EDIT LEAD MODAL
      ======================================================= */}

      <EditLeadModal
        open={!!editLead}
        lead={editLead}
        onClose={
          handleCloseEditModal
        }
        onSubmit={
          handleUpdateLead
        }
      />

      {/* ======================================================
          DELETE LEAD MODAL
      ======================================================= */}

      <DeleteLeadModal
        open={
          !!deleteLeadData
        }
        lead={
          deleteLeadData
        }
        onClose={
          handleCloseDeleteModal
        }
        onConfirm={
          handleConfirmDelete
        }
      />

      {/* ======================================================
          CONVERT LEAD → CUSTOMER MODAL
      ======================================================= */}

      <ConvertLeadModal
        open={
          !!convertLeadData
        }
        lead={
          convertLeadData
        }
        loading={
          converting
        }
        onClose={
          handleCloseConvertModal
        }
        onConfirm={
          handleConfirmConvert
        }
      />

      {/* ======================================================
          LEAD DETAILS DRAWER
      ======================================================= */}

      <LeadDetailsDrawer
        open={
          !!selectedLead
        }
        lead={
          selectedLead
        }
        onClose={
          handleCloseDetails
        }
        onEdit={
          handleEditLead
        }
        onDelete={
          handleDeleteLead
        }
        onConvert={
          handleConvertLead
        }
      />

    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default Leads;