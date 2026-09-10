import {
  X,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  BadgeDollarSign,
  Target,
  StickyNote,
  User,
  Users,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function LeadDetailsDrawer({
  lead,
  onClose,
  onEditLead,
  onDeleteLead,
}) {
  if (!lead) return null;

  // ============================================================
  // INITIALS
  // ============================================================

  const initials = lead.name
    ? lead.name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "LD";

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // STATUS COLORS
  // ============================================================

  const statusColor = {
    New: "bg-green-100 text-green-700",
    Contacted: "bg-yellow-100 text-yellow-700",
    Interested: "bg-blue-100 text-blue-700",
    Qualified: "bg-purple-100 text-purple-700",
    Won: "bg-emerald-100 text-emerald-700",
    Lost: "bg-red-100 text-red-700",
  };

  // ============================================================
  // PRIORITY COLORS
  // ============================================================

  const priorityColor = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  // ============================================================
  // CONVERTED CHECK
  // ============================================================

  const isConverted =
    lead.converted === true ||
    lead.isConverted === true ||
    Boolean(lead.convertedCustomer) ||
    String(lead.status || "")
      .trim()
      .toLowerCase() === "converted";

  // ============================================================
  // EDIT HANDLER
  // ============================================================

  const handleEdit = () => {
    if (isConverted) return;

    if (typeof onEditLead === "function") {
      onEditLead(lead);
    }
  };

  // ============================================================
  // DELETE HANDLER
  // IMPORTANT:
  // Pass the COMPLETE lead object.
  // LeadsPage.handleDeleteLead() expects lead._id.
  // ============================================================

  const handleDelete = () => {
    if (isConverted) return;

    if (typeof onDeleteLead === "function") {
      onDeleteLead(lead);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* ======================================================
            BACKDROP
        ====================================================== */}

        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />

        {/* ======================================================
            DRAWER
        ====================================================== */}

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25 }}
          className="
            absolute
            right-0
            top-0
            h-screen
            w-[480px]
            max-w-full
            bg-white
            shadow-2xl
            flex
            flex-col
          "
        >
          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="p-5 border-b border-gray-300 shrink-0">
            <div className="flex items-start justify-between gap-4">
              {/* PROFILE */}

              <div className="flex gap-3 items-center min-w-0">
                {/* AVATAR */}

                <div
                  className="
                    w-14
                    h-14
                    shrink-0
                    rounded-full
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-lg
                  "
                >
                  {initials}
                </div>

                {/* INFORMATION */}

                <div className="min-w-0">
                  <h2
                    className="
                      font-bold
                      text-lg
                      text-gray-900
                      truncate
                    "
                  >
                    {lead.name || "Unnamed Lead"}
                  </h2>

                  <p className="text-sm text-gray-500 truncate">
                    {lead.designation || "Decision Maker"}
                  </p>

                  <p className="text-sm font-medium text-gray-800 truncate">
                    {lead.company || "-"}
                  </p>

                  {/* STATUS + PRIORITY */}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          statusColor[lead.status] ||
                          "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {lead.status || "New"}
                    </span>

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          priorityColor[lead.priority] ||
                          "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      🔥 {lead.priority || "Medium"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close lead details"
                className="
                  shrink-0
                  p-2
                  rounded-lg
                  text-gray-700
                  hover:bg-gray-100
                  hover:text-gray-900
                  transition
                "
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ====================================================
              CONTENT
          ==================================================== */}

          <div
            className="
              flex-1
              p-5
              space-y-3
              overflow-hidden
            "
          >
            {/* ==================================================
                TOP CARDS
            ================================================== */}

            <div className="grid grid-cols-2 gap-3">
              {/* CONTACT */}

              <Card
                title="Contact"
                icon={<User size={16} />}
              >
                <Item
                  icon={<Mail size={21} />}
                  value={lead.email}
                />

                <Item
                  icon={<Phone size={21} />}
                  value={lead.phone}
                />

                <Item
                  icon={<MapPin size={21} />}
                  value={lead.location}
                />
              </Card>

              {/* LEAD INFORMATION */}

              <Card
                title="Lead Information"
                icon={<Users size={16} />}
              >
                <Tag
                  label="Source"
                  value={lead.source}
                />

                <Tag
                  label="Industry"
                  value={lead.industry}
                />

                <Tag
                  label="Created"
                  value={formatDate(lead.createdAt)}
                />
              </Card>

              {/* OPPORTUNITY */}

              <Card
                title="Opportunity"
                icon={<BadgeDollarSign size={16} />}
                highlight
              >
                <p className="text-2xl font-bold text-green-600">
                  ₹
                  {Number(
                    lead.expectedValue || 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-gray-500">
                  Expected Revenue
                </p>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-blue-600
                    font-semibold
                  "
                >
                  <Target size={16} />

                  {lead.probability || 0}%
                </div>
              </Card>

              {/* NOTES */}

              <Card
                title="Notes"
                icon={<StickyNote size={16} />}
              >
                <p
                  className="
                    text-sm
                    text-gray-600
                    line-clamp-4
                  "
                >
                  {lead.notes || "No notes added"}
                </p>
              </Card>
            </div>

            {/* ==================================================
                LOWER DETAILS
            ================================================== */}

            <div
              className="
                bg-gray-50
                rounded-xl
                p-3
                grid
                grid-cols-2
                gap-3
                text-sm
              "
            >
              <div>
                <p className="text-gray-400 text-xs">
                  Website
                </p>

                <p className="font-medium text-gray-800 truncate">
                  {lead.website || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">
                  Owner
                </p>

                <p className="font-medium text-gray-800 truncate">
                  {lead.leadOwner || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">
                  Assigned
                </p>

                <p className="font-medium text-gray-800 truncate">
                  {lead.assignedTo || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">
                  Follow Up
                </p>

                <p className="font-medium text-gray-800">
                  {formatDate(lead.followUpDate)}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              FOOTER ACTIONS
          ==================================================== */}

          <div
            className="
              shrink-0
              border-t
              border-gray-300
              bg-white
              p-4
              flex
              gap-3
            "
          >
            {/* ==================================================
                EDIT BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={handleEdit}
              disabled={isConverted}
              className="
                flex-1
                h-14
                rounded-xl
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                text-base
                shadow-sm
                transition-all
                duration-200
                hover:bg-blue-700
                hover:shadow-md
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:bg-blue-600
              "
            >
              <Pencil size={18} strokeWidth={2.2} />

              <span>Edit</span>
            </button>

            {/* ==================================================
                DELETE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={handleDelete}
              disabled={isConverted}
              className="
                flex-1
                h-14
                rounded-xl
                bg-red-50
                border
                border-red-100
                text-red-600
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                text-base
                transition-all
                duration-200
                hover:bg-red-100
                hover:border-red-200
                hover:text-red-700
                hover:shadow-sm
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:bg-red-50
              "
            >
              <Trash2 size={18} strokeWidth={2.2} />

              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================
// CARD COMPONENT
// ============================================================

function Card({
  title,
  icon,
  children,
  highlight = false,
}) {
  return (
    <div
      className={`
        rounded-xl
        p-3
        border
        ${
          highlight
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-100"
        }
      `}
    >
      <div
        className="
          flex
          items-center
          gap-2
          font-semibold
          text-sm
          text-gray-800
          mb-2
        "
      >
        {icon}

        {title}
      </div>

      {children}
    </div>
  );
}

// ============================================================
// ITEM COMPONENT
// ============================================================

function Item({
  icon,
  value,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-xs
        text-gray-600
        mb-2
        min-w-0
      "
    >
      <span className="shrink-0">
        {icon}
      </span>

      <span className="truncate">
        {value || "-"}
      </span>
    </div>
  );
}

// ============================================================
// TAG COMPONENT
// ============================================================

function Tag({
  label,
  value,
}) {
  return (
    <div className="text-xs mb-2">
      <p className="text-gray-400">
        {label}
      </p>

      <p className="font-medium text-gray-800 truncate">
        {value || "-"}
      </p>
    </div>
  );
}

export default LeadDetailsDrawer;