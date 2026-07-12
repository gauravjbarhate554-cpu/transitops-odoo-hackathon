import { Pencil, Trash2 } from "lucide-react";

import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

export default function MaintenanceTable({
  maintenance,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      header: "Vehicle",
      accessor: "vehicle",
    },
    {
      header: "Issue",
      accessor: "issue",
    },
    {
      header: "Cost",
      render: (row) => <>₹ {row.cost}</>,
    },
    {
      header: "Status",
      render: (row) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row)}
            className="rounded p-2 text-blue-600 hover:bg-blue-50"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(row)}
            className="rounded p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={maintenance}
    />
  );
}