import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-slate-200 hover:bg-slate-300 text-slate-900",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  success:
    "bg-green-600 hover:bg-green-700 text-white",

  outline:
    "border border-slate-300 bg-white hover:bg-slate-50",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
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
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}

      {children}
    </button>
  );
}