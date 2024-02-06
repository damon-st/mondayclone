"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface TaskNoteProps {
  idTask: string;
  note: string;
}

export const TaskNote = ({ idTask, note }: TaskNoteProps) => {
  const [isPending, startTransition] = useTransition();
  const [onFocus, setOnFocus] = useState(false);
  const [value, setValue] = useState(note);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        idTask,
        notes: value,
      });
      toast.promise(promise, {
        loading: "Saving notes please wait",
        error: (e) => `Error: ${e}`,
        success: () => {
          return "Update note succefully";
        },
      });
    });
  };

  return (
    <div className="w-[10.4rem] relative h-10 border-r border-grisHover group flex items-center justify-center">
      <div
        className={cn(
          "bg-white absolute hidden group-hover:block w-[90%] h-[80%] border border-grisHover",
          value.length > 1 && "flex"
        )}
      >
        <form
          onSubmit={onSubmit}
          className="w-full flex items-center justify-center h-full"
        >
          <Input
            disabled={isPending}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onFocus={() => {
              setOnFocus(true);
            }}
            onBlur={() => setOnFocus(false)}
            className="z-10 bg-white w-full h-full outline-none border-none right-0 ring-offset-0 focus-visible:ring-grisHover"
          />
        </form>
      </div>
      <div
        className={cn(
          "pointer-events-none z-10 absolute group-hover:flex hidden  items-center justify-center",
          onFocus && "opacity-0",
          value.length > 1 && "opacity-0"
        )}
      >
        <PlusCircle className="w-4 h-4 text-azul" />
        <p className="text-sm">T</p>
      </div>
    </div>
  );
};
