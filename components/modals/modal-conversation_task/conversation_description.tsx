"use client";

import { ConversationsTasks, Users } from "@prisma/client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Clock, MoreHorizontal, Reply, ThumbsUp } from "lucide-react";
import { formatDate, timeAgo, timeAgoInDays } from "@/lib/utils";
import { CustomToolpip } from "@/components/custom_toltip";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationDescriptionProps {
  con: ConversationsTasks;
  user: Users;
}

export const ConversationDescription = ({
  con,
  user,
}: ConversationDescriptionProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
        loading: () => <Skeleton className="w-full h-24 bg-grisHover" />,
      }),
    []
  );
  const msgToolTime = formatDate(con.createdAt, "dd MMMM HH:mm");
  return (
    <>
      <div
        key={con.id}
        className="rounded-lg border border-grisHover mt-2 mb-2"
      >
        <div className="w-full flex justify-between p-2">
          <div className="flex space-x-2">
            <Avatar>
              <AvatarImage src={user.photo ?? ""} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="h-10 flex items-center">
              <p className="text-sm">{user.name}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <CustomToolpip msg={msgToolTime}>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Clock className="size-4" />
                <p className="text-sm">{timeAgoInDays(con.createdAt)}</p>
              </div>
            </CustomToolpip>
            <div className="rounded-sm hover:bg-grisHover flex items-center justify-center p-2 cursor-pointer h-8">
              <Bell className="size-4" />
            </div>
            <div className="rounded-sm hover:bg-grisHover flex items-center justify-center p-2 cursor-pointer h-8">
              <MoreHorizontal className="size-4" />
            </div>
          </div>
        </div>
        <div className="w-full">
          <ReactQuill
            id="quillRef"
            theme="bubble"
            value={con.description}
            readOnly={true}
          />
        </div>
        <div className="w-full border-t border-grisHover flex p-2">
          <div className="w-1/2 h-8 hover:bg-grisHover rounded-sm cursor-pointer flex items-center justify-center space-x-2">
            <ThumbsUp className="size-4" />
            <p className="text-sm">Me gusta</p>
          </div>
          <div className="w-1/2 h-8 hover:bg-grisHover rounded-sm cursor-pointer flex items-center justify-center space-x-2">
            <Reply className="size-4" />
            <p className="text-sm">Resonder</p>
          </div>
        </div>
      </div>
    </>
  );
};
