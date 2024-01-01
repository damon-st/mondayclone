"use client";

import { useModal } from "@/hooks/use_moda";
import { BoardUser, Files } from "@prisma/client";
import { File, PlusCircle } from "lucide-react";

interface TaskFileProps {
  idTask: string;
  files: Files[];
  canSelectFiles: boolean;
}

export const TaskFile = ({ files, idTask, canSelectFiles }: TaskFileProps) => {
  const { onOpen } = useModal();

  const onOpenModal = () => {
    if (!canSelectFiles) return;
    onOpen("uploadFile", {
      idTask,
      files,
    });
  };
  return (
    <div
      onClick={onOpenModal}
      className="cursor-pointer w-[10.4rem] h-10 border-r border-grisHover group flex items-center justify-center"
    >
      {files.length > 0 && (
        <div className="overflow-hidden flex items-center">
          <p className="text-sm">{files.length} Archivo</p>
        </div>
      )}
      <div className="hidden group-hover:flex h-6 w-6  items-center relative">
        <File className="w-6 h-6" />
        <PlusCircle className="w-3 h-3 text-white absolute left-0 bottom-0 fill-azul" />
      </div>
    </div>
  );
};
