import api from "./api";
import { trips as mockTrips } from "../mock/trips";
import { USE_MOCK } from "../config/config";

let tripData = [...mockTrips];

export async function getTrips() {
  if (USE_MOCK) {
    return Promise.resolve(tripData);
  }

  const { data } = await api.get("/trips");
  return data;
}

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

  const { data } = await api.post("/trips");
  return data;
}

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