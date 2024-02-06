"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Files, Tasks } from "@prisma/client";
import axios from "axios";

import { Copy, Maximize2, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface TaskMenuOptionsProps {
  idTask: string;
  task: Tasks & {
    files: Files[];
  };
}

export const TaskMenuOptions = ({ idTask, task }: TaskMenuOptionsProps) => {
  const [isPending, starTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const onRemove = () => {
    try {
      if (loading) return;
      setLoading(true);
      const promise = axios.delete("/api/board/tasks/delete", {
        data: {
          idTaks: idTask,
        },
      });
      toast.promise(promise, {
        loading: "Remove task please waiting...",
        error: (e) => `Error ${e}`,
        success: () => {
          setLoading(false);
          route.refresh();
          return "Remove task succefully";
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error(`Error: ${error}`);
    }
  };

  const onDuplicate = () => {
    if (isPending) return;
    starTransition(() => {
      const promise = axios.post("/api/board/tasks/duplicate", {
        task,
      });
      toast.promise(promise, {
        loading: "Duplicated tasks in process please wait",
        error: (e) => `Error: ${e}`,
        success: () => {
          route.refresh();
          return "Duplicate task succefully";
        },
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-sm hidden group-hover:block hover:rounded-sm hover:bg-grisHover p-2 cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-black " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer">
          <Maximize2 className="w-4 h-4" />
          <p className="text-sm">Abrir</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDuplicate}
          className="flex items-center gap-x-2 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          <p className="text-sm">Duplicar</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onRemove}
          className="flex items-center gap-x-2 cursor-pointer"
        >
          <Trash className="w-4 h-4" />
          <p className="text-sm">Eliminar</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
