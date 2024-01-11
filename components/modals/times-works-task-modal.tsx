"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Edit, Loader2, PlusCircle, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { TasksTimesWorks } from "@prisma/client";
import { da } from "date-fns/locale";
import { ResponseModel } from "@/models/response_model";
import { formatDate } from "@/lib/utils";
import { DatePicker } from "../ui/date-picker";
import { useRouter } from "next/navigation";

export const ModalTimesWorksTask = () => {
  const router = useRouter();
  const [timeWorksTask, setTimeWorksTask] = useState<TasksTimesWorks[]>([]);
  const { isOpen, onClose, data, typeM } = useModal();
  const open = isOpen && typeM === "timesWorkTask";
  const [isAddTime, setisAddTime] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTimeWorksTask(data?.timesWokrs ?? []);
  }, [data?.timesWokrs]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const onCreteTimeWork = () => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await axios.post<ResponseModel<TasksTimesWorks>>(
          "/api/board/times-work-task",
          {
            idTask: data?.idTask,
            timeInit: new Date(),
          }
        );
        if (response.status !== 200) {
          throw new Error("Error in create new time");
        }
        let times: Array<TasksTimesWorks> = [...timeWorksTask];
        times.push({
          createdAt: new Date(response.data.data?.createdAt!),
          id: response.data.data?.id ?? "",
          taskId: response.data.data?.taskId ?? "",
          timeEnd: null,
          timeInit: new Date(response.data.data?.timeInit!),
          updatedAt: new Date(response.data.data?.updatedAt!),
        });
        sortTimes(times);
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error(`Error:${error}`);
      }
    });
  };

  const onAddTimeEndNow = (timeWork: TasksTimesWorks, index: number) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await axios.put<ResponseModel<TasksTimesWorks>>(
          "/api/board/times-work-task",
          {
            idTask: data?.idTask,
            timeEnd: new Date(),
            idTimeWork: timeWork.id,
          }
        );
        if (response.status !== 200) {
          throw new Error("Error in update time work");
        }

        let times: Array<TasksTimesWorks> = [...timeWorksTask];
        const indexI = times.findIndex((e) => e.id == timeWork.id);
        times[indexI] = response.data.data!;
        sortTimes(times);

        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error(`Error: ${error}`);
      }
    });
  };

  const onAddTimeEnd = (timeWork: TasksTimesWorks, timeEnd: Date) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await axios.put<ResponseModel<TasksTimesWorks>>(
          "/api/board/times-work-task",
          {
            idTask: data?.idTask,
            timeEnd: timeEnd,
            idTimeWork: timeWork.id,
          }
        );
        if (response.status !== 200) {
          throw new Error("Error in update time work");
        }

        let times: Array<TasksTimesWorks> = [...timeWorksTask];
        const indexI = times.findIndex((e) => e.id == timeWork.id);
        times[indexI] = response.data.data!;
        sortTimes(times);

        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error(`Error: ${error}`);
      }
    });
  };

  const onRemoveTime = (time: TasksTimesWorks) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await axios.delete("/api/board/times-work-task", {
          data: {
            idTask: data?.idTask,
            idTimeWork: time.id,
          },
        });
        if (response.status !== 200) {
          throw new Error("Error in remove time task");
        }
        let times: Array<TasksTimesWorks> = [...timeWorksTask];
        const indexI = times.findIndex((e) => e.id == time.id);
        times.splice(indexI, 1);
        sortTimes(times);
        router.refresh();
      } catch (error) {
        console.log(error);
        toast.error(`Error: ${error}`);
      }
    });
  };

  const sortTimes = (timeWorksTask: Array<TasksTimesWorks>) => {
    let times: Array<TasksTimesWorks> = [...timeWorksTask];
    try {
      times.sort((b, a) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    } catch (error) {
      console.log(error);
    }
    setTimeWorksTask(times);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tiempos Trabajo</DialogTitle>
          <DialogDescription>
            En este apartado puedes agregar una hora de inicio y una hora final
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          {isPending && (
            <div className="w-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          )}
          <div className="w-full flex items-center">
            <Button
              onClick={onCreteTimeWork}
              disabled={isPending}
              className="flex items-center space-x-2"
            >
              <p className="text-sm">Añadir un tiempo</p>
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
          {timeWorksTask.map((t, index) => (
            <div
              key={t.id}
              className="mt-2 mb-2 w-full rounded-sm border border-grisHover p-2 flex items-center"
            >
              <div className="w-[80%] flex items-center justify-start space-x-3">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">Tiempo Inicio</p>
                  <p className="text-sm">
                    {formatDate(t.timeInit, "dd/MM/yyyy HH:mm a")}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">Tiempo Final</p>
                  {t.timeEnd && (
                    <p className="text-sm">
                      {formatDate(t.timeEnd, "dd/MM/yyyy HH:mm a")}
                    </p>
                  )}
                  {t.timeEnd == null && (
                    <div className="flex flex-col space-y-4 mt-2">
                      <Button
                        disabled={isPending}
                        onClick={() => onAddTimeEndNow(t, index)}
                        size="sm"
                      >
                        Termine Ahora
                      </Button>
                      <DatePicker
                        showTimePicker
                        onClosePanel={false}
                        date={new Date()}
                        onChangeDate={(c) => {
                          if (!c) {
                            return;
                          }
                          onAddTimeEnd(t, c);
                        }}
                      >
                        <Button
                          disabled={isPending}
                          size="sm"
                          variant="secondary"
                        >
                          Escoger tiempo
                        </Button>
                      </DatePicker>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[20%] flex items-center space-x-2">
                <Button disabled={isPending} size="icon" variant="default">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onRemoveTime(t)}
                  disabled={isPending}
                  size="icon"
                  variant="destructive"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
