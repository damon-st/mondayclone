"use client";

import { CustomToolpip } from "@/components/custom_toltip";
import { DatePicker } from "@/components/ui/date-picker";
import {
  calculeDiferenceInDays,
  cn,
  compareDates,
  formatDate,
} from "@/lib/utils";
import { StatusTaks } from "@prisma/client";
import axios from "axios";
import { AlertCircle, Check } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface TaskDateProps {
  idTask: string;
  dateInit: Date;
  status: StatusTaks;
}

export const TaskDate = ({
  dateInit: dated,
  idTask,
  status,
}: TaskDateProps) => {
  const [isPending, startTransition] = useTransition();
  const [dateInit, setDateInit] = useState(dated);
  const time = formatDate(dateInit, "dd MMM");
  const now = new Date();
  const equalDate = compareDates(dateInit, now);
  const diferenceDays = calculeDiferenceInDays(now, dateInit);
  const label =
    status === "completed"
      ? "Listo a tiempo"
      : equalDate
      ? "Hoy"
      : `Vencio hace ${diferenceDays} dias`;
  const isVenced = status !== "completed" && !equalDate;
  const isCompleted = status === "completed";

  const onChangeDate = (date: Date | undefined) => {
    if (!date) return;
    const newDAte = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes()
    );
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        dateInit: newDAte,
        idTask,
      });
      toast.promise(promise, {
        loading: "Update date please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          setDateInit(newDAte);
          return "Update succefully";
        },
      });
    });
  };

  return (
    <DatePicker date={dateInit} onChangeDate={onChangeDate}>
      <div className="relative w-[10.4rem] h-10 cursor-pointer border-r border-grisHover flex items-center justify-center">
        <p className={cn("text-sm", isCompleted && "line-through")}>{time}</p>
        <CustomToolpip msg={label}>
          <div
            className={cn(
              "w-5 h-5 bg-gray-600 rounded-full absolute left-3 flex items-center justify-center",
              isVenced && "bg-red-600",
              isCompleted && "bg-green-600"
            )}
          >
            {isVenced && <AlertCircle className="w-3 h-3 text-white" />}
            {isCompleted && <Check className="w-3 h-3 text-white" />}
          </div>
        </CustomToolpip>
      </div>
    </DatePicker>
  );
};
