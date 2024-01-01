"use client";

import { colorsGroupTaks } from "@/constants/constants";
import { getElementRandom } from "@/lib/utils";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ButtonCreateGroupTasksProps {
  boardId: string;
  userId: string;
}
export const ButtonCreateGroupTasks = ({
  boardId,
  userId,
}: ButtonCreateGroupTasksProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const promise = axios.post("/api/board/create-group-tasks", {
        title: "Grupo nuevo",
        expanded: true,
        boardId,
        userId,
        color: getElementRandom(colorsGroupTaks),
      });
      toast.promise(promise, {
        loading: "Creating new group task",
        error: (e) => {
          setLoading(false);
          return `Error: ${e}`;
        },
        success: (v) => {
          router.refresh();
          setLoading(false);
          return "Create group tasks succefully";
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div className="w-full flex items-center">
      <div className="w-[3%]"></div>
      <div className="w-[97%] flex items-center">
        <button
          onClick={onCreate}
          type="button"
          disabled={loading}
          className="flex mt-2 items-center space-x-2 p-2 border rounded-sm hover:bg-grisHover transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <p className="text-black text-sm">Agregar grupo nuevo</p>
        </button>
      </div>
    </div>
  );
};
