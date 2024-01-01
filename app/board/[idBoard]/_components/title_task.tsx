"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2),
});

interface TitleTasksProps {
  id: string;
  title: string;
  color: string;
  boardId: string;
}

export const TitleTasks = ({ id, title, color, boardId }: TitleTasksProps) => {
  const router = useRouter();
  const refInput = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const promise = axios.put("/api/board/group-tasks/update", {
        ...values,
        idTaks: id,
        boardId,
      });
      toast.promise(promise, {
        loading: "Gurdando espere por favor...",
        error: (e) => {
          console.log(e);

          return `Error: ${e}`;
        },
        success: (d) => {
          router.refresh();
          refInput.current?.blur();
          return "Actualizado correctamente";
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Ups algo salio mal intenta mas tarde");
    }
  };
  return (
    <Form {...form}>
      <form className=" sticky left-0" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  className="mt-2 p-0 mb-2 w-[60%] outline-none border-none text-xl hover:outline-neutral-200 focus:border-blue-400 focus:w-full"
                  placeholder="Name tasks"
                  style={{ color: color }}
                  {...field}
                  ref={refInput}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
