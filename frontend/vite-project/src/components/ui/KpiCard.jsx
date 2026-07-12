import Card from "./Card";

export default function KpiCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) {
  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}