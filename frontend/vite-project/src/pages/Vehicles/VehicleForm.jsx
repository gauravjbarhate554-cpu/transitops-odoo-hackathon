import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const initialState = {
  registration: "",
  model: "",
  capacity: "",
  status: "Available",
};

export default function VehicleForm({
  initialData,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit?.({
      ...formData,
      capacity: Number(formData.capacity),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Registration Number"
        id="registration"
        name="registration"
        required
        value={formData.registration}
        onChange={handleChange}
        placeholder="MH12AB1234"
      />

      <Input
        label="Vehicle Model"
        id="model"
        name="model"
        required
        value={formData.model}
        onChange={handleChange}
        placeholder="Tata Ace"
      />

      <Input
        label="Capacity (kg)"
        id="capacity"
        name="capacity"
        type="number"
        required
        value={formData.capacity}
        onChange={handleChange}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
          <option>Retired</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          loading={loading}
        >
          {initialData
            ? "Update Vehicle"
            : "Add Vehicle"}
        </Button>
      </div>
    </form>
  );
}