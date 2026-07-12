import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function VehicleForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Registration Number"
        placeholder="MH12AB1234"
      />

      <Input
        label="Vehicle Model"
        placeholder="Tata Ace"
      />

      <Input
        label="Capacity"
        type="number"
      />

      <Button className="w-full">
        Save Vehicle
      </Button>
    </form>
  );
}