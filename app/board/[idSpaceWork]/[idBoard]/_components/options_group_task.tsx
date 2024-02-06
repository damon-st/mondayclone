"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use_moda";
import { GroupTasks, PaidGroupTask } from "@prisma/client";
import axios from "axios";

import { DollarSign, MoreHorizontal, Settings, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface OptionsGroupTaskProps {
  idGroup: string;
  paid: PaidGroupTask | null;
  boardId: string;
  priceForHour: number;
  groupTasks: GroupTasks;
}

export const OptionsGroupTask = ({
  idGroup,
  paid,
  boardId,
  groupTasks,
}: OptionsGroupTaskProps) => {
  const { onOpen } = useModal();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onRemove = () => {
    if (isPending) return;
    startTransition(async () => {
      const promise = axios.delete("/api/board/group-tasks/delete", {
        data: {
          idGroup,
        },
      });
      toast.promise(promise, {
        loading: "Removing please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Remove success";
        },
      });
    });
  };

  const onPaid = () => {
    if (isPending) return;
    if (paid?.paid) return;
    onOpen("paidGroupTasks", {
      groupTasks: groupTasks,
      idBoard: boardId,
    });
  };

  const onDialogSettins = () => {
    onOpen("settingsGroupTasks", {
      groupTasks,
      idBoard: boardId,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[3%]  items-center justify-center ">
        <div className="w-full  items-center justify-center ">
          <div className=" hidden group-hover:flex p-2 rounded-sm hover:bg-grisHover cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={onDialogSettins}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <p className="text-sm">Opciones</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onPaid}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <p className="text-sm">{paid?.paid ? "Grupo pagado" : "¿Pagado?"}</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onRemove}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Trash className="w-4 h-4" />
          <p className="text-sm">Eliminar</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
