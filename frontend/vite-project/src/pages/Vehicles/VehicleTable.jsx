import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

export default function VehicleTable({ vehicles }) {
  const columns = [
    {
      header: "Registration",
      accessor: "registration",
    },
    {
      header: "Model",
      accessor: "model",
    },
    {
      header: "Capacity",
      accessor: "capacity",
    },
    {
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline">
            Edit
          </button>

          <button className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
    />
  );
}