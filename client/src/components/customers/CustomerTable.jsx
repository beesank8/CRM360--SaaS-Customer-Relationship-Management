import {
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";


// ============================================================
// CUSTOMER TABLE
// ============================================================

function CustomerTable({
  customers,
  onEditCustomer,
  onDeleteCustomer,
  onViewCustomer,
}) {


  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const created = new Date(date);

    if (Number.isNaN(created.getTime())) {
      return "-";
    }

    const day = String(
      created.getDate()
    ).padStart(2, "0");

    const year =
      created.getFullYear();

    return `${day} ${created.toLocaleString(
      "en-IN",
      {
        month: "short",
      }
    )} ${year}`;
  };


  // ============================================================
  // INITIALS
  // ============================================================

  const getInitials = (name) => {

    if (!name) {
      return "CU";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };


  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {

    switch (status) {

      case "Active":

        return `
          bg-emerald-50
          text-emerald-600
          border
          border-emerald-200
        `;


      case "Inactive":

        return `
          bg-gray-100
          text-gray-600
          border
          border-gray-200
        `;


      case "Pending":

        return `
          bg-yellow-50
          text-yellow-600
          border
          border-yellow-200
        `;


      default:

        return `
          bg-blue-50
          text-blue-600
          border
          border-blue-200
        `;
    }
  };


  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!customers || customers.length === 0) {

    return (

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          overflow-hidden
        "
      >

        {/* ======================================================
            TABLE HEADER
        ====================================================== */}

        <div
          className="
            px-5
            py-4
            border-b
            border-gray-100
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-gray-800
              "
            >
              Customers
            </h2>


            <p
              className="
                text-sm
                text-gray-500
                mt-0.5
              "
            >
              Manage and view your customers
            </p>

          </div>


          <span
            className="
              px-3
              py-1.5
              rounded-lg
              bg-blue-50
              text-blue-600
              text-xs
              font-semibold
            "
          >
            0 Customers
          </span>

        </div>


        {/* ======================================================
            EMPTY
        ====================================================== */}

        <div
          className="
            py-16
            text-center
            text-gray-400
            text-sm
          "
        >
          No customers found
        </div>

      </div>

    );
  }


  // ============================================================
  // TABLE
  // ============================================================

  return (

    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      "
    >


      {/* ======================================================
          TABLE HEADER
      ====================================================== */}

      <div
        className="
          px-5
          py-4
          border-b
          border-gray-100
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-bold
              text-gray-800
            "
          >
            Customers
          </h2>


          <p
            className="
              text-sm
              text-gray-500
              mt-0.5
            "
          >
            Manage and view your customers
          </p>

        </div>


        {/* ====================================================
            CUSTOMER COUNT
        ==================================================== */}

        <span
          className="
            px-3
            py-1.5
            rounded-lg
            bg-blue-50
            text-blue-600
            text-xs
            font-semibold
          "
        >

          {customers.length}{" "}

          {customers.length === 1
            ? "Customer"
            : "Customers"}

        </span>

      </div>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="overflow-x-auto">

        <table
          className="
            w-full
            min-w-[950px]
          "
        >


          {/* ==================================================
              TABLE HEAD
          ================================================== */}

          <thead
            className="
              bg-slate-50
              border-b
              border-gray-100
            "
          >

            <tr>


              {/* =================================================
                  SERIAL NUMBER
              ================================================= */}

              <th
                className="
                  w-16
                  px-4
                  py-3.5
                  text-center
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                S.No.
              </th>


              {/* =================================================
                  CUSTOMER
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Customer
              </th>


              {/* =================================================
                  COMPANY
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Company
              </th>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Email
              </th>


              {/* =================================================
                  PHONE
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Phone
              </th>


              {/* =================================================
                  STATUS
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Status
              </th>


              {/* =================================================
                  CREATED
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-left
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Created
              </th>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <th
                className="
                  px-5
                  py-3.5
                  text-center
                  text-[11px]
                  font-bold
                  text-gray-500
                  uppercase
                  tracking-wide
                "
              >
                Actions
              </th>


            </tr>

          </thead>


          {/* ==================================================
              TABLE BODY
          ================================================== */}

          <tbody>


            {customers.map(
              (customer, index) => (

                <tr
                  key={
                    customer._id ||
                    customer.id ||
                    index
                  }
                  className="
                    border-b
                    border-gray-100
                    last:border-b-0
                    hover:bg-blue-50/30
                    transition
                  "
                >


                  {/* ==========================================
                      SERIAL NUMBER
                  ========================================== */}

                  <td
                    className="
                      w-16
                      px-4
                      py-3.5
                      text-center
                      text-sm
                      font-semibold
                      text-gray-500
                    "
                  >
                    {index + 1}
                  </td>


                  {/* ==========================================
                      CUSTOMER
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >


                      {/* AVATAR */}

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-blue-100
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-sm
                          shrink-0
                        "
                      >

                        {getInitials(
                          customer.name
                        )}

                      </div>


                      {/* NAME */}

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            font-semibold
                            text-gray-900
                            text-sm
                            truncate
                            max-w-[180px]
                          "
                          title={
                            customer.name ||
                            "-"
                          }
                        >

                          {customer.name || "-"}

                        </p>


                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-0.5
                          "
                        >

                          Customer

                        </p>

                      </div>

                    </div>

                  </td>


                  {/* ==========================================
                      COMPANY
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                        truncate
                        max-w-[160px]
                      "
                      title={
                        customer.company ||
                        "-"
                      }
                    >

                      {customer.company || "-"}

                    </p>

                  </td>


                  {/* ==========================================
                      EMAIL
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-gray-700
                        truncate
                        max-w-[200px]
                      "
                      title={
                        customer.email ||
                        "-"
                      }
                    >

                      {customer.email || "-"}

                    </p>

                  </td>


                  {/* ==========================================
                      PHONE
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-gray-700
                      "
                    >

                      {customer.phone || "-"}

                    </p>

                  </td>


                  {/* ==========================================
                      STATUS
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${getStatusStyle(
                          customer.status ||
                          "Active"
                        )}
                      `}
                    >

                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-current
                        "
                      />

                      {customer.status ||
                        "Active"}

                    </span>

                  </td>


                  {/* ==========================================
                      CREATED
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3.5
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-gray-600
                      "
                    >

                      {formatDate(
                        customer.createdAt
                      )}

                    </p>

                  </td>


                  {/* ==========================================
                      ACTIONS
                  ========================================== */}

                  <td
                    className="
                      px-5
                      py-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >


                      {/* ====================================
                          VIEW
                      ==================================== */}

                      <button
                        type="button"

                        onClick={() => {

                          if (
                            onViewCustomer
                          ) {

                            onViewCustomer(
                              customer
                            );

                          }

                        }}

                        title="View Customer"

                        className="
                          w-11
                          h-11
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          flex
                          flex-col
                          items-center
                          justify-center
                          gap-0.5
                          transition
                        "
                      >

                        <Eye
                          size={16}
                        />

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            leading-none
                          "
                        >
                          View
                        </span>

                      </button>


                      {/* ====================================
                          EDIT
                      ==================================== */}

                      <button
                        type="button"

                        onClick={() => {

                          if (
                            onEditCustomer
                          ) {

                            onEditCustomer(
                              customer
                            );

                          }

                        }}

                        title="Edit Customer"

                        className="
                          w-11
                          h-11
                          rounded-lg
                          bg-yellow-50
                          text-yellow-600
                          hover:bg-yellow-100
                          flex
                          flex-col
                          items-center
                          justify-center
                          gap-0.5
                          transition
                        "
                      >

                        <Pencil
                          size={16}
                        />

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            leading-none
                          "
                        >
                          Edit
                        </span>

                      </button>


                      {/* ====================================
                          DELETE
                      ==================================== */}

                      <button
                        type="button"

                        onClick={() => {

                          if (
                            onDeleteCustomer
                          ) {

                            onDeleteCustomer(
                              customer._id
                            );

                          }

                        }}

                        title="Delete Customer"

                        className="
                          w-11
                          h-11
                          rounded-lg
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          flex
                          flex-col
                          items-center
                          justify-center
                          gap-0.5
                          transition
                        "
                      >

                        <Trash2
                          size={16}
                        />

                        <span
                          className="
                            text-[9px]
                            font-semibold
                            leading-none
                          "
                        >
                          Delete
                        </span>

                      </button>


                    </div>

                  </td>


                </tr>

              )
            )}


          </tbody>


        </table>

      </div>


    </div>

  );

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default CustomerTable;