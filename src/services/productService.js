import { api } from "./api";

export async function getProducts(searchParams) {
  try {
    const { search, page, size } = searchParams || {};

    const response = await api.get("/service-catalogs", {
      params: {
        search: search.search,
        active: search.status,
        type: search.type,
        size,
        page,
        sort: search.sort
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getProductIndicators() {
  try {
    const response = await api.get("/service-catalogs/indicators");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}
export async function getProductId(id) {
  const response = await api.get(`/service-catalogs/${id}`);
  return response.data;
}

export async function createProduct(data) {
  const response = await api.post("/service-catalogs", data);
  return response.data;
}

export async function updateProduct(data, id) {
  const response = await api.patch(`/service-catalogs/${id}`, data);
  return response.data;
}

export async function deactivateProduct(id) {
  const response = await api.patch(`/service-catalogs/${id}/deactivate`);
  return response.data;
}

export async function activateProduct(id) {
  const response = await api.patch(`/service-catalogs/${id}/activate`);
  return response.data;
}
