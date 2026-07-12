const statusStyles = {
  Available:
    "bg-green-100 text-green-700",

  "On Trip":
    "bg-blue-100 text-blue-700",

  "In Shop":
    "bg-orange-100 text-orange-700",

  Draft:
    "bg-slate-200 text-slate-700",

  Completed:
    "bg-green-100 text-green-700",

  Cancelled:
    "bg-red-100 text-red-700",

  Suspended:
    "bg-red-100 text-red-700",

  Retired:
    "bg-slate-300 text-slate-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${
          statusStyles[status] ??
          "bg-slate-100 text-slate-700"
        }
      `}
    >
      {status}
    </span>
  );
}