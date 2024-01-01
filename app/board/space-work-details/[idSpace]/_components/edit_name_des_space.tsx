"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nameWork: z.string().min(2),
  descriptionWork: z.string(),
});

interface EditNameDesSpaceWorkProps {
  nameWork: string;
  id: string;
  userId: string;
  descriptionWork: string;
}

export const EditNameDesSpaceWork = ({
  id,
  nameWork,
  userId,
  descriptionWork,
}: EditNameDesSpaceWorkProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameWork: nameWork,
      descriptionWork: descriptionWork,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const promise = axios.put("/api/space-work", {
        ...values,
        id,
        userId,
      });
      toast.promise(promise, {
        loading: "Guardando",
        error: (e) => {
          return `Error: ${e}`;
        },
        success: (s) => {
          router.refresh();
          return "Actualizado correctamente";
        },
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="ml-5 w-full">
        <FormField
          control={form.control}
          name="nameWork"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  className="mt-2 w-full outline-none border-none text-2xl hover:outline-neutral-200 focus:border-blue-400"
                  placeholder="Name work"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionWork"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  className="mt-2 w-full resize-none outline-none border-none text-sm hover:outline-neutral-200 focus:border-blue-400"
                  placeholder="Agregar descripcion del espacio de trabajo"
                  {...field}
                ></Textarea>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
