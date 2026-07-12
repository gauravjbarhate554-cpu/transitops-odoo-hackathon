import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const initialState = {
  vehicle: "",
  issue: "",
  cost: "",
  status: "Draft",
};

export default function MaintenanceForm({
  initialData,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialState);
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

    onSubmit({
      ...formData,
      cost: Number(formData.cost),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Vehicle"
        name="vehicle"
        value={formData.vehicle}
        onChange={handleChange}
        placeholder="MH12AB1234"
        required
      />

      <Input
        label="Issue"
        name="issue"
        value={formData.issue}
        onChange={handleChange}
        placeholder="Engine Oil Change"
        required
      />

      <Input
        label="Cost (₹)"
        name="cost"
        type="number"
        value={formData.cost}
        onChange={handleChange}
        required
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
          <option>Draft</option>
          <option>In Shop</option>
          <option>Completed</option>
        </select>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        {initialData
          ? "Update Record"
          : "Add Record"}
      </Button>
    </form>
  );
}