import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";

import TripForm from "./TripForm";
import TripTable from "./TripTable";

import {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from "../../services/tripService";

export default function Trip() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      setLoading(true);

      const data = await getTrips();

      setTrips(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(trip) {
    try {
      await createTrip(trip);

      toast.success("Trip created successfully");

      setIsModalOpen(false);

      loadTrips();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create trip");
    }
  }

  async function handleDispatch(trip) {
    try {
      await dispatchTrip(trip.id);

      toast.success("Trip dispatched");

      loadTrips();
    } catch (err) {
      toast.error("Unable to dispatch trip");
    }
  }

  async function handleComplete(trip) {
    try {
      await completeTrip(trip.id);

      toast.success("Trip completed");

      loadTrips();
    } catch (err) {
      toast.error("Unable to complete trip");
    }
  }

  async function handleCancel(trip) {
    if (
      !window.confirm(
        `Cancel trip from ${trip.source} to ${trip.destination}?`
      )
    )
      return;

    try {
      await cancelTrip(trip.id);

      toast.success("Trip cancelled");

      loadTrips();
    } catch (err) {
      toast.error("Unable to cancel trip");
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const searchText = search.toLowerCase();

    return (
      trip.source.toLowerCase().includes(searchText) ||
      trip.destination.toLowerCase().includes(searchText) ||
      trip.vehicle.toLowerCase().includes(searchText) ||
      trip.driver.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Management"
        description="Manage and monitor fleet trips."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            New Trip
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search trips..."
      />

      <TripTable
        trips={filteredTrips}
        loading={loading}
        onDispatch={handleDispatch}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="w-[500px] max-w-full">
          <h2 className="mb-6 text-2xl font-bold">
            Create New Trip
          </h2>

          <TripForm
            onSubmit={handleCreate}
          />
        </div>
      </Modal>
    </div>
  );
}