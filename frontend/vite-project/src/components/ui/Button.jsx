import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",

  secondary:
    "bg-slate-200 text-slate-900 hover:bg-slate-300",

  success:
    "bg-green-600 text-white hover:bg-green-700",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2
        text-sm
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-blue-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2
          size={16}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}