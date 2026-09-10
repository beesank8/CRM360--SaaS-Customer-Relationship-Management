import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeadForm from "./LeadForm";

function AddLeadModal({
  open,
  onClose,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-4xl
              overflow-hidden
            "
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <div>

                <h2 className="text-xl font-bold">
                  Add New Lead
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a potential customer.
                </p>

              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}

            <div className="p-6">

              <LeadForm
                onSubmit={onSubmit}
                onClose={onClose}
              />

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddLeadModal;