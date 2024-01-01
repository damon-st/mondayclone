import { createRoute } from "@/routes/routes";
import { Board } from "@prisma/client";
import { LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";

interface TabsProps {
  boards: Board[];
}

export const Tabs = ({ boards }: TabsProps) => {
  return (
    <div className="w-full">
      <div className="w-full flex items-center space-x-2">
        <div className="border-b-2 border-azul text-azul">
          Tableros recientes
        </div>
        <div className="border-b ">Miembros</div>
        <div className="border-b ">Permisos</div>
      </div>
      <p className="mt-2 text-sm mb-2">
        Tableros y paneles que visitaste recientemente en este espacio de
        trabajo
      </p>
      {boards.map((v) => (
        <Link
          key={v.id}
          href={createRoute("board", {
            idBoard: v.id,
          })}
          className="w-[50%] flex items-center justify-between p-2 border-b rounded-sm transition-colors duration-200 hover:bg-grisHover"
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-4 h-4" />
            <p>{v.title}</p>
          </div>
          <div className="flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
        </Link>
      ))}
    </div>
  );
};
