import {
  LayoutDashboard,
  Truck,
  UserRound,
  Route,
  Wrench,
  Fuel,
  Wallet,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    path: "/vehicles",
    icon: Truck,
  },
  {
    title: "Drivers",
    path: "/drivers",
    icon: UserRound,
  },
  {
    title: "Trips",
    path: "/trips",
    icon: Route,
  },
  {
    title: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Fuel",
    path: "/fuel",
    icon: Fuel,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: Wallet,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">
          TransitOps
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Smart Transport Platform
        </p>
      </div>

      <nav className="flex-1 mt-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}