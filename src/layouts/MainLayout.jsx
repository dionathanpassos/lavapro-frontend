
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

export default function MainLayout() {
  return (
    <>
    <div className="hidden md:flex h-screen w-full">
      <DesktopLayout/>
    </div>
    <div className="flex md:hidden h-screen w-full">
        <MobileLayout />
      </div>
    </>
  );
}
