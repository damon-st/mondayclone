import {
  ArrowDown,
  CalendarCheck,
  ChevronDown,
  Home,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Link from "next/link";
import { ButtonCreateTablero } from "./button_create";
import { SpaceWork } from "@prisma/client";
import { IconSpaceWork } from "@/components/icon_space_work";
import { createRoute } from "@/routes/routes";
import { Suspense } from "react";
import { GetBoardsList } from "./get-boards-list";

interface SidebarProps {
  spacesWorks: SpaceWork;
}

export const Sidebar = ({ spacesWorks }: SidebarProps) => {
  return (
    <div className="w-full h-full bg-white rounded-r-lg">
      <div className="w-full p-2">
        <Link
          href={"/board"}
          className="w-full hover:bg-gray-200 transition-colors duration-200 p-2 flex items-center gap-x-2 rounded-sm"
        >
          <Home className="w-4 h-4" />
          <p className="text-sm font-normal">Inicio</p>
        </Link>
        <Link
          href={"/board"}
          className="w-full hover:bg-gray-200 transition-colors duration-200 p-2 flex items-center gap-x-2 rounded-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          <p className="text-sm font-normal">Mi trabajo</p>
        </Link>
      </div>
      <div className="w-full h-[1px] bg-grisHover"></div>
      <div className="w-full mt-2 flex items-center justify-between">
        <Link
          href={createRoute("spaceWorkDetails", {
            idSpace: spacesWorks.id,
          })}
          className="w-[75%] flex items-center rounded-sm hover:bg-grisHover p-2 cursor-pointer transition-colors duration-200"
        >
          <div className="w-[15%] flex items-center justify-center">
            <IconSpaceWork nameWork={spacesWorks.nameWork} size="sm" />
          </div>
          <div className="w-[70%] flex items-center whitespace-nowrap overflow-hidden font-bold">
            {spacesWorks.nameWork}
          </div>
          <div className="w-[15%] flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </Link>
        <div className="w-[23%] flex items-center justify-center">
          <div className="flex items-center rounded-sm hover:bg-grisHover p-2 transition-colors duration-200 cursor-pointer">
            <MoreHorizontal className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="w-full mt-2">
        <div className="w-full flex items-center mt-5 justify-between">
          <div className="w-[75%] flex items-center p-1 rounded-sm border border-grisHover">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full outline-none"
            />
          </div>
          <div className="w-[23%] flex items-center justify-center">
            <ButtonCreateTablero idSpaceWork={spacesWorks.id} />
          </div>
        </div>
        <Suspense fallback={<GetBoardsList.skeleton />}>
          <GetBoardsList spaceWorkId={spacesWorks.id} />
        </Suspense>
      </div>
    </div>
  );
};
