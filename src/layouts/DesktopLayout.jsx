
import { Outlet } from "react-router";
import AsideMenu from "./Components/AsideMenu";

export default function DesktopLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AsideMenu />
      
      <main className="flex-1 min-w-0 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
