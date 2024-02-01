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
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationsM extends ConversationsTasks {
  user: Users;
}

export const ModalConversationTasks = () => {
  const [conversations, setConversations] = useState<Array<ConversationsM>>([]);
  const [loadinConver, setLoadinConver] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { onClose, isOpen, data, typeM } = useModal();

  const open = isOpen && typeM === "conversationTask";
  const onHandleClose = () => {
    onClose();
  };

  const onSaveCon = (con: ConversationsM) => {
    setConversations((prevs) => [con, ...prevs]);
  };

  const fetchConversation = useCallback(async () => {
    try {
      setLoadinConver(true);
      const response = await axios.get<ResponseModel<Array<ConversationsM>>>(
        `/api/board/tasks/conversations/${data?.taskConversationM?.idTask}`
      );

      if (response.data.data) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadinConver(false);
    }
  }, [data?.taskConversationM?.idTask]);

  const onRemoveConversation = (con: ConversationsM) => {
    if (isPending) return;
    toast.success("Remove conversation please waiting");
    startTransition(async () => {
      try {
        const response = await axios.delete("/api/board/tasks/conversations", {
          data: {
            idTask: data?.taskConversationM?.idTask,
            idConversation: con.id,
          },
        });
        setConversations((prev) => prev.filter((v) => v.id != con.id));
      } catch (error) {
        toast.error(`Error:${error}`);
      }
    });
  };

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
        <EditorQuillConversationTaks
          idTask={data?.taskConversationM?.idTask ?? ""}
          onSaveCon={onSaveCon}
        />
        <div className="w-full h-[75%] overflow-y-auto overflow-x-hidden">
          {loadinConver && <ConversationSkeleton />}
          {conversations.map((con) => (
            <ConversationDescription
              onRemoveItem={() => onRemoveConversation(con)}
              key={con.id}
              con={con}
              user={con.user}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ConversationSkeleton = () => {
  return [...Array(4)].map((_, i) => (
    <Skeleton className="w-full h-56 bg-grisHover mt-2 mb-2" key={i} />
  ));
};
