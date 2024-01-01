"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colorStatusTasks } from "@/constants/constants";
import { StatusTaks } from "@prisma/client";
import { ReactNode, useState } from "react";

interface StatusTasksPoperProps {
  children: ReactNode;
  onChangeStatus: (status: StatusTaks) => void;
}

export const StatusTasksPoper = ({
  children,
  onChangeStatus,
}: StatusTasksPoperProps) => {
  const [openPanel, setOpenPanel] = useState(false);
  const onSelectStatus = (status: StatusTaks) => {
    onChangeStatus(status);
    setOpenPanel(false);
  };
  const status: Array<{
    label: string;
    status: StatusTaks;
    color: string;
  }> = [
    {
      label: "Listo",
      color: colorStatusTasks.completed,
      status: "completed",
    },
    {
      label: "En curso",
      color: colorStatusTasks.inProgress,
      status: "inProgress",
    },
    {
      label: "Detenido",
      color: colorStatusTasks.stop,
      status: "stop",
    },
    {
      label: "No iniciado",
      color: colorStatusTasks.notInit,
      status: "notInit",
    },
  ];
  return (
    <Popover open={openPanel} onOpenChange={(c) => setOpenPanel(c)}>
      <PopoverTrigger onClick={() => setOpenPanel(true)} asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex flex-col w-full space-y-2">
          {status.map((s) => (
            <div
              onClick={() => onSelectStatus(s.status)}
              key={s.label}
              className="cursor-pointer w-full h-10 text-white flex items-center justify-center"
              style={{ backgroundColor: s.color }}
            >
              {s.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
