import { useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const initialState = {
  source: "",
  destination: "",
  vehicle: "",
  driver: "",
  cargoWeight: "",
  distance: "",
  revenue: "",
};

export default function TripForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState(initialState);

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
      cargoWeight: Number(formData.cargoWeight),
      distance: Number(formData.distance),
      revenue: Number(formData.revenue),
    });

    setFormData(initialState);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Source"
        name="source"
        value={formData.source}
        onChange={handleChange}
        required
      />

      <Input
        label="Destination"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        required
      />

      <Input
        label="Vehicle"
        name="vehicle"
        value={formData.vehicle}
        onChange={handleChange}
        placeholder="Vehicle Registration"
      />

      <Input
        label="Driver"
        name="driver"
        value={formData.driver}
        onChange={handleChange}
        placeholder="Driver Name"
      />

      <Input
        label="Cargo Weight (kg)"
        name="cargoWeight"
        type="number"
        value={formData.cargoWeight}
        onChange={handleChange}
      />

      <Input
        label="Distance (km)"
        name="distance"
        type="number"
        value={formData.distance}
        onChange={handleChange}
      />

      <Input
        label="Revenue (₹)"
        name="revenue"
        type="number"
        value={formData.revenue}
        onChange={handleChange}
      />

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Create Trip
      </Button>
    </form>
  );
}