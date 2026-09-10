import LeadForm from "./LeadForm";

function EditLeadModal({
  open,
  lead,
  onClose,
  onSubmit
}) {

  // ============================================================
  // DO NOT RENDER WHEN CLOSED
  // ============================================================

  if (!open || !lead) {
    return null;
  }


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (data) => {

    try {

      await onSubmit(
        lead._id,
        data
      );

    } catch (error) {

      console.error(
        "Edit lead modal error:",
        error
      );

    }

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            px-6
            py-5
            border-b
            border-gray-200
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-gray-800
              "
            >
              Edit Lead
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Update the lead information below.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-800
              transition
              text-xl
            "
          >
            ×
          </button>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="p-6">

          <LeadForm

            defaultValues={lead}

            onSubmit={handleSubmit}

            onClose={onClose}

          />

        </div>

      </div>

    </div>

  );

}

export default EditLeadModal;