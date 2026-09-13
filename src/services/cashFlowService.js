import { api } from "./api";

export async function getCashFlows(searchParams) {
  try {
    const { search, page, size } = searchParams || {};
    const response = await api.get("/cash-flows", {
      params: {
        search: search.search,
        category: search.category,
        type: search.type,
        paymentMethod: search.paymentMethod,
        startDate: search?.startDate,
        endDate: search?.endDate,
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

export async function getCashFlowById(id) {
    const response = await api.get(`/cash-flows/${id}`);
    return response.data;    
}

export async function createPayment(data) {
  const response = await api.post("/payments", data);
  return response.data;
}

export async function cancelPayment(id) {
  const response = await api.patch(`/payments/${id}/cancel`);
  return response.data;
}

export async function getCashFlownsdicators(searchParams) {
  try {
    const { search } = searchParams || {};
    const response = await api.get("/cash-flows/indicators", {
      params: {
        search: search.search,
        category: search.category,
        type: search.type,
        paymentMethod: search.paymentMethod,
        startDate: search?.startDate,
        endDate: search?.endDate,
        
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pagamentos", error);
  }
}
