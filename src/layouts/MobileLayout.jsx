import { Outlet } from "react-router";
import BottonMenu from "./Components/BottomMenu";

export default function MobileLayout() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
      <BottonMenu />
    </div>
  );
}
