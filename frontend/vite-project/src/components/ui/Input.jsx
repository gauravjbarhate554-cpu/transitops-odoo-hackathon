export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          rounded-lg
          border
          border-slate-300
          px-3
          py-2
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
          ${error ? "border-red-500" : ""}
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