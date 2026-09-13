import { api } from "./api";

export async function getVehicle(searchParams) {
  try {
    const { search, page, size } = searchParams || {};
    const response = await api.get("/vehicles", {
      params: {
        search: search.search,
        size,
        page,
        sort: search.sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getVehicleById(id) {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
}

export async function createVehicle(data) {
  const response = await api.post("/vehicles", data);
  return response.data;
}

export async function uptadeVehicle(data, id) {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data;
}
