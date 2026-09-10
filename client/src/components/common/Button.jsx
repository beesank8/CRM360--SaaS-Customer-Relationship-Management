import { Loader2 } from "lucide-react";

// ============================================================
// REUSABLE BUTTON
// Variants: primary | secondary | danger | ghost | outline
// Sizes: sm | md | lg
// ============================================================

const VARIANT_CLASSES = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:bg-indigo-300",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300",
  outline:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400 disabled:text-gray-300",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400 disabled:text-gray-300",
};

const SIZE_CLASSES = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary}
        ${SIZE_CLASSES[size] || SIZE_CLASSES.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
      )}

      {!loading && Icon && iconPosition === "left" && (
        <Icon size={size === "sm" ? 14 : 16} />
      )}

      {children}

      {!loading && Icon && iconPosition === "right" && (
        <Icon size={size === "sm" ? 14 : 16} />
      )}
    </button>
  );
}

export default Button;
