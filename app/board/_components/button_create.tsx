"use client";

import { CustomToolpip } from "@/components/custom_toltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use_moda";
import { CircuitBoard } from "lucide-react";

interface ButtonCreateTableroProps {
  idSpaceWork: string;
}

export const ButtonCreateTablero = ({
  idSpaceWork,
}: ButtonCreateTableroProps) => {
  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 bg-azul text-white rounded-sm text-xl flex items-center justify-center">
          +
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" sideOffset={10} align="start">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            onOpen("createTablero", {
              idSpaceWork,
            })
          }
          className="flex items-center space-x-2"
        >
          <CircuitBoard className="w-4 h-4" />
          <p> Tablero nuevo</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
