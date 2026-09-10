import {
  Eye,
  UserCheck,
  Pencil,
  Trash2,
} from "lucide-react";


// ============================================================
// LEAD TABLE
// ============================================================

function LeadTable({
  leads = [],
  loading = false,
  onViewLead,
  onConvertLead,
  onEditLead,
  onDeleteLead,
}) {

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================================
  // MONEY FORMAT
  // ============================================================

  const formatMoney = (value) => {

    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN")}`;
  };


  // ============================================================
  // STATUS COLORS
  // ============================================================

  const statusColor = (status) => {

    switch (status) {

      case "New":
        return "bg-green-100 text-green-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Interested":
        return "bg-blue-100 text-blue-700";

      case "Qualified":
        return "bg-indigo-100 text-indigo-700";

      case "Negotiation":
        return "bg-purple-100 text-purple-700";

      case "Won":
        return "bg-green-100 text-green-700";

      case "Converted":
        return "bg-emerald-100 text-emerald-700";

      case "Lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // ============================================================
  // PRIORITY COLORS
  // ============================================================

  const priorityColor = (priority) => {

    switch (priority) {

      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // ============================================================
  // VIEW LEAD
  // ============================================================

  const handleView = (lead) => {

    if (
      typeof onViewLead === "function"
    ) {

      onViewLead(lead);

    }
  };


  // ============================================================
  // CONVERT LEAD
  // ============================================================

  const handleConvert = (lead) => {

    if (!lead?._id) {

      console.error(
        "Cannot convert lead: ID missing",
        lead
      );

      return;
    }


    const converted =
      lead.converted === true ||
      lead.isConverted === true ||
      !!lead.convertedCustomer ||
      lead.status === "Converted";


    if (converted) {

      return;

    }


    if (
      typeof onConvertLead !== "function"
    ) {

      console.error(
        "onConvertLead is not connected"
      );

      return;

    }


    onConvertLead(lead);

  };


  // ============================================================
  // EDIT LEAD
  // ============================================================

  const handleEdit = (lead) => {

    const converted =
      lead?.converted === true ||
      lead?.isConverted === true ||
      !!lead?.convertedCustomer ||
      lead?.status === "Converted";


    if (converted) {

      return;

    }


    if (
      typeof onEditLead === "function"
    ) {

      onEditLead(lead);

    }

  };


  // ============================================================
  // DELETE LEAD
  // ============================================================

  const handleDelete = (lead) => {

    if (!lead?._id) {

      console.error(
        "Cannot delete lead: ID missing",
        lead
      );

      return;
    }


    if (
      typeof onDeleteLead === "function"
    ) {

      // IMPORTANT:
      // Send the complete lead object.
      // Leads.jsx expects the complete lead object.

      onDeleteLead(lead);

    }

  };


  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-[250px]
          items-center
          justify-center
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
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-blue-600
              border-t-transparent
            "
          />

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Loading leads...
          </p>

        </div>

      </div>

    );
  }


  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!leads.length) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-10
          text-center
        "
      >

        <p
          className="
            text-sm
            font-semibold
            text-gray-700
          "
        >
          No leads found
        </p>


        <p
          className="
            mt-1
            text-xs
            text-gray-500
          "
        >
          Add a new lead to get started.
        </p>

      </div>

    );

  }


  // ============================================================
  // TABLE
  // ============================================================

  return (

    <div
      className="
        w-full
        overflow-x-auto
        rounded-2xl
        border
        border-gray-200
        bg-white
      "
    >

      <table
        className="
          min-w-[1150px]
          w-full
        "
      >

        {/* ======================================================
            TABLE HEADER
        ====================================================== */}

        <thead
          className="
            border-b
            border-gray-200
            bg-gray-50
          "
        >

          <tr>

            {/* ==================================================
                SERIAL NUMBER
            ================================================== */}

            <th
              className="
                w-16
                px-4
                py-4
                text-center
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              S.No.
            </th>


            {/* ==================================================
                LEAD
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Lead
            </th>


            {/* ==================================================
                COMPANY
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Company
            </th>


            {/* ==================================================
                CREATED
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Created
            </th>


            {/* ==================================================
                STATUS
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Status
            </th>


            {/* ==================================================
                PRIORITY
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Priority
            </th>


            {/* ==================================================
                DEAL VALUE
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Deal Value
            </th>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <th
              className="
                px-4
                py-4
                text-center
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Actions
            </th>

          </tr>

        </thead>


        {/* ======================================================
            TABLE BODY
        ====================================================== */}

        <tbody>

          {leads.map((lead, index) => {

            // ==================================================
            // CONVERSION CHECK
            // ==================================================

            const converted =
              lead?.converted === true ||
              lead?.isConverted === true ||
              !!lead?.convertedCustomer ||
              lead?.status === "Converted";


            // ==================================================
            // DISPLAY NAME
            // ==================================================

            const displayName =
              lead?.name ||
              lead?.fullName ||
              [
                lead?.firstName || "",
                lead?.lastName || "",
              ]
                .join(" ")
                .trim() ||
              "Unnamed Lead";


            return (

              <tr
                key={lead?._id || index}
                className="
                  border-b
                  border-gray-100
                  last:border-b-0
                  hover:bg-gray-50
                "
              >

                {/* ==================================================
                    SERIAL NUMBER
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                    text-center
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  {index + 1}
                </td>


                {/* ==================================================
                    LEAD
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                  "
                >

                  <div>

                    <p
                      className="
                        font-semibold
                        text-gray-900
                      "
                    >
                      {displayName}
                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      {lead?.email || "-"}
                    </p>


                    {lead?.phone && (

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-400
                        "
                      >
                        {lead.phone}
                      </p>

                    )}

                  </div>

                </td>


                {/* ==================================================
                    COMPANY
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                    text-sm
                    text-gray-700
                  "
                >
                  {lead?.company || "-"}
                </td>


                {/* ==================================================
                    CREATED
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                    text-sm
                    text-gray-700
                  "
                >
                  {formatDate(
                    lead?.createdAt
                  )}
                </td>


                {/* ==================================================
                    STATUS
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                  "
                >

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${statusColor(
                        lead?.status
                      )}
                    `}
                  >
                    {lead?.status || "New"}
                  </span>

                </td>


                {/* ==================================================
                    PRIORITY
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                  "
                >

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${priorityColor(
                        lead?.priority
                      )}
                    `}
                  >
                    {lead?.priority || "Medium"}
                  </span>

                </td>


                {/* ==================================================
                    DEAL VALUE
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                    font-semibold
                    text-gray-800
                  "
                >
                  {formatMoney(
                    lead?.expectedValue ??
                    lead?.dealValue ??
                    0
                  )}
                </td>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <td
                  className="
                    px-4
                    py-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-center
                      gap-2
                    "
                  >

                    {/* ==========================================
                        VIEW
                    ========================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleView(lead)
                      }
                      title="View Lead"
                      className="
                        flex
                        min-w-[44px]
                        flex-col
                        items-center
                        gap-1
                        text-blue-600
                      "
                    >

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-50
                          transition
                          hover:bg-blue-100
                        "
                      >

                        <Eye
                          size={17}
                        />

                      </div>


                      <span
                        className="
                          text-[10px]
                          font-semibold
                          text-gray-500
                        "
                      >
                        View
                      </span>

                    </button>


                    {/* ==========================================
                        CONVERT
                    ========================================== */}

                    <button
                      type="button"
                      disabled={converted}
                      onClick={() =>
                        handleConvert(lead)
                      }
                      title={
                        converted
                          ? "Already converted"
                          : "Convert Lead"
                      }
                      className="
                        flex
                        min-w-[44px]
                        flex-col
                        items-center
                        gap-1
                        text-green-600
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-green-50
                          transition
                          hover:bg-green-100
                        "
                      >

                        <UserCheck
                          size={17}
                        />

                      </div>


                      <span
                        className="
                          text-[10px]
                          font-semibold
                          text-gray-500
                        "
                      >
                        {converted
                          ? "Converted"
                          : "Convert"}
                      </span>

                    </button>


                    {/* ==========================================
                        EDIT
                    ========================================== */}

                    <button
                      type="button"
                      disabled={converted}
                      onClick={() =>
                        handleEdit(lead)
                      }
                      title={
                        converted
                          ? "Converted lead cannot be edited"
                          : "Edit Lead"
                      }
                      className="
                        flex
                        min-w-[44px]
                        flex-col
                        items-center
                        gap-1
                        text-yellow-600
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-yellow-50
                          transition
                          hover:bg-yellow-100
                        "
                      >

                        <Pencil
                          size={17}
                        />

                      </div>


                      <span
                        className="
                          text-[10px]
                          font-semibold
                          text-gray-500
                        "
                      >
                        Edit
                      </span>

                    </button>


                    {/* ==========================================
                        DELETE
                    ========================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(lead)
                      }
                      title="Delete Lead"
                      className="
                        flex
                        min-w-[44px]
                        flex-col
                        items-center
                        gap-1
                        text-red-600
                      "
                    >

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-red-50
                          transition
                          hover:bg-red-100
                        "
                      >

                        <Trash2
                          size={17}
                        />

                      </div>


                      <span
                        className="
                          text-[10px]
                          font-semibold
                          text-gray-500
                        "
                      >
                        Delete
                      </span>

                    </button>

                  </div>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default LeadTable;