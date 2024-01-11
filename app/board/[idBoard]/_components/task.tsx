"use client";

import { CustomToolpip } from "@/components/custom_toltip";
import { cn } from "@/lib/utils";
import { BoardUser, Files, Tasks, TasksTimesWorks } from "@prisma/client";
import { MessageSquarePlusIcon, Square } from "lucide-react";
import { TaskMenuOptions } from "./task_menu_options";
import { TaskTitleInput } from "./task_title_input";
import { TaskResponsible } from "./task_responsible";
import { TaskDate } from "./task_date";
import { TasksStatus } from "./status_task";
import { TasksPriority } from "./tasks_priority";
import { TaskNote } from "./task_note";
import { TaskBudget } from "./task_budget";
import { TaskFile } from "./task_file";
import { TaskSchedule } from "./task_schedule";
import { TaskLastActivity } from "./task_last_activity";
import { TaskTimeWorks } from "./task_time_work";

interface TaskProps {
  taks: Tasks & {
    files: Files[];
    tasksTimesWorks: TasksTimesWorks[];
  };
  color: string;
  index: number;
  isLast: boolean;
  boardUsers: BoardUser[];
  currentUser: string;
}

export const Task = ({
  taks,
  color,
  index,
  isLast,
  boardUsers,
  currentUser,
}: TaskProps) => {
  const isFirst = index === 0;
  const canSelectFiles =
    boardUsers.find((v) => v.userId === currentUser)?.permitions ===
    "readAndWrite";
  return (
    <div className="w-full flex items-center group ">
      <div className="w-[2.2rem] h-full flex items-center justify-center">
        <TaskMenuOptions task={taks} idTask={taks.id} />
      </div>
      <div className={cn(" hover:bg-grisHover/20", isLast && "rounded-b-sm")}>
        <div
          className={cn(
            "w-full flex items-center border-b border-grisHover ",
            isFirst && "border-t"
          )}
        >
          <div
            style={{ borderLeftColor: color }}
            className="border-l-4 sticky bg-white z-20 left-0 flex items-center"
          >
            <div className="w-10 border-r border-grisHover h-10 flex items-center justify-center ">
              <Square className="w-5 h-5 text-grisHover" />
            </div>
            <div className="w-[20.7rem] flex items-center h-10">
              <div className="w-[80%] border-r border-grisHover h-10 flex items-center justify-center">
                <TaskTitleInput idTask={taks.id} title={taks.title} />
              </div>
              <div className="w-[20%] border-r border-grisHover h-10 flex items-center justify-center">
                <CustomToolpip msg="Iniciar conversacion">
                  <MessageSquarePlusIcon className="w-4 h-4 cursor-pointer hover:text-azul" />
                </CustomToolpip>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full">
            <TaskResponsible
              boardUsers={boardUsers}
              idTasks={taks.id}
              idUser={taks.userId}
            />
            <TaskDate
              idTask={taks.id}
              dateInit={taks.dateInit}
              status={taks.status}
            />
            <TasksStatus idTask={taks.id} status={taks.status} />
            <TasksPriority idTask={taks.id} priority={taks.priority} />
            <TaskNote idTask={taks.id} note={taks.notes} />
            <TaskBudget idTask={taks.id} budget={taks.budget} />
            <TaskFile
              canSelectFiles={canSelectFiles}
              idTask={taks.id}
              files={taks.files}
            />
            <TaskSchedule idTask={taks.id} schedule={taks.schedule} />
            <TaskLastActivity title={taks.title} idTask={taks.id} />
            <TaskTimeWorks
              tasksTimesWorks={taks.tasksTimesWorks}
              taskId={taks.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
