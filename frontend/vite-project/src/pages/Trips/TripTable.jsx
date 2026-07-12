import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

export default function TripTable({
  trips,
  loading,
  onDispatch,
  onComplete,
  onCancel,
}) {
  const columns = [
    {
      header: "Source",
      accessor: "source",
    },
    {
      header: "Destination",
      accessor: "destination",
    },
    {
      header: "Vehicle",
      accessor: "vehicle",
    },
    {
      header: "Driver",
      accessor: "driver",
    },
    {
      header: "Status",
      render: (trip) => (
        <StatusBadge status={trip.status} />
      ),
    },
    {
      header: "Actions",
      render: (trip) => {
        const isDraft = trip.status === "Draft";
        const isOnTrip = trip.status === "On Trip";
        const isCompleted = trip.status === "Completed";
        const isCancelled = trip.status === "Cancelled";

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              disabled={!isDraft}
              onClick={(e) => {
                e.stopPropagation();
                onDispatch(trip);
              }}
            >
              Dispatch
            </Button>

            <Button
              variant="success"
              disabled={!isOnTrip}
              onClick={(e) => {
                e.stopPropagation();
                onComplete(trip);
              }}
            >
              Complete
            </Button>

            <Button
              variant="danger"
              disabled={isCompleted || isCancelled}
              onClick={(e) => {
                e.stopPropagation();
                onCancel(trip);
              }}
            >
              Cancel
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={trips}
      loading={loading}
      emptyTitle="No Trips"
      emptyDescription="Create your first trip to get started."
    />
  );
}