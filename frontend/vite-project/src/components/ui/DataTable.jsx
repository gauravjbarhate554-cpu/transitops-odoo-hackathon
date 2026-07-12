import EmptyState from "./EmptyState";

export default function DataTable({
  columns = [],
  data = [],
  emptyTitle = "No Data Found",
  emptyDescription = "There are no records to display.",
}) {
  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className="px-6 py-4 text-sm text-slate-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}