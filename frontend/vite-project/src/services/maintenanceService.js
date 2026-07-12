import api from "./api";
import { maintenance as mockMaintenance } from "../mock/maintenance";
import { USE_MOCK } from "../config/config";

let maintenanceData = [...mockMaintenance];

export async function getMaintenance() {
  if (USE_MOCK) return Promise.resolve(maintenanceData);

  const { data } = await api.get("/maintenance");
  return data;
}

export async function createMaintenance(record) {
  if (USE_MOCK) {
    const newRecord = {
      id: Date.now(),
      ...record,
    };

    maintenanceData.push(newRecord);

    return Promise.resolve(newRecord);
  }

  const { data } = await api.post("/maintenance", record);
  return data;
}

export async function updateMaintenance(id, record) {
  if (USE_MOCK) {
    maintenanceData = maintenanceData.map((item) =>
      item.id === id ? { ...item, ...record } : item
    );

    return Promise.resolve(record);
  }

  const { data } = await api.patch(`/maintenance/${id}`, record);
  return data;
}

export async function deleteMaintenance(id) {
  if (USE_MOCK) {
    maintenanceData = maintenanceData.filter(
      (item) => item.id !== id
    );

    return Promise.resolve(id);
  }

  const { data } = await api.delete(`/maintenance/${id}`);
  return data;
}