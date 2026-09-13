import { api } from "./api";

export async function getPayments(searchParams) {
  try {
    const { search, page, size } = searchParams || {};
  

    const response = await api.get("/payments", {
      params: {
        search: search.search,
        paymentMethod: search.paymentMethod,
        paymentStatus: search.paymentStatus,
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

export async function getPaymentById(id) {
    const response = await api.get(`/payments/${id}`);
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

export async function getPaymentIndicators(searchParams) {
  try {
    const { search } = searchParams || {};
    const response = await api.get("/payments/indicators", {
      params: {
        search: search.search,
        paymentMethod: search.paymentMethod,
        paymentStatus: search.paymentStatus,
        startDate: search?.startDate,
        endDate: search?.endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pagamentos", error);
  }
}
