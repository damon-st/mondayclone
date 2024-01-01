import { CustomToolpip } from "@/components/custom_toltip";
import { IconModay } from "@/components/icon_monday";
import { IconSpaceWork } from "@/components/icon_space_work";
import { UserButton } from "@clerk/nextjs";
import { Bell, Cookie, Grip, HardDrive, Search, UserPlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full p-2 h-[7%] bg-gris flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Grip className="w-8 h-8" />
        <IconModay />
        <p>
          <span className="font-bold">monday </span> work managment
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        <CustomToolpip msg="Notificaciones">
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            <Bell className="w-6 h-6" />
          </button>
        </CustomToolpip>
        <CustomToolpip msg="Buzon">
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            <HardDrive className="w-6 h-6" />
          </button>
        </CustomToolpip>
        <CustomToolpip msg="Invitar miembros">
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            <UserPlus className="w-6 h-6" />
          </button>
        </CustomToolpip>
        <CustomToolpip msg="Apps">
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            <Cookie className="w-6 h-6" />
          </button>
        </CustomToolpip>
        <div className="w-[1px] h-10 bg-grisHover"></div>
        <CustomToolpip msg="Buscar todo">
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            <Search className="w-6 h-6" />
          </button>
        </CustomToolpip>
        <CustomToolpip msg="Ayuda">
          <button className="w-12 h-12 text-2xl rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
            ?
          </button>
        </CustomToolpip>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
