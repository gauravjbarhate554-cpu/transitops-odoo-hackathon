import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";

import { maintenance } from "../../mock/maintenance";

export default function RecentMaintenance() {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Maintenance
        </h2>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Vehicle
              </th>

              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Issue
              </th>

              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Cost
              </th>

              <th className="py-3 text-left text-sm font-semibold text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {maintenance.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="py-4 font-medium">
                  {item.vehicle}
                </td>

                <td>{item.issue}</td>

                <td>₹ {item.cost}</td>

                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}