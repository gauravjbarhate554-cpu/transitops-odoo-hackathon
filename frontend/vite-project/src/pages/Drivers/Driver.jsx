import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";

import DriverForm from "./DriverForm";
import DriverTable from "./DriverTable";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../services/driverService";

export default function Driver() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      setLoading(true);

      const data = await getDrivers();

      setDrivers(data);
    } catch (err) {
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(driver) {
    try {
      if (selectedDriver) {
        await updateDriver(selectedDriver.id, driver);
        toast.success("Driver updated");
      } else {
        await createDriver(driver);
        toast.success("Driver added");
      }

      await loadDrivers();

      setSelectedDriver(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Operation failed");
    }
  }

  async function handleDelete(driver) {
    if (!window.confirm(`Delete ${driver.name}?`))
      return;

    await deleteDriver(driver.id);

    toast.success("Driver deleted");

    loadDrivers();
  }

  function handleEdit(driver) {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  }

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      driver.license
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Manage all fleet drivers"
        action={
          <Button
            onClick={() => {
              setSelectedDriver(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            Add Driver
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search drivers..."
      />

      <DriverTable
        drivers={filteredDrivers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setSelectedDriver(null);
          setIsModalOpen(false);
        }}
      >
        <div className="w-[450px] max-w-full">
          <h2 className="mb-6 text-2xl font-bold">
            {selectedDriver
              ? "Edit Driver"
              : "Add Driver"}
          </h2>

          <DriverForm
            initialData={selectedDriver}
            onSubmit={handleSave}
          />
        </div>
      </Modal>
    </div>
  );
}