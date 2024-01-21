"use client";

import { CustomToolpip } from "@/components/custom_toltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronRight, Maximize2 } from "lucide-react";
import {
  ElementRef,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";

interface TaskTitle {
  idTask: string;
  title: string;
  onOpenConversation: () => void;
}

export const TaskTitleInput = ({
  idTask,
  title,
  onOpenConversation,
}: TaskTitle) => {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<ElementRef<"input">>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    if (value.length < 2) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        title: value,
        idTask,
      });
      toast.promise(promise, {
        loading: "Upaded title please waiting",
        error: (e) => `Error: ${e}`,
        success: () => {
          inputRef.current?.blur();
          setFocus(false);
          return "Success updated title taks";
        },
      });
    });
  };

  return (
    <div className="w-full h-full flex items-center group">
      <div className="w-[10%] flex items-center justify-center">
        <CustomToolpip msg="Expandir subelementos">
          <div className="hidden group-hover:flex  items-center justify-center rounded-sm p-1 hover:bg-grisHover cursor-pointer ">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </CustomToolpip>
      </div>
      <form
        onSubmit={onSubmit}
        className={cn("w-[70%] flex items-center h-full", focus && "w-[90%]")}
      >
        <Input
          ref={inputRef}
          disabled={isPending}
          onBlur={(e) => {
            setFocus(false);
          }}
          onFocus={(e) => {
            setFocus(true);
          }}
          className="p-0 m-0 border-transparent hover:border-grisHover h-[60%] rounded-sm outline-none  right-0 focus-visible:ring-grisHover"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
      <div
        className={cn(
          "w-[20%] flex items-center justify-center",
          focus && "hidden"
        )}
      >
        <CustomToolpip msg="Abrir pagina de tarea">
          <div
            onClick={onOpenConversation}
            className="hidden group-hover:flex spx1  items-center justify-center rounded-sm p-1 hover:bg-grisHover cursor-pointer "
          >
            <Maximize2 className="w-4 h-4 text-gray-500" />
            <p className="text-gray-500 text-xs">Abrir</p>
          </div>
        </CustomToolpip>
      </div>
    </div>
  );
};
