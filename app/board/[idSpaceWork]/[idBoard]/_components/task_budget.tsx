"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";

interface TaskBudgetProps {
  idTask: string;
  budget: number;
}

export const TaskBudget = ({ idTask, budget }: TaskBudgetProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [onFocus, setOnFocus] = useState(false);
  const [value, setValue] = useState(budget.toString());

  useEffect(() => {
    setValue(budget.toString());
  }, [budget]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.length) return;
    if (isPending) return;
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        idTask,
        budget: parseFloat(value),
      });
      toast.promise(promise, {
        loading: "Saving notes please wait",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          return "Update note succefully";
        },
      });
    });
  };

  const onChangeTxt = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const letter = /[a-zA-Z]/;
      if (letter.test(e.target.value)) {
        return;
      }
      const simbols = /[!@#$%^&*()_+{}\[\]:;<>?~\\\/\-]/;

      if (simbols.test(e.target.value)) {
        return;
      }
      setValue(e.target.value);
    } catch (error) {
      console.log(error);

      toast.error("Error in number");
    }
  };

  return (
    <div className="w-[10.4rem] relative h-10 border-r border-grisHover group flex items-center justify-center">
      <div
        className={cn(
          "bg-white absolute  group-hover:block w-[90%] h-[80%] border border-grisHover"
        )}
      >
        <form
          onSubmit={onSubmit}
          className="w-full flex items-center justify-center h-full"
        >
          <Input
            type="text"
            disabled={isPending}
            onChange={onChangeTxt}
            value={value}
            onFocus={() => {
              setOnFocus(true);
            }}
            onBlur={() => setOnFocus(false)}
            className="text-center z-10 bg-white w-full h-full outline-none border-none right-0 ring-offset-0 focus-visible:ring-grisHover"
          />
        </form>
      </div>
    </div>
  );
};
