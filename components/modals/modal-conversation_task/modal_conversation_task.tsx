"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useModal } from "@/hooks/use_moda";
import { InputTitleConversationTask } from "./input_title_task";
import { MoreHorizontal } from "lucide-react";
import { EditorQuillConversationTaks } from "./editor-quill-conversation-task";
import { useCallback, useEffect, useState, useTransition } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ConversationsTasks, Users } from "@prisma/client";
import { ResponseModel } from "@/models/response_model";
import { ConversationDescription } from "./conversation_description";

interface ConversationsM extends ConversationsTasks {
  user: Users;
}

export const ModalConversationTasks = () => {
  const [conversations, setConversations] = useState<Array<ConversationsM>>([]);
  const [isPending, startTransition] = useTransition();

  const { onClose, isOpen, data, typeM } = useModal();

  const open = isOpen && typeM === "conversationTask";
  const onHandleClose = () => {
    onClose();
  };

  const onSave = (value: string) => {
    if (value.length < 2) {
      toast.error("Please message is required");
      return;
    }
    if (isPending) return;
    startTransition(async () => {
      try {
        const result = await axios.post<ResponseModel<ConversationsM>>(
          "/api/board/tasks/conversations",
          {
            idTask: data?.taskConversationM?.idTask,
            description: value,
          }
        );
        if (!result.data.data) {
          throw new Error("Error un save");
        }
        setConversations((prevs) => [result.data.data!, ...prevs]);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  };

  const fetchConversation = useCallback(async () => {
    try {
      const response = await axios.get<ResponseModel<Array<ConversationsM>>>(
        `/api/board/tasks/conversations/${data?.taskConversationM?.idTask}`
      );

      if (response.data.data) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data?.taskConversationM?.idTask]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);
  return (
    <Sheet open={open} onOpenChange={onHandleClose}>
      <SheetContent useLefIcon>
        <SheetHeader className="mt-5">
          <SheetTitle className="flex items-center">
            <div className="w-[80%]">
              <InputTitleConversationTask
                idTask={data?.taskConversationM?.idTask ?? ""}
                title={data?.taskConversationM?.title ?? ""}
              />
            </div>
            <div className="w-[20%] flex items-center justify-end space-x-2">
              <div className="rounded-sm hover:bg-grisHover cursor-pointer">
                <MoreHorizontal className="size-8" />
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 mb-4 h-[1px] w-full bg-grisHover"></div>
        <EditorQuillConversationTaks disabled={isPending} onSave={onSave} />
        <div className="w-full h-[65%] overflow-y-auto overflow-x-hidden">
          {conversations.map((con) => (
            <ConversationDescription key={con.id} con={con} user={con.user} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
