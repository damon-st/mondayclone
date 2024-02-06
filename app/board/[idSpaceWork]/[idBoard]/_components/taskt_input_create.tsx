"use client";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, ElementRef } from "react";
import toast from "react-hot-toast";

interface TaskInputCreateProps {
  idGroupTasks: string;
  color: string;
}

export const TaskInputCreate = ({
  idGroupTasks,
  color,
}: TaskInputCreateProps) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);
  const router = useRouter();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    try {
      if (loading) return;
      setLoading(true);
      e.preventDefault();
      console.log(value);
      inputRef.current?.blur();
      const promise = axios.post("/api/board/tasks/create", {
        idGroupTasks,
        title: value,
      });
      toast.promise(promise, {
        loading: "Creating task plese waiting...",
        error: (e) => `Error in create: ${e}`,
        success: () => {
          setLoading(false);
          setValue("");
          router.refresh();
          return "Creating task succefully";
        },
      });
    } catch (error) {
      toast.error(`Error: ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center ">
      <div className="w-[2.22rem] h-10"></div>
      <div className="w-full  rounded-b-sm">
        <div className="w-full flex items-center border-b border-grisHover border-r">
          <div
            style={{ borderLeftColor: color }}
            className="border-l-4 rounded-b flex items-center sticky left-0"
          >
            <div className="w-10 border-r border-grisHover flex items-center justify-center h-10 ">
              <Square className="w-5 h-5 text-grisHover" />
            </div>
            <div className="ml-5 flex items-center ">
              <form onSubmit={onSubmit} className="w-full">
                <Input
                  ref={inputRef}
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  className="w-auto p-0 m-0 focus:w-full focus:m-0 focus:p-0 border-transparent outline-none hover:border-grisHover focus:border-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-grisHover"
                  placeholder="+Agregar Tarea"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
