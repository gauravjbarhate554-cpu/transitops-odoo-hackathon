import DashboardHeader from "./DashboardHeader";
import KpiGrid from "./KpiGrid";
import ChartPlaceholder from "./ChartPlaceholder";
import RecentTrips from "./RecentTrips";
import RecentMaintenance from "./RecentMaintenance";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <KpiGrid />

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPlaceholder
          title="Vehicle Status"
          subtitle="Fleet distribution by operational status"
        />

        <ChartPlaceholder
          title="Operational Cost"
          subtitle="Vehicle operational cost overview"
        />
      </section>

      {/* Tables */}
      <section className="grid gap-6 xl:grid-cols-2">
        <RecentTrips />

        <RecentMaintenance />
      </section>
    </div>
  );
}