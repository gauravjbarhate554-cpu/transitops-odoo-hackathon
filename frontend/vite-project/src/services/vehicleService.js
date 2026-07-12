import api from "./api";
import { vehicles as mockVehicles } from "../mock/vehicles";
import { USE_MOCK } from "../config/config";

let vehicleData = [...mockVehicles];

// Get all vehicles
export async function getVehicles() {
  if (USE_MOCK) {
    return Promise.resolve(vehicleData);
  }

  const { data } = await api.get("/vehicles");
  return data;
}

// Get single vehicle
export async function getVehicleById(id) {
  if (USE_MOCK) {
    return Promise.resolve(
      vehicleData.find((vehicle) => vehicle.id === id)
    );
  }

  const { data } = await api.get(`/vehicles/${id}`);
  return data;
}

// Create vehicle
export async function createVehicle(vehicle) {
  if (USE_MOCK) {
    const newVehicle = {
      id: Date.now(),
      ...vehicle,
    };

    vehicleData.push(newVehicle);

    return Promise.resolve(newVehicle);
  }

  const { data } = await api.post("/vehicles", vehicle);
  return data;
}

// Update vehicle
export async function updateVehicle(id, updatedVehicle) {
  if (USE_MOCK) {
    vehicleData = vehicleData.map((vehicle) =>
      vehicle.id === id
        ? { ...vehicle, ...updatedVehicle }
        : vehicle
    );

    return Promise.resolve(updatedVehicle);
  }

  const { data } = await api.patch(`/vehicles/${id}`, updatedVehicle);
  return data;
}

// Delete vehicle
export async function deleteVehicle(id) {
  if (USE_MOCK) {
    vehicleData = vehicleData.filter(
      (vehicle) => vehicle.id !== id
    );

    return Promise.resolve(id);
  }

  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
}