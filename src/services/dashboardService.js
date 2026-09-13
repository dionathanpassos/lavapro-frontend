import { api } from "./api";

export async function getDashboard() {
    const response = await api.get("/dashboard");
    return response.data;
}

export async function getCustomerById(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;    
}

export async function createCustomer(data) {
  const response = await api.post("/customers", data);
  return response.data;
}

export async function uptadeCustomer(data, id) {
  const response = await api.put(`/customers/${id}`, data);
  return response.data;
}
