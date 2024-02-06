import { CustomToolpip } from "@/components/custom_toltip";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronDown,
  CircleUser,
  EyeOff,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { ButtonCreateGroupTasks } from "./button_create_group";
import { GetTaksGroup } from "./get_taks_group";
import { Suspense } from "react";
import { BoardUser } from "@prisma/client";

interface ContentBoardProps {
  boardId: string;
  userId: string;
  boardUsers: BoardUser[];
}
export const ContentBoard = ({
  boardId,
  userId,
  boardUsers,
}: ContentBoardProps) => {
  return (
    <div className="w-full h-full ">
      <div className="w-full h-[10%]  flex items-center space-x-2 mt-2">
        <Button className="flex items-center justify-between bg-azul text-white gap-x-2">
          <p>Agregar Tarea</p>
          <div className="flex items-center justify-center border-l border-black gap-x-2">
            <ChevronDown className="w-6 h-6" />
          </div>
        </Button>
        <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
          <Search className="w-4 h-4" />
          Buscar
        </div>
        <CustomToolpip msg="Filtrar por persona">
          <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
            <CircleUser className="w-4 h-4" />
            Persona
          </div>
        </CustomToolpip>
        <CustomToolpip msg="Filtrar por cualquier cosa">
          <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
            <Filter className="w-4 h-4" />
            Filtrar
          </div>
        </CustomToolpip>
        <CustomToolpip msg="Ordenar cualquier columna">
          <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
            <ArrowUpDown className="w-4 h-4" />
            Ordenar
          </div>
        </CustomToolpip>
        <CustomToolpip msg="Columnas ocultadas">
          <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
            <EyeOff className="w-4 h-4" />
            Ocultar
          </div>
        </CustomToolpip>
        <div className="flex text-sm  cursor-pointer items-center p-2 gap-x-2 rounded-sm duration-200 transition-colors hover:bg-grisHover text-black">
          <MoreHorizontal className="w-4 h-4" />
        </div>
      </div>
      <div className="w-full h-[90%] overflow-auto">
        <Suspense fallback={<GetTaksGroup.skeleton />}>
          <GetTaksGroup boardUsers={boardUsers} boardId={boardId} />
        </Suspense>
        <ButtonCreateGroupTasks boardId={boardId} userId={userId} />
      </div>
    </div>
  );
};
