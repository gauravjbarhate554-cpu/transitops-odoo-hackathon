import { Bell, Moon, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Welcome to TransitOps
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
          <Bell size={22} className="text-slate-600" />

          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            3
          </span>
        </button>

        {/* Dark Mode (Placeholder) */}
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <Moon size={22} className="text-slate-600" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">
          <UserCircle2 size={36} className="text-blue-600" />

          <div>
            <h4 className="text-sm font-semibold text-slate-800">
              Harshit
            </h4>

            <p className="text-xs text-slate-500">
              Fleet Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}