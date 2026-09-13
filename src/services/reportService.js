import { api } from "./api";

export async function getOverviewReport(searchParams) {
  try {
    const { startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/overview", {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getFinancialReport(searchParams) {
  try {
    const { startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/financial", {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getFinancialReportPayment(searchParams) {
  try {
    const { page, size, startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/financial/payment", {
      params: {
        size,
        page,
        startDate,
        endDate     
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getOperationalReport(searchParams) {
  try {
    const { startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/operational", {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}


export async function getOperationalReportServiceOrders(searchParams) {
  try {
    const { page, size, startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/operational/service-orders", {
      params: {
        size,
        page,    
        startDate,
        endDate    
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getCustomerReport(searchParams) {
  try {
    const { startDate, endDate } = searchParams || {};
    const response = await api.get("/reports/customer", {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
  }
}

export async function getCustomersMetrics(searchParams) {
  try {
    const { search, page, size } = searchParams || {};

    const response = await api.get("/reports/customer/metrics", {
      params: {
        search: search.search,
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

