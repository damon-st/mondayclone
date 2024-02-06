"use client";

import axios from "axios";
import { ChevronDown, ChevronUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface ButtonColapseGroupTaskProps {
  idGroup: string;
  idBoard: string;
  color: string;
  expanded: boolean;
}

export const ButtonColapseGroupTask = ({
  idBoard,
  idGroup,
  color,
  expanded,
}: ButtonColapseGroupTaskProps) => {
  const Icon = expanded ? ChevronDown : ChevronUpIcon;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const onCollapse = () => {
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/group-tasks/update", {
        idTaks: idGroup,
        boardId: idBoard,
        expanded: !expanded,
      });
      toast.promise(promise, {
        loading: "Update collapse please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Actualizado correctamente";
        },
      });
    });
  };

  return (
    <div className="flex items-center" onClick={onCollapse}>
      <Icon
        className="w-4 h-4 cursor-pointer"
        style={{
          color: color,
        }}
      />
    </div>
  );
};
