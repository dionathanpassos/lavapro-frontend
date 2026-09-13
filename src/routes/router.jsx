import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "../Auth/PrivateRoute.jsx";
import Dashboard from "../pages/Dashboard/DashboardPage";
import MainLayout from "../layouts/MainLayout";
import ServiceOrder from "../pages/ServiceOrder/ServiceOrderPage";
import Customer from "../pages/Customer/CustomerPage";
import VehiclesPage from "../pages/Vehicles/VehiclesPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import ProductPage from "../pages/Products/ProdutctPage";
import CashFlowPage from "../pages/CashFlow/CashFlowPage";
import ServiceOrderDetailsPage from "../pages/ServiceOrder/ServiceOrderDetailsPage";
import UserPage from "../pages/Users/UserPage";
import PublicRoute from "./PublicRoute.jsx";
import UserProfilePage from "../pages/Users/UserProfilePage.jsx";
import ReportsPage from "../pages/Report/ReportPage.jsx";
import ReportCustomerPage from "../pages/Report/ReportCustomerPage.jsx";
import RoleRoute from "../Auth/RoleRoute.jsx";
import { ROLES } from "../Auth/roles.js";
import HomeRedirect from "./HomeRedirect.jsx";
import ForbiddenPage from "../pages/Forbidden/ForbiddenPage.jsx";
import QuickStartPage from "../pages/QuickStart/QuickStartPage.jsx";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            // element: <Navigate to="/dashboard" replace />,
            element: <HomeRedirect/>
          },
          {
            path: "/dashboard",
            element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <Dashboard />
              </RoleRoute>
            ),
          },
          {
            path: "/ordens-servico",
            element: <ServiceOrder />
          },
          {
            path: "/clientes",
            element: <Customer />
          },
          {
            path: "/veiculos",
            element: <VehiclesPage />
          },
          {
            path: "/pagamentos",
            element: <PaymentPage />
          },
          {
            path: "/produtos",
            element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <ProductPage />
              </RoleRoute>
            ),
          },
          {
            path: "/fluxo-caixa",
            element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <CashFlowPage />
              </RoleRoute>
            ),
          },
          {
            path: "/ordens-servico/:id",
            element: <ServiceOrderDetailsPage />
          },
          {
            path: "/usuarios",
            element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <UserPage />
              </RoleRoute>
            ),
          },
          {
            path: "/usuarios/novo",
             element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <UserPage />
              </RoleRoute>
            ),
          },
          {
            path: "/usuarios/editar",
             element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <UserPage />
              </RoleRoute>
            ),
          },
          {
            path: "/usuarios/profile",
            element: <UserProfilePage />
          },
          {
            path: "/relatorios",
             element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <ReportsPage />,
              </RoleRoute>
            ),
          },
          {
            path: "/relatorios/clientes",
            element: (
              <RoleRoute allowedRoles={[ROLES.OWNER, ROLES.ADMIN]}>
                <ReportCustomerPage />
              </RoleRoute>
            ),
            
          },
          {
            path: "/403",
            element: <ForbiddenPage />
          },
          {
            path: "/start",
            element: <QuickStartPage />
          },
        ],
      },
    ],
  },
]);
