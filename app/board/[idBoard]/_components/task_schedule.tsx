"use client";

import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { colorStatusTasks } from "@/constants/constants";
import { calculeDiferenceInDays, formatDate } from "@/lib/utils";
import { Schedule } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";

interface TaskScheduleProps {
  idTask: string;
  schedule: Schedule | null;
}

export const TaskSchedule = ({ idTask, schedule: sc }: TaskScheduleProps) => {
  const router = useRouter();
  const [schedule, setSchedule] = useState(sc);
  const color = schedule
    ? colorStatusTasks.completed
    : colorStatusTasks.notInit;

  const onChangeRange = async (range: DateRange) => {
    startTransition(() => {
      setSchedule({
        dateEnd: range.to!,
        dateInit: range.from!,
      });
    });
    const promise = axios.put("/api/board/tasks/update", {
      idTask,
      schedule: {
        dateEnd: range.to,
        dateInit: range.from,
      },
    });
    toast.promise(promise, {
      loading: "Update dates please waiting",
      error: (e) => `Error: ${e}`,
      success: () => {
        router.refresh();
        return "Update dates succefully";
      },
    });
  };

  let msg = "Configurar fechas";

  let dateInitTxt = "";
  if (schedule?.dateInit) {
    dateInitTxt = formatDate(schedule.dateInit, "dd");
  }
  let dateEndTxt = "";
  if (schedule?.dateEnd) {
    dateEndTxt = formatDate(schedule.dateEnd, "dd MMM");
  }

  if (schedule?.dateInit && schedule.dateEnd) {
    msg = `${calculeDiferenceInDays(schedule.dateInit, schedule.dateEnd)} dias`;
  }

  return (
    <div className="w-[10.4rem] h-10 border-r border-grisHover flex items-center justify-center">
      <DatePickerWithRange
        onChangeRange={onChangeRange}
        className="w-[80%] h-[70%]"
      >
        <div
          className="w-full h-full rounded-xl flex items-center justify-center relative cursor-pointer group"
          style={{ backgroundColor: color }}
        >
          <p className="text-white text-sm">
            {dateInitTxt} - {dateEndTxt}
          </p>
          <div
            className="z-10 absolute w-full h-full rounded-xl hidden group-hover:flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <p className=" text-white text-sm ">{msg}</p>
          </div>
        </div>
      </DatePickerWithRange>
    </div>
  );
};
