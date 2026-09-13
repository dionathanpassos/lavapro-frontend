import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className=" bg-background">
      <main className="min-h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
