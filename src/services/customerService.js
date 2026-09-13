import { api } from "./api";

export async function getCustomers(searchParams) {
  try {
    const { search, page, size } = searchParams || {};

    const response = await api.get("/customers", {
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

export async function getCustomersFilter(searchParams) {
  try {
    const { search, page = 0, size = 5, sort } = searchParams || {};
    const response = await api.get("/customers", {
      params: { search, size, page, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
    throw error;
  }
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
