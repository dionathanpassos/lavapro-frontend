import { api } from "./api";

export async function getServicesCatalog() {
  try {
    const response = await api.get("/service-catalogs");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getCustomerById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;    
}

export async function createServiceOrder(data) {
  const response = await api.post("/service-orders", data);
  return response.data;
}

export async function uptadeCustomer(data, id) {
  const response = await api.put(`/customers/${id}`, data);
  return response.data;
}
