import api from "./api";
import { trips as mockTrips } from "../mock/trips";
import { USE_MOCK } from "../config/config";

let tripData = [...mockTrips];

// ===============================
// Get All Trips
// ===============================
export async function getTrips() {
  if (USE_MOCK) {
    return Promise.resolve(tripData);
  }

  const { data } = await api.get("/trips");
  return data;
}

// ===============================
// Get Trip By Id
// ===============================
export async function getTripById(id) {
  if (USE_MOCK) {
    return Promise.resolve(
      tripData.find((trip) => trip.id === id)
    );
  }

  const { data } = await api.get(`/trips/${id}`);
  return data;
}

// ===============================
// Create Trip
// ===============================
export async function createTrip(trip) {
  if (USE_MOCK) {
    const newTrip = {
      id: Date.now(),
      status: "Draft",
      ...trip,
    };

    tripData.push(newTrip);

    return Promise.resolve(newTrip);
  }

  const { data } = await api.post("/trips", trip);
  return data;
}

// ===============================
// Update Trip
// ===============================
export async function updateTrip(id, updatedTrip) {
  if (USE_MOCK) {
    tripData = tripData.map((trip) =>
      trip.id === id
        ? { ...trip, ...updatedTrip }
        : trip
    );

    return Promise.resolve(updatedTrip);
  }

  const { data } = await api.patch(
    `/trips/${id}`,
    updatedTrip
  );

  return data;
}

// ===============================
// Dispatch Trip
// ===============================
export async function dispatchTrip(id) {
  if (USE_MOCK) {
    tripData = tripData.map((trip) =>
      trip.id === id
        ? { ...trip, status: "On Trip" }
        : trip
    );

    return Promise.resolve();
  }

  return api.post(`/trips/${id}/dispatch`);
}

// ===============================
// Complete Trip
// ===============================
export async function completeTrip(id) {
  if (USE_MOCK) {
    tripData = tripData.map((trip) =>
      trip.id === id
        ? { ...trip, status: "Completed" }
        : trip
    );

    return Promise.resolve();
  }

  return api.post(`/trips/${id}/complete`);
}

// ===============================
// Cancel Trip
// ===============================
export async function cancelTrip(id) {
  if (USE_MOCK) {
    tripData = tripData.map((trip) =>
      trip.id === id
        ? { ...trip, status: "Cancelled" }
        : trip
    );

    return Promise.resolve();
  }

  return api.post(`/trips/${id}/cancel`);
}

// ===============================
// Delete Trip
// ===============================
export async function deleteTrip(id) {
  if (USE_MOCK) {
    tripData = tripData.filter(
      (trip) => trip.id !== id
    );

    return Promise.resolve(id);
  }

  const { data } = await api.delete(`/trips/${id}`);
  return data;
}