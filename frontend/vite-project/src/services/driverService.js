import api from "./api";
import { drivers as mockDrivers } from "../mock/drivers";
import { USE_MOCK } from "../config/config";

let driverData = [...mockDrivers];

// Get all drivers
export async function getDrivers() {
  if (USE_MOCK) {
    return Promise.resolve(driverData);
  }

  const { data } = await api.get("/drivers");
  return data;
}

// Get single driver
export async function getDriverById(id) {
  if (USE_MOCK) {
    return Promise.resolve(
      driverData.find((driver) => driver.id === id)
    );
  }

  const { data } = await api.get(`/drivers/${id}`);
  return data;
}

// Create driver
export async function createDriver(driver) {
  if (USE_MOCK) {
    const newDriver = {
      id: Date.now(),
      ...driver,
    };

    driverData.push(newDriver);

    return Promise.resolve(newDriver);
  }

  const { data } = await api.post("/drivers", driver);
  return data;
}

// Update driver
export async function updateDriver(id, updatedDriver) {
  if (USE_MOCK) {
    driverData = driverData.map((driver) =>
      driver.id === id
        ? { ...driver, ...updatedDriver }
        : driver
    );

    return Promise.resolve(updatedDriver);
  }

  const { data } = await api.patch(`/drivers/${id}`, updatedDriver);
  return data;
}

// Delete driver
export async function deleteDriver(id) {
  if (USE_MOCK) {
    driverData = driverData.filter(
      (driver) => driver.id !== id
    );

    return Promise.resolve(id);
  }

  const { data } = await api.delete(`/drivers/${id}`);
  return data;
}