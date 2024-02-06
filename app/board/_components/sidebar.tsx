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
import { SpacesWorkPopover } from "./spaces-work-popover";

interface SidebarProps {
  spacesWorks: SpaceWork;
  idSpaceWork: string;
  userId: string;
}

export const Sidebar = ({ spacesWorks, idSpaceWork, userId }: SidebarProps) => {
  return (
    <div className="w-full h-full bg-white rounded-r-lg">
      <div className="w-full p-2">
        <Link
          href={`/board/${idSpaceWork}`}
          className="w-full hover:bg-gray-200 transition-colors duration-200 p-2 flex items-center gap-x-2 rounded-sm"
        >
          <Home className="w-4 h-4" />
          <p className="text-sm font-normal">Inicio</p>
        </Link>
        <Link
          href={`/board/${idSpaceWork}`}
          className="w-full hover:bg-gray-200 transition-colors duration-200 p-2 flex items-center gap-x-2 rounded-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          <p className="text-sm font-normal">Mi trabajo</p>
        </Link>
      </div>
      <div className="w-full h-[1px] bg-grisHover"></div>
      <SpacesWorkPopover
        userId={userId}
        idSpaceWork={idSpaceWork}
        spacesWorks={spacesWorks}
      />
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
          <GetBoardsList
            idSpaceWork={idSpaceWork}
            spaceWorkId={spacesWorks.id}
          />
        </Suspense>
      </div>
    </div>
  );
};
