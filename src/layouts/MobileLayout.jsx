import { Outlet } from "react-router";
import BottonMenu from "./Components/BottomMenu";

export default function MobileLayout() {
  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden">
      
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain">
        <Outlet />
      </main>
      <BottonMenu />
    </div>
  );
}
