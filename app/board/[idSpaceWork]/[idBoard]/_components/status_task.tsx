"use client";

import { StatusTasksPoper } from "@/components/status_tasks_poper";
import { colorStatusTasks } from "@/constants/constants";
import { getStatusTaskTXT } from "@/lib/utils";
import { StatusTaks } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface TasksStatusProps {
  idTask: string;
  status: StatusTaks;
}

export const TasksStatus = ({ idTask, status }: TasksStatusProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const color = colorStatusTasks[status];
  let statusTxt: string = getStatusTaskTXT(status);

  const onChangeStatus = (status: StatusTaks) => {
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        idTask,
        status,
      });
      toast.promise(promise, {
        loading: "Update status please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Update success";
        },
      });
    });
  };

  return (
    <StatusTasksPoper onChangeStatus={onChangeStatus}>
      <div
        className="cursor-pointer w-[10.4rem] h-10 border-r border-grisHover flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <p className="text-sm">{statusTxt}</p>
      </div>
    </StatusTasksPoper>
  );
};
