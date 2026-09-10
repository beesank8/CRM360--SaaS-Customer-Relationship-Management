import { Search, Plus } from "lucide-react";

function LeadHeader({
  onAddLead,
  search,
  setSearch,
}) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Leads
        </h1>

        <p className="text-gray-500 mt-1">
          Manage and track potential customers.
        </p>

      </div>

      <div className="flex items-center gap-3">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
  type="text"
  placeholder="Search Leads..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="
    w-72
    pl-10
    pr-4
    py-2.5
    rounded-xl
    border
    border-gray-300
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
/>

        </div>

        <button
  onClick={onAddLead}
  className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    px-5
    py-2.5
    rounded-xl
    flex
    items-center
    gap-2
    font-medium
  "
>
          <Plus size={18} />
          Add Lead
        </button>

      </div>

    </div>
  );
}

export default LeadHeader;