"use client";

import { useModal } from "@/hooks/use_moda";
import { formatMinutesToHm } from "@/lib/utils";
import { TasksTimesWorks } from "@prisma/client";
import { differenceInMinutes } from "date-fns";

interface TaskTimeWorksProps {
  taskId: string;
  tasksTimesWorks: TasksTimesWorks[];
}

export const TaskTimeWorks = ({
  taskId,
  tasksTimesWorks,
}: TaskTimeWorksProps) => {
  const { onOpen } = useModal();
  const onShowTimes = () => {
    onOpen("timesWorkTask", {
      timesWokrs: tasksTimesWorks,
      idTask: taskId,
    });
  };

  let minutes = 0;
  for (const t of tasksTimesWorks) {
    if (!t.timeEnd) continue;
    minutes += differenceInMinutes(t.timeEnd!, t.timeInit);
  }

  let msg = formatMinutesToHm(minutes);

  return (
    <div
      onClick={onShowTimes}
      className="w-[10.4rem] relative cursor-pointer h-10 border-r border-grisHover flex items-center justify-center"
    >
      {msg}
    </div>
  );
};
