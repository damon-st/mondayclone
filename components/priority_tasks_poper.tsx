"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colorPriorityTasks } from "@/constants/constants";
import { Priority } from "@prisma/client";
import { ReactNode, useState } from "react";

interface PriorityTasksPoperProps {
  children: ReactNode;
  onChangePriority: (status: Priority) => void;
}

export const PriorityTasksPoper = ({
  children,
  onChangePriority,
}: PriorityTasksPoperProps) => {
  const [openPanel, setOpenPanel] = useState(false);
  const onSelectStatus = (status: Priority) => {
    onChangePriority(status);
    setOpenPanel(false);
  };
  const status: Array<{
    label: string;
    status: Priority;
    color: string;
  }> = [
    {
      label: "Critica",
      color: colorPriorityTasks.critical,
      status: "critical",
    },
    {
      label: "Alta",
      color: colorPriorityTasks.higth,
      status: "higth",
    },
    {
      label: "Media",
      color: colorPriorityTasks.midle,
      status: "midle",
    },
    {
      label: "Baja",
      color: colorPriorityTasks.slow,
      status: "slow",
    },
    {
      label: "",
      color: colorPriorityTasks.none,
      status: "none",
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
