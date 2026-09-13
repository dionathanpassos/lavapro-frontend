import { api } from "./api";

export async function getUsers(searchParams) {
  try {
    const { search, page, size } = searchParams || {};
    console.log(search.status)

    const response = await api.get("/users", {
      params: {
        name: search.search,
        active: search.status,
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

export async function getUserIndicators(searchParams) {
  const { search } = searchParams || {};
  try {
    const response = await api.get("/users/indicators", {
       params: {
        name: search.search,
        active: search.status,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}
export async function getUserId(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function updateUser(data, id) {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
}

export async function deactivateUser(id) {
  const response = await api.patch(`/users/${id}/deactivate`);
  return response.data;
}

export async function activateUser(id) {
  const response = await api.patch(`/users/${id}/activate`);
  return response.data;
}

export async function getProfileUser() {
  const response = await api.get(`/users/profile`);
  return response.data;
}

export async function updateProfileUser(data) {
  const response = await api.patch(`/users/profile`, data);
  return response.data;
}


