import {
  Truck,
  CircleCheck,
  Wrench,
  Route,
  ClipboardList,
  Users,
  Gauge,
} from "lucide-react";

import KpiCard from "../../components/ui/KpiCard";
import { dashboardStats } from "../../mock/dashboard";

export default function KpiGrid() {
  const kpis = [
    {
      title: "Active Vehicles",
      value: dashboardStats.activeVehicles,
      icon: <Truck size={28} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Available Vehicles",
      value: dashboardStats.availableVehicles,
      icon: <CircleCheck size={28} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Maintenance",
      value: dashboardStats.maintenance,
      icon: <Wrench size={28} />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Active Trips",
      value: dashboardStats.activeTrips,
      icon: <Route size={28} />,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Pending Trips",
      value: dashboardStats.pendingTrips,
      icon: <ClipboardList size={28} />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Drivers On Duty",
      value: dashboardStats.driversOnDuty,
      icon: <Users size={28} />,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Fleet Utilization",
      value: dashboardStats.fleetUtilization,
      icon: <Gauge size={28} />,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.title}
          {...kpi}
        />
      ))}
    </section>
  );
}