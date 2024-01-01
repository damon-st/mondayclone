"use client";

import { PriorityTasksPoper } from "@/components/priority_tasks_poper";
import { colorPriorityTasks } from "@/constants/constants";
import { getPriorityTaskTXT } from "@/lib/utils";
import { Priority } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface TasksPriorityProps {
  idTask: string;
  priority: Priority;
}

export const TasksPriority = ({ idTask, priority }: TasksPriorityProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  let priorityTxt: string = getPriorityTaskTXT(priority);

  const color = colorPriorityTasks[priority];

  const onChangePriority = (p: Priority) => {
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        idTask,
        priority: p,
      });
      toast.promise(promise, {
        loading: "Update priority please wait",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Updated priority succefully";
        },
      });
    });
  };

  return (
    <PriorityTasksPoper onChangePriority={onChangePriority}>
      <div
        className="cursor-pointer w-[10.4rem] h-10 border-r border-grisHover flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <p className="text-sm">{priorityTxt}</p>
      </div>
    </PriorityTasksPoper>
  );
};
