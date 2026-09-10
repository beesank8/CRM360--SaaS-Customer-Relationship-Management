import {
  Users,
  UserPlus,
  BadgeCheck,
  XCircle,
  Percent,
} from "lucide-react";


// ============================================================
// LEAD KPI CARDS
// ============================================================

function LeadKPICards({
  leads = [],
  data = null,
}) {

  // ==========================================================
  // NORMALIZE LEADS
  // ==========================================================

  const leadList =
    Array.isArray(leads)
      ? leads
      : [];


  // ==========================================================
  // LIVE LEAD STATS
  // ==========================================================

  const totalLeads =
    leadList.length;


  // ----------------------------------------------------------
  // NEW
  // ----------------------------------------------------------

  const newLeads =
    leadList.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() === "new"
    ).length;


  // ----------------------------------------------------------
  // INTERESTED
  // ----------------------------------------------------------

  const interestedLeads =
    leadList.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() === "interested"
    ).length;


  // ----------------------------------------------------------
  // QUALIFIED
  // ----------------------------------------------------------

  const qualifiedLeads =
    leadList.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() === "qualified"
    ).length;


  // ----------------------------------------------------------
  // LOST
  // ----------------------------------------------------------

  const lostLeads =
    leadList.filter(
      (lead) =>
        String(
          lead?.status || ""
        )
          .trim()
          .toLowerCase() === "lost"
    ).length;


  // ----------------------------------------------------------
  // CONVERTED
  // ----------------------------------------------------------
  //
  // Supports old/legacy converted records as well.
  //
  // ----------------------------------------------------------

  const convertedLeads =
    leadList.filter(
      (lead) => {

        const status =
          String(
            lead?.status || ""
          )
            .trim()
            .toLowerCase();

        return (
          status === "converted" ||
          lead?.converted === true ||
          lead?.isConverted === true ||
          Boolean(
            lead?.convertedCustomer
          )
        );

      }
    ).length;


  // ==========================================================
  // CONVERSION RATE
  // ==========================================================

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (convertedLeads /
            totalLeads) *
            100
        )
      : 0;


  // ==========================================================
  // OPTIONAL DATA SUPPORT
  // ==========================================================
  //
  // The component primarily uses `leads`.
  //
  // `data` is supported so the component remains compatible
  // with the previous Leads.jsx implementation.
  //
  // ==========================================================

  const displayTotalLeads =
    leadList.length > 0
      ? totalLeads
      : Number(
          data?.totalLeads ?? 0
        );


  const displayNewLeads =
    leadList.length > 0
      ? newLeads
      : Number(
          data?.newLeads ?? 0
        );


  const displayInterestedLeads =
    leadList.length > 0
      ? interestedLeads
      : Number(
          data?.interestedLeads ?? 0
        );


  const displayQualifiedLeads =
    leadList.length > 0
      ? qualifiedLeads
      : Number(
          data?.qualifiedLeads ?? 0
        );


  const displayLostLeads =
    leadList.length > 0
      ? lostLeads
      : Number(
          data?.lostLeads ?? 0
        );


  const displayConversion =
    leadList.length > 0
      ? conversionRate
      : Number(
          data?.conversionRate ?? 0
        );


  // ==========================================================
  // CARDS
  // ==========================================================

  const cards = [

    {
      title: "Total Leads",

      value:
        displayTotalLeads,

      icon:
        <Users size={22} />,

      color:
        "bg-blue-100 text-blue-600",
    },


    {
      title: "New Leads",

      value:
        displayNewLeads,

      icon:
        <UserPlus size={22} />,

      color:
        "bg-purple-100 text-purple-600",
    },


    {
      title: "Interested",

      value:
        displayInterestedLeads,

      icon:
        <BadgeCheck size={22} />,

      color:
        "bg-yellow-100 text-yellow-600",
    },


    {
      title: "Qualified",

      value:
        displayQualifiedLeads,

      icon:
        <BadgeCheck size={22} />,

      color:
        "bg-indigo-100 text-indigo-600",
    },


    {
      title: "Lost",

      value:
        displayLostLeads,

      icon:
        <XCircle size={22} />,

      color:
        "bg-red-100 text-red-600",
    },


    {
      title: "Conversion",

      value:
        `${displayConversion}%`,

      icon:
        <Percent size={22} />,

      color:
        "bg-green-100 text-green-600",
    },

  ];


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-6
        gap-4
        w-full
      "
    >

      {cards.map(
        (card) => (

          <div
            key={card.title}
            className="
              bg-white
              dark:bg-gray-900
              rounded-xl
              border
              border-gray-200
              dark:border-gray-800
              shadow-sm
              p-5
              hover:shadow-md
              transition
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >

              {/* ============================================
                  TEXT
              ============================================ */}

              <div className="min-w-0">

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    whitespace-nowrap
                  "
                >
                  {card.title}
                </p>


                <h2
                  className="
                    text-2xl
                    font-bold
                    mt-2
                    text-gray-800
                    dark:text-white
                  "
                >
                  {card.value}
                </h2>

              </div>


              {/* ============================================
                  ICON
              ============================================ */}

              <div
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  shrink-0
                  ${card.color}
                `}
              >
                {card.icon}
              </div>

            </div>

          </div>

        )
      )}

    </div>

  );
}


// ============================================================
// EXPORT
// ============================================================

export default LeadKPICards;