export default function Input({
  id,
  label,
  required = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full
          rounded-lg
          border
          px-3
          py-2
          outline-none
          transition-all
          duration-200
          ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }
          disabled:bg-slate-100
          disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}