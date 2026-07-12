import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const initialState = {
  name: "",
  license: "",
  category: "",
  expiry: "",
  safety: "",
  status: "Available",
};

export default function DriverForm({
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
      safety: Number(formData.safety),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Driver Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="License Number"
        name="license"
        value={formData.license}
        onChange={handleChange}
        required
      />

      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="HMV / LMV"
      />

      <Input
        label="License Expiry"
        name="expiry"
        type="date"
        value={formData.expiry}
        onChange={handleChange}
      />

      <Input
        label="Safety Score"
        name="safety"
        type="number"
        value={formData.safety}
        onChange={handleChange}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option>Available</option>
          <option>On Duty</option>
          <option>Suspended</option>
        </select>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        {initialData
          ? "Update Driver"
          : "Add Driver"}
      </Button>
    </form>
  );
}