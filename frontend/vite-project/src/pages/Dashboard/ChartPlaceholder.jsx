import Card from "../../components/ui/Card";
import { BarChart3 } from "lucide-react";

export default function ChartPlaceholder({
  title,
  subtitle = "Will be replaced with Recharts",
}) {
  return (
    <Card className="h-80">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="flex h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
        <BarChart3
          size={48}
          className="mb-3 text-slate-300"
        />

        <p className="font-medium text-slate-500">
          Chart Coming Soon
        </p>
      </div>
    </Card>
  );
}