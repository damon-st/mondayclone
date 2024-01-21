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

export const ModalConversationTasks = () => {
  const { onClose, isOpen, data, typeM } = useModal();

  const open = isOpen && typeM === "conversationTask";
  const onHandleClose = () => {
    onClose();
  };

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
        <EditorQuillConversationTaks />
      </SheetContent>
    </Sheet>
  );
};
