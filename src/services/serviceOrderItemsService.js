import { api } from "./api";



export async function getServiceOrdersItems(id) {
    const response = await api.get(`/service-orders/${id}/items`);
    return response.data;    
}

export async function createServiceOrderItems(data, id) {
  const response = await api.post(`/service-orders/${id}/items`, data);
  return response.data;
}

export async function updateServiceOrderItems(data, id) {
  const response = await api.patch(`/service-order-items/${id}`, data);
  return response.data;
}
export async function deleteServiceOrderItems(data, id) {
  const response = await api.delete(`/service-order-items/${id}/delete`);
  return response.data;
}
