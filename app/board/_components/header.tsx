import { CustomToolpip } from "@/components/custom_toltip";
import { IconModay } from "@/components/icon_monday";
import { IconSpaceWork } from "@/components/icon_space_work";
import { UserButton } from "@clerk/nextjs";
import { Bell, Cookie, Grip, HardDrive, Search, UserPlus } from "lucide-react";
import { MenuHeader } from "./menu_header";
import { SpaceWork } from "@prisma/client";

interface HeaderProps {
  spacesWorks: SpaceWork;
}

export const Header = ({ spacesWorks }: HeaderProps) => {
  return (
    <header className="w-full p-1 md:p-2 h-[7%] bg-gris flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          <MenuHeader spacesWorks={spacesWorks}>
            <Grip className="w-8 h-8" />
          </MenuHeader>
        </div>
        <Grip className=" hidden md:flex w-8 h-8" />

        <IconModay />
        <p className="text-xs md:text-lg">
          <span className="font-bold">monday </span> work managment
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="hidden md:flex space-x-2 items-center">
          <CustomToolpip msg="Notificaciones">
            <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              <Bell className="size-4 md:w-6 h-6" />
            </button>
          </CustomToolpip>
          <CustomToolpip msg="Buzon">
            <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              <HardDrive className="size-4 md:w-6 h-6" />
            </button>
          </CustomToolpip>
          <CustomToolpip msg="Invitar miembros">
            <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              <UserPlus className="size-4 md:w-6 h-6" />
            </button>
          </CustomToolpip>
          <CustomToolpip msg="Apps">
            <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              <Cookie className="size-4 md:w-6 h-6" />
            </button>
          </CustomToolpip>
          <div className="w-[1px] h-10 bg-grisHover"></div>
          <CustomToolpip msg="Buscar todo">
            <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              <Search className="size-4 md:w-6 h-6" />
            </button>
          </CustomToolpip>
          <CustomToolpip msg="Ayuda">
            <button className="w-12 h-12 text-2xl rounded-sm hover:bg-grisHover transition-colors duration-200 text-black">
              ?
            </button>
          </CustomToolpip>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
