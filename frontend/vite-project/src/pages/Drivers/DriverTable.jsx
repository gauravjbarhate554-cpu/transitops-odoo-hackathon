import { Pencil, Trash2 } from "lucide-react";

import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      header: "Driver",
      accessor: "name",
    },
    {
      header: "License",
      accessor: "license",
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Safety",
      render: (driver) => (
        <span className="font-medium">
          {driver.safety}%
        </span>
      ),
    },
    {
      header: "Status",
      render: (driver) => (
        <StatusBadge status={driver.status} />
      ),
    },
    {
      header: "Actions",
      render: (driver) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(driver);
            }}
            className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(driver);
            }}
            className="rounded-md p-2 text-red-600 transition hover:bg-red-50"
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
      data={drivers}
      emptyTitle="No Drivers"
      emptyDescription="No drivers have been added yet."
    />
  );
}