import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <Loader2
        size={32}
        className="animate-spin text-blue-600"
      />
    </div>
  );
}