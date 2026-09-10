import { useEffect } from "react";
import { X } from "lucide-react";

// ============================================================
// REUSABLE MODAL
// Renders centered dialog with backdrop, escape-to-close and
// scroll lock while open.
// ============================================================

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
      "
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (closeOnBackdrop) onClose?.();
        }}
      />

      {/* PANEL */}
      <div
        className={`
          relative w-full ${SIZE_CLASSES[size] || SIZE_CLASSES.md}
          bg-white rounded-2xl shadow-xl
          max-h-[90vh] flex flex-col
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="px-5 py-4 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
