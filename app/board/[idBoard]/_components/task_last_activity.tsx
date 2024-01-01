"use client";

import { CustomToolpip } from "@/components/custom_toltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/use_moda";
import { formatDate, timeAgo } from "@/lib/utils";
import { ResponseModel } from "@/models/response_model";
import { ActivityBoard, Users } from "@prisma/client";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";

interface ActivityBoardResult extends ActivityBoard {
  user: Users;
}

interface TaskLastActivityProps {
  idTask: string;
  title: string;
}

export const TaskLastActivity = ({ idTask, title }: TaskLastActivityProps) => {
  const { onOpen } = useModal();
  const [isPending, startTransition] = useTransition();
  const [activity, setActivity] = useState<ActivityBoardResult | null>(null);
  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await axios.post<
          ResponseModel<ActivityBoardResult | null>
        >("/api/board/activity/tasks", {
          idTask,
        });
        if (response.status != 200) {
          return;
        }
        setActivity(response.data.data!);
      } catch (error) {
        // toast.error(`Error: ${error}`);
      }
    });
  }, [idTask]);

  const onSeeActivitys = () => {
    onOpen("activityTasks", {
      idTask,
      titleTask: title,
    });
  };

  return (
    <div className="w-[10.4rem] h-10 border-r border-grisHover flex items-center justify-center">
      {isPending && <Skeleton className="w-[90%] h-[80%] rounded-sm" />}
      {activity && (
        <CustomToolpip
          side="left"
          msg={
            "Actualizado por " +
            activity.user.name +
            " el " +
            formatDate(activity.createdAt, "dd MMM yyyy HH:mm a")
          }
        >
          <div
            onClick={onSeeActivitys}
            className="flex items-center  w-full cursor-pointer"
          >
            <div className="w-[40%] h-full flex items-center justify-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.user.photo ?? ""} alt="User" />
                <AvatarFallback>
                  {activity.user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="w-[60%] h-full flex items-center overflow-hidden">
              <p className="text-xs font-normal">
                {timeAgo(activity.createdAt)}
              </p>
            </div>
          </div>
        </CustomToolpip>
      )}
    </div>
  );
};
