import {
  X,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  CalendarDays,
  User,
  Globe,
  Flag,
  IndianRupee,
  ShieldCheck,
  Moon,
  Clock,
  FileText,
  Users,
  Target,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  highlight = false,
  highlightType = "",
  darkMode = false,
}) {
  const cardTheme = darkMode
    ? "bg-[#11192b] border-slate-800"
    : "bg-slate-50 border-slate-200";

  const mutedTheme = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  const drawerTheme = darkMode
    ? "bg-[#070b18] text-white"
    : "bg-white text-slate-900";

  let cardClass = cardTheme;

  if (highlightType === "revenue") {
    cardClass = darkMode
      ? "bg-emerald-500/10 border-emerald-500/40"
      : "bg-emerald-50 border-emerald-200";
  }

  if (highlightType === "probability") {
    cardClass = darkMode
      ? "bg-blue-500/10 border-blue-500/40"
      : "bg-blue-50 border-blue-200";
  }

  return (
    <div
      className={`
        ${cardClass}
        border
        rounded-lg
        px-2.5
        py-2
        min-h-[54px]
        flex
        items-center
      `}
    >
      <div className="flex items-center gap-2 min-w-0 w-full">

        {/* ICON */}

        <div
          className={`
            w-7
            h-7
            rounded-md
            ${iconBg}
            flex
            items-center
            justify-center
            shrink-0
          `}
        >
          <Icon
            size={14}
            className={iconColor}
          />
        </div>

        {/* TEXT */}

        <div className="min-w-0 flex-1">
          <p
            className={`
              text-[9px]
              uppercase
              tracking-wide
              font-semibold
              ${mutedTheme}
              leading-none
            `}
          >
            {label}
          </p>

          <p
            className={`
              ${
                highlight
                  ? "text-lg font-bold"
                  : "text-xs font-semibold"
              }
              ${
                highlightType === "revenue"
                  ? "text-emerald-600"
                  : highlightType === "probability"
                  ? "text-blue-600"
                  : ""
              }
              ${!highlight ? drawerTheme : ""}
              truncate
              mt-1
            `}
            title={value || "-"}
          >
            {value || "-"}
          </p>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// CUSTOMER DETAILS DRAWER
// ============================================================

function CustomerDetailsDrawer({
  customer,
  onClose,
  onEditCustomer,
  onDeleteCustomer,
}) {
  const [darkMode, setDarkMode] = useState(false);

  // ============================================================
  // NO CUSTOMER
  // ============================================================

  if (!customer) {
    return null;
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // MONEY FORMAT
  // ============================================================

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  // ============================================================
  // INITIALS
  // ============================================================

  const initials =
    customer.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CU";

  // ============================================================
  // CONVERTED LEAD
  // ============================================================

  const lead =
    customer.convertedLead ||
    customer.originalLead ||
    null;

  // ============================================================
  // PROBABILITY
  // ============================================================

  const probability = Math.min(
    Math.max(
      Number(lead?.probability || 0),
      0
    ),
    100
  );

  // ============================================================
  // THEME
  // ============================================================

  const theme = {
    drawer:
      darkMode
        ? "bg-[#070b18] text-white"
        : "bg-white text-slate-900",

    header:
      darkMode
        ? "bg-[#101728]"
        : "bg-white",

    border:
      darkMode
        ? "border-slate-800"
        : "border-slate-200",

    muted:
      darkMode
        ? "text-slate-400"
        : "text-slate-500",

    card:
      darkMode
        ? "bg-[#11192b] border-slate-800"
        : "bg-slate-50 border-slate-200",

    lowerCard:
      darkMode
        ? "bg-[#101728] border-slate-800"
        : "bg-slate-50 border-slate-200",

    button:
      darkMode
        ? "bg-slate-800"
        : "bg-slate-100",
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <AnimatePresence>

      {/* ========================================================
          OVERLAY
      ======================================================== */}

      <motion.div
        className="
          fixed
          inset-0
          z-[100]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        {/* BACKDROP */}

        <div
          onClick={onClose}
          className="
            absolute
            inset-0
            bg-black/40
          "
        />

        {/* ======================================================
            DRAWER
        ====================================================== */}

        <motion.div
          initial={{
            x: "100%",
          }}
          animate={{
            x: 0,
          }}
          exit={{
            x: "100%",
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
          className={`
            absolute
            right-0
            top-0
            w-[480px]
            max-w-[94vw]
            max-h-screen
            ${theme.drawer}
            shadow-2xl
            border-l
            ${theme.border}
            rounded-l-xl
            overflow-hidden
            flex
            flex-col
          `}
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className={`
              ${theme.header}
              border-b
              ${theme.border}
              px-4
              py-3
              shrink-0
            `}
          >

            <div className="flex items-center justify-between">

              {/* CUSTOMER */}

              <div className="flex items-center gap-3 min-w-0">

                {/* AVATAR */}

                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-lg
                    shrink-0
                  "
                >
                  {initials}
                </div>

                {/* NAME */}

                <div className="min-w-0">

                  <h2
                    className="
                      text-lg
                      font-bold
                      truncate
                    "
                  >
                    {customer.name || "Customer"}
                  </h2>

                  <div
                    className={`
                      flex
                      items-center
                      gap-1
                      text-xs
                      ${theme.muted}
                    `}
                  >
                    <Building2 size={12} />

                    {customer.company || "-"}
                  </div>

                  {/* STATUS */}

                  <div className="flex gap-1.5 mt-1.5">

                    <span
                      className="
                        px-2
                        py-1
                        rounded-full
                        text-[10px]
                        font-semibold
                        bg-emerald-100
                        text-emerald-700
                      "
                    >
                      ● {customer.status || "Active"}
                    </span>

                    {lead && (
                      <span
                        className="
                          px-2
                          py-1
                          rounded-full
                          text-[10px]
                          font-semibold
                          bg-blue-100
                          text-blue-700
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <ShieldCheck size={10} />

                        Converted Lead
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* HEADER ACTIONS */}

              <div className="flex items-center gap-1 shrink-0">

                {/* THEME BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setDarkMode(
                      (prev) => !prev
                    )
                  }
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    ${theme.button}
                    flex
                    items-center
                    justify-center
                    ${theme.muted}
                    hover:bg-slate-200
                    transition
                  `}
                  title="Toggle theme"
                >
                  <Moon size={17} />
                </button>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={onClose}
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    ${theme.muted}
                    hover:bg-slate-100
                    transition
                  `}
                >
                  <X size={20} />
                </button>

              </div>

            </div>

          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              px-3
              py-2.5
              space-y-2.5
              overflow-hidden
            "
          >

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                "
              >

                <div
                  className="
                    w-7
                    h-7
                    rounded-md
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <User size={14} />
                </div>

                <h3
                  className="
                    text-sm
                    font-bold
                    uppercase
                  "
                >
                  Customer Information
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-1.5">

                {/* EMAIL */}

                <InfoCard
                  darkMode={darkMode}
                  icon={Mail}
                  label="Email"
                  value={customer.email}
                />

                {/* PHONE */}

                <InfoCard
                  darkMode={darkMode}
                  icon={Phone}
                  label="Phone"
                  value={customer.phone}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-50"
                />

                {/* COMPANY */}

                <InfoCard
                  darkMode={darkMode}
                  icon={Building2}
                  label="Company"
                  value={customer.company}
                  iconColor="text-purple-600"
                  iconBg="bg-purple-50"
                />

                {/* ADDRESS */}

                <InfoCard
                  darkMode={darkMode}
                  icon={MapPin}
                  label="Address"
                  value={
                    customer.address ||
                    customer.location
                  }
                  iconColor="text-orange-600"
                  iconBg="bg-orange-50"
                />

                {/* OWNER */}

                <InfoCard
                  darkMode={darkMode}
                  icon={User}
                  label="Owner"
                  value="Private"
                  iconColor="text-cyan-600"
                  iconBg="bg-cyan-50"
                />

                {/* CREATED */}

                <InfoCard
                  darkMode={darkMode}
                  icon={CalendarDays}
                  label="Created"
                  value={formatDate(
                    customer.createdAt
                  )}
                  iconColor="text-yellow-600"
                  iconBg="bg-yellow-50"
                />

              </div>

            </div>

            {/* =================================================
                CONVERTED LEAD
            ================================================= */}

            {lead && (

              <div
                className="
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-2.5
                "
              >

                {/* LEAD HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  "
                >

                  <div className="flex items-center gap-2">

                    <div
                      className="
                        w-7
                        h-7
                        rounded-lg
                        bg-blue-600
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Users size={14} />
                    </div>

                    <div>

                      <h3
                        className="
                          text-sm
                          font-bold
                          text-blue-700
                          uppercase
                        "
                      >
                        Converted Lead
                      </h3>

                      <p
                        className="
                          text-[9px]
                          text-slate-500
                        "
                      >
                        Original lead information
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p
                      className="
                        text-[9px]
                        text-slate-500
                      "
                    >
                      Converted
                    </p>

                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-slate-800
                      "
                    >
                      {formatDate(
                        lead.convertedAt ||
                        customer.convertedAt ||
                        customer.createdAt
                      )}
                    </p>

                  </div>

                </div>

                {/* LEAD CARDS */}

                <div className="grid grid-cols-2 gap-1.5">

                  {/* LEAD NAME */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={User}
                    label="Lead Name"
                    value={lead.name}
                  />

                  {/* COMPANY */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={Building2}
                    label="Company"
                    value={lead.company}
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                  />

                  {/* SOURCE */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={Globe}
                    label="Source"
                    value={lead.source}
                    iconColor="text-cyan-600"
                    iconBg="bg-cyan-50"
                  />

                  {/* PRIORITY */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={Flag}
                    label="Priority"
                    value={lead.priority}
                    iconColor="text-red-600"
                    iconBg="bg-red-50"
                  />

                  {/* EXPECTED REVENUE */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={IndianRupee}
                    label="Expected Revenue"
                    value={formatMoney(
                      lead.expectedValue
                    )}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-100"
                    highlight
                    highlightType="revenue"
                  />

                  {/* PROBABILITY */}

                  <div
                    className="
                      bg-blue-50
                      border
                      border-blue-200
                      rounded-lg
                      px-2.5
                      py-2
                      min-h-[54px]
                    "
                  >

                    <div className="flex items-center gap-2">

                      <div
                        className="
                          w-7
                          h-7
                          rounded-md
                          bg-blue-100
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Target
                          size={14}
                          className="
                            text-blue-600
                          "
                        />
                      </div>

                      <div className="flex-1">

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-wide
                            font-semibold
                            text-slate-500
                          "
                        >
                          Probability
                        </p>

                        <p
                          className="
                            text-lg
                            font-bold
                            text-blue-600
                            mt-0.5
                          "
                        >
                          {probability}%
                        </p>

                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div
                      className="
                        h-1
                        bg-blue-100
                        rounded-full
                        mt-1.5
                        overflow-hidden
                      "
                    >

                      <div
                        className="
                          h-full
                          bg-blue-600
                          rounded-full
                        "
                        style={{
                          width:
                            `${probability}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* NOTES */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={FileText}
                    label="Notes"
                    value={
                      lead.notes ||
                      "No notes added"
                    }
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                  />

                  {/* FOLLOW UP */}

                  <InfoCard
                    darkMode={darkMode}
                    icon={Clock}
                    label="Follow Up"
                    value={formatDate(
                      lead.nextFollowUp ||
                      lead.followUpDate
                    )}
                    iconColor="text-orange-600"
                    iconBg="bg-orange-50"
                  />

                </div>

              </div>

            )}

            {/* =================================================
                LOWER DETAILS
            ================================================= */}

            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-lg
                px-3
                py-2
                grid
                grid-cols-2
                gap-x-4
                gap-y-2
              "
            >

              {/* WEBSITE */}

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    text-slate-400
                    font-semibold
                  "
                >
                  Website
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-800
                    truncate
                  "
                >
                  {customer.website ||
                    lead?.website ||
                    "-"}
                </p>

              </div>

              {/* INDUSTRY */}

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    text-slate-400
                    font-semibold
                  "
                >
                  Industry
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-800
                    truncate
                  "
                >
                  {customer.industry ||
                    lead?.industry ||
                    "-"}
                </p>

              </div>

              {/* LOCATION */}

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    text-slate-400
                    font-semibold
                  "
                >
                  Location
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-800
                    truncate
                  "
                >
                  {customer.location ||
                    lead?.location ||
                    "-"}
                </p>

              </div>

              {/* CUSTOMER SINCE */}

              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    text-slate-400
                    font-semibold
                  "
                >
                  Customer Since
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-800
                  "
                >
                  {formatDate(
                    customer.createdAt
                  )}
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className={`
              ${theme.header}
              border-t
              ${theme.border}
              p-2.5
              shrink-0
            `}
          >

            <div className="grid grid-cols-2 gap-2">

              {/* EDIT */}

              <button
                type="button"
                onClick={() =>
                  onEditCustomer(customer)
                }
                className="
                  h-10
                  rounded-lg
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >

                <Pencil size={14} />

                Edit Customer

              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={() =>
                  onDeleteCustomer(
                    customer._id
                  )
                }
                className="
                  h-10
                  rounded-lg
                  bg-red-50
                  border
                  border-red-200
                  text-red-600
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  font-semibold
                  hover:bg-red-100
                  transition
                "
              >

                <Trash2 size={14} />

                Delete Customer

              </button>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}

export default CustomerDetailsDrawer;