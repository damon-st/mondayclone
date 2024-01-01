"use client";

import { cn } from "@/lib/utils";
import { createRoute } from "@/routes/routes";
import { Board } from "@prisma/client";
import { GanttChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BoardItemsProps {
  board: Board;
}

export const BoardItems = ({ board }: BoardItemsProps) => {
  const pathName = usePathname();

  const isSelected = pathName === `/board/${board.id}`;

  return (
    <Link
      href={createRoute("board", {
        idBoard: board.id,
      })}
      className={cn(
        "flex items-center p-2 rounded-sm hover:bg-grisHover overflow-hidden",
        isSelected && "bg-grisHover"
      )}
    >
      <GanttChart className="w-4 h-4" />
      <p className="text-sm font-normal">{board.title}</p>
    </Link>
  );
};
