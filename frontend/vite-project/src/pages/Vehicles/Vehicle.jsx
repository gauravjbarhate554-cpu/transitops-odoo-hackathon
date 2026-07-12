import { useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import VehicleTable from "./VehicleTable";
import VehicleForm from "./VehicleForm";

import { vehicles } from "../../mock/vehicles";

export default function Vehicles() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Management"
        description="Manage fleet vehicles."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} />
            Add Vehicle
          </Button>
        }
      />

      <SearchBar placeholder="Search vehicles..." />

      <VehicleTable vehicles={vehicles} />

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
      >
        <VehicleForm />
      </Modal>
    </div>
  );
}