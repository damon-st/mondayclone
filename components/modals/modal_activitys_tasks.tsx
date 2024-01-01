"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use_moda";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityBoard, Users } from "@prisma/client";
import {
  formatDate,
  getStatusTaskTXT,
  getTypeActivityBoardTXT,
  timeAgoInDays,
} from "@/lib/utils";
import { ChevronRight, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypeActivityBoard } from "@/models/types";
import { colorStatusTasks } from "@/constants/constants";
interface ActivityBoardResult extends ActivityBoard {
  user: Users;
}
export const ModalActivitysTasks = () => {
  const [activitys, setActivitys] = useState<Array<ActivityBoardResult>>([]);
  const [isPending, startTransition] = useTransition();

  const { isOpen, onClose, typeM, data } = useModal();
  const open = isOpen && typeM === "activityTasks";

  useEffect(() => {
    startTransition(async () => {
      try {
        if (!data?.idTask) return;
        const response = await axios.get(
          `/api/board/activity/tasks/${data?.idTask}`
        );
        if (response.status !== 200) return;
        setActivitys(response.data.data);
      } catch (error) {}
    });
  }, [data?.idTask]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Actividad</SheetTitle>
        </SheetHeader>
        <div className="w-full p-2">
          {isPending && <ModalActivitysTasksSkeleton />}
        </div>
        <div className="w-full">
          {activitys.map((a) => (
            <div
              key={a.id}
              className="w-full mt-2 pb-1 h-12 border-b flex items-center"
            >
              <div className="w-[15%] h-12 flex items-center justify-start space-x-1">
                <Clock className="w-4 h-4 text-black" />
                <p className="text-sm">{timeAgoInDays(a.createdAt)}</p>
              </div>
              <div className="w-[35%] h-12 flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={a.user.photo ?? ""} alt="@shadcn" />
                  <AvatarFallback>{a.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="text-sm">{a.user.name}</p>
              </div>
              <div className="w-[20%] h-12 flex items-center">
                <p className="text-xs">
                  {getTypeActivityBoardTXT(a.typeActivity as TypeActivityBoard)}
                </p>
              </div>
              <div className="w-[30%] h-12 flex items-center space-x-2 overflow-hidden">
                {a.previusValue?.previusValue?.budget && (
                  <p className="text-sm">
                    {a.previusValue?.previusValue?.budget}
                  </p>
                )}
                {a.previusValue?.previusValue?.title && (
                  <p className="text-sm whitespace-nowrap">
                    {a.previusValue.previusValue.title}
                  </p>
                )}
                {a.previusValue?.previusValue?.status && (
                  <div
                    className="w-[40%] h-[50%] flex items-center justify-center text-xs text-white overflow-hidden whitespace-nowrap"
                    style={{
                      backgroundColor:
                        colorStatusTasks[a.previusValue.previusValue.status],
                    }}
                  >
                    {getStatusTaskTXT(a.previusValue.previusValue.status)}
                  </div>
                )}
                {a.previusValue?.previusValue?.notes && (
                  <div className="w-[40%] h-full flex items-center">
                    {a.previusValue?.previusValue?.notes}
                  </div>
                )}
                {a.previusValue?.previusValue?.schedule && (
                  <div className="w-[40%] h-[50%] flex items-center rounded-sm bg-green-500 text-xs text-white justify-center">
                    {formatDate(
                      a.previusValue.previusValue.schedule.dateInit,
                      "dd"
                    ) +
                      "-" +
                      formatDate(
                        a.previusValue.previusValue.schedule.dateEnd,
                        "dd MMM"
                      )}
                  </div>
                )}
                <div className="w-[10%] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
                {a.previusValue?.actualValue?.budget && (
                  <p className="text-sm">
                    {a.previusValue?.actualValue?.budget}
                  </p>
                )}
                {a.previusValue?.actualValue?.title && (
                  <p className="text-sm whitespace-nowrap">
                    {a.previusValue.actualValue.title}
                  </p>
                )}
                {a.previusValue?.actualValue?.status && (
                  <div
                    className="w-[40%] h-[50%] flex items-center justify-center text-white text-xs overflow-hidden"
                    style={{
                      backgroundColor:
                        colorStatusTasks[a.previusValue.actualValue.status],
                    }}
                  >
                    {getStatusTaskTXT(a.previusValue.actualValue.status)}
                  </div>
                )}
                {a.previusValue?.actualValue?.notes && (
                  <div className="w-[40%] h-full flex items-center">
                    {a.previusValue?.actualValue?.notes}
                  </div>
                )}
                {a.previusValue?.actualValue?.schedule && (
                  <div className="w-[40%] h-[50%] flex items-center rounded-sm bg-green-500 text-xs text-white justify-center">
                    {formatDate(
                      a.previusValue.actualValue.schedule.dateInit,
                      "dd"
                    ) +
                      "-" +
                      formatDate(
                        a.previusValue.actualValue.schedule.dateEnd,
                        "dd MMM"
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
const ModalActivitysTasksSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="w-full h-12 rounded-sm mt-8 mb-8" />
      ))}
    </>
  );
};
