import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";

import MaintenanceForm from "./MaintenanceForm";


import MaintenanceTable from "./MaintenanceTable";
import {
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../../services/maintenanceService";

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadMaintenance();
  }, []);

  async function loadMaintenance() {
    try {
      setLoading(true);

      const data = await getMaintenance();

      setMaintenance(data);
    } catch (err) {
      toast.error("Failed to load maintenance records");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(record) {
    try {
      if (selectedRecord) {
        await updateMaintenance(selectedRecord.id, record);
        toast.success("Maintenance updated");
      } else {
        await createMaintenance(record);
        toast.success("Maintenance added");
      }

      await loadMaintenance();

      setSelectedRecord(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Operation failed");
    }
  }

  async function handleDelete(record) {
    if (!window.confirm("Delete this maintenance record?"))
      return;

    try {
      await deleteMaintenance(record.id);

      toast.success("Maintenance deleted");

      loadMaintenance();
    } catch {
      toast.error("Delete failed");
    }
  }

  function handleEdit(record) {
    setSelectedRecord(record);
    setIsModalOpen(true);
  }

  const filteredMaintenance = maintenance.filter(
    (record) =>
      record.vehicle
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.issue
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Management"
        description="Track and manage vehicle maintenance."
        action={
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            Add Record
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search maintenance..."
      />

      <MaintenanceTable
        maintenance={filteredMaintenance}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setSelectedRecord(null);
          setIsModalOpen(false);
        }}
      >
        <div className="w-[450px] max-w-full">
          <h2 className="mb-6 text-2xl font-bold">
            {selectedRecord
              ? "Edit Maintenance"
              : "Add Maintenance"}
          </h2>

          <MaintenanceForm
            initialData={selectedRecord}
            onSubmit={handleSave}
          />
        </div>
      </Modal>
    </div>
  );
}