import { CalendarDays } from "lucide-react";


function DashboardHeader() {

  const today = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );


  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      {/* ==================================================
          LEFT SECTION
      ================================================== */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          Welcome back, Sanket 👋
        </h1>


        <p
          className="
            text-sm
            text-gray-500
            mt-1
          "
        >
          Here's an overview of your CRM360 business performance.
        </p>

      </div>


      {/* ==================================================
          DATE CARD
      ================================================== */}

      <div
        className="
          bg-white
          border
          rounded-xl
          px-4
          py-2
          shadow-sm
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            w-9
            h-9
            rounded-lg
            bg-blue-100
            flex
            items-center
            justify-center
          "
        >

          <CalendarDays
            size={18}
            className="text-blue-600"
          />

        </div>


        <div>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Today
          </p>


          <p
            className="
              text-sm
              font-semibold
              text-gray-800
            "
          >
            {today}
          </p>

        </div>

      </div>

    </div>

  );
}


export default DashboardHeader;