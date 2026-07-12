import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";

import VehicleForm from "./VehicleForm";
import VehicleTable from "./VehicleTable";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicleService";

export default function Vehicle() {
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);

      const data = await getVehicles();

      setVehicles(data);
    } catch (error) {
      toast.error("Failed to load vehicles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(vehicle) {
    try {
      if (selectedVehicle) {
        await updateVehicle(selectedVehicle.id, vehicle);

        toast.success("Vehicle updated");
      } else {
        await createVehicle(vehicle);

        toast.success("Vehicle added");
      }

      setIsModalOpen(false);

      setSelectedVehicle(null);

      loadVehicles();
    } catch (error) {
      toast.error("Operation failed");
      console.error(error);
    }
  }

  async function handleDelete(vehicle) {
    const confirmDelete = window.confirm(
      `Delete ${vehicle.registration}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(vehicle.id);

      toast.success("Vehicle deleted");

      loadVehicles();
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  }
  async function handleSave(vehicle) {
    try {

        if(selectedVehicle){
            await updateVehicle(selectedVehicle.id, vehicle);
            toast.success("Vehicle updated");
        }
        else{
            await createVehicle(vehicle);
            toast.success("Vehicle added");
        }

        await loadVehicles();

        setSelectedVehicle(null);

        setIsModalOpen(false);

    } catch(err){

        toast.error("Something went wrong");
    }
}

  function handleEdit(vehicle) {
    setSelectedVehicle(vehicle);

    setIsModalOpen(true);
  }

  function handleAddVehicle() {
    setSelectedVehicle(null);

    setIsModalOpen(true);
  }

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.registration
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    vehicle.model
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Management"
        description="Manage your fleet vehicles"
        action={
          <Button onClick={handleAddVehicle}>
            <Plus size={18} />

            Add Vehicle
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vehicles..."
      />

      <VehicleTable
        vehicles={filteredVehicles}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setSelectedVehicle(null);
          setIsModalOpen(false);
        }}
      >
        <div className="w-[450px] max-w-full">
          <h2 className="mb-6 text-2xl font-bold">
            {selectedVehicle
              ? "Edit Vehicle"
              : "Add Vehicle"}
          </h2>

          <VehicleForm
            initialData={selectedVehicle}
            onSubmit={handleSave}
          />
        </div>
      </Modal>
    </div>
  );
}