import { api } from "./api";

export async function getServiceOrders(searchParams) {
  try {
    const { search, page, size } = searchParams || {};

    const response = await api.get("/service-orders", {
      params: {
        search: search?.search,
        status: search?.status,
        startDate: search?.startDate,
        endDate: search?.endDate,
        size,
        page,
        sort: search?.sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}
export async function getServiceOrderIndicators() {
  try {
    const response = await api.get("/service-orders/indicators");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getServiceOrderById(id) {
    const response = await api.get(`/service-orders/${id}`);
    return response.data;    
}

export async function createServiceOrder(data) {
  const response = await api.post("/service-orders", data);
  return response.data;
}

export async function updateServiceOrder(data, id) {
  const response = await api.put(`/service-orders/${id}`, data);
  return response.data;
}

export async function startServiceOrder(id) {
  const response = await api.patch(`/service-orders/${id}/start`);
  return response.data;
}
export async function finishtServiceOrder(id) {
  const response = await api.patch(`/service-orders/${id}/finish`);
  return response.data;
}
export async function deliverServiceOrder(id) {
  const response = await api.patch(`/service-orders/${id}/deliver`);
  return response.data;
}
