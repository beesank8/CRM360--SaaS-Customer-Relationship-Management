import {
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";


// ============================================================
// CONVERT LEAD MODAL
// ============================================================

function ConvertLeadModal({
  open,
  lead,
  onClose,
  onConfirm,
  loading = false,
}) {

  if (!open || !lead) {
    return null;
  }


  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const formatMoney = (value) => {

    const amount =
      Number(value || 0);

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget
        ) {
          if (!loading) {
            onClose();
          }
        }

      }}
    >

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          shadow-2xl
          overflow-hidden
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            px-6
            py-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-green-100
              "
            >

              <CheckCircle2
                size={21}
                className="
                  text-green-600
                "
              />

            </div>

            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-gray-900
                "
              >
                Convert Lead
              </h2>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Create a customer from this lead
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() => {
              if (!loading) {
                onClose();
              }
            }}
            disabled={loading}
            className="
              rounded-lg
              p-2
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* ==================================================
            BODY
        ================================================== */}

        <div
          className="
            px-6
            py-5
          "
        >

          <p
            className="
              text-sm
              leading-6
              text-gray-600
            "
          >
            Are you sure you want to convert
            <span
              className="
                mx-1
                font-bold
                text-gray-900
              "
            >
              {lead.name}
            </span>
            into a customer?
          </p>


          {/* ==================================================
              LEAD SUMMARY
          ================================================== */}

          <div
            className="
              mt-4
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-4
            "
          >

            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Company
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  {lead.company || "-"}
                </p>

              </div>


              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Deal Value
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-green-600
                  "
                >
                  {formatMoney(
                    lead.expectedValue
                  )}
                </p>

              </div>


              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Email
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-gray-700
                  "
                >
                  {lead.email || "-"}
                </p>

              </div>


              <div>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Probability
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  {Number(
                    lead.probability || 0
                  )}%
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              WARNING
          ================================================== */}

          <div
            className="
              mt-4
              flex
              gap-3
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              p-3
            "
          >

            <AlertTriangle
              size={18}
              className="
                mt-0.5
                shrink-0
                text-amber-600
              "
            />

            <p
              className="
                text-xs
                leading-5
                text-amber-800
              "
            >
              This will create a new customer and
              mark the lead as converted.
            </p>

          </div>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-gray-200
            bg-gray-50
            px-6
            py-4
          "
        >

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded-xl
              bg-green-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {loading
              ? "Converting..."
              : "Convert to Customer"}

          </button>

        </div>

      </div>

    </div>
  );
}


export default ConvertLeadModal;