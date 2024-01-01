"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaidGroupTask } from "@prisma/client";
import axios from "axios";

import { DollarSign, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface OptionsGroupTaskProps {
  idGroup: string;
  paid: PaidGroupTask | null;
  boardId: string;
}

export const OptionsGroupTask = ({
  idGroup,
  paid,
  boardId,
}: OptionsGroupTaskProps) => {
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
    startTransition(() => {
      const existPaid = {
        paid: paid == null ? true : !paid.paid,
      };
      const promise = axios.put("/api/board/group-tasks/update", {
        boardId,
        idTaks: idGroup,
        paid: existPaid,
      });
      toast.promise(promise, {
        loading: "Update data please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Udpate data succefully";
        },
      });
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
          onClick={onPaid}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <p className="text-sm">{paid?.paid ? "Quitar pagado" : "¿Pagado?"}</p>
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
