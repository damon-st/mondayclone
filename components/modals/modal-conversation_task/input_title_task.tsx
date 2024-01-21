"use client";

import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import router from "next/router";
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2),
});

interface InputTitleConversationTaskProps {
  idTask: string;
  title: string;
}

export const InputTitleConversationTask = ({
  idTask,
  title,
}: InputTitleConversationTaskProps) => {
  const inpuRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
    },
  });
  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value);
    startTransition(() => {
      const promise = axios.put("/api/board/tasks/update", {
        title: value.title,
        idTask: idTask,
      });
      toast.promise(promise, {
        loading: "Updated title please wait",
        error: (e) => `Error: ${e}`,
        success: () => {
          router.refresh();
          inpuRef.current?.blur();
          return "Success update title";
        },
      });
    });
  };
  useEffect(() => {
    form.setValue("title", title);
  }, [title, form]);
  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormControl>
              <Input
                disabled={isPending}
                className="text-xl focus:text-2xl p-0 m-0 border-transparent hover:border-grisHover h-[60%] rounded-sm outline-none  right-0 focus-visible:ring-grisHover"
                {...field}
                ref={inpuRef}
              />
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};
