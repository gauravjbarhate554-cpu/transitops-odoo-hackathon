import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here",
  description = "No data available.",
}) {
  return (
    <div className="rounded-xl border bg-white py-16 text-center">
      <Inbox
        size={44}
        className="mx-auto mb-3 text-slate-400"
      />

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}