import { CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back,{" "}
          <span className="font-semibold text-slate-700">
            {user.name}
          </span>
        </p>

        <p className="text-sm text-slate-400">
          {user.role}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <CalendarDays size={18} className="text-blue-600" />

        <div>
          <p className="text-xs text-slate-400">
            Today
          </p>

          <p className="font-medium text-slate-700">
            {today}
          </p>
        </div>
      </div>
    </div>
  );
}