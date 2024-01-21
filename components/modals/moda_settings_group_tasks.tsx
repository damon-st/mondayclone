"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useEffect, useTransition } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { colorsGroupTaks } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  title: z.string(),
  priceForHour: z.coerce.number(),
  color: z.string(),
});

export const ModalSettingsGroupTasks = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isOpen, data, onClose, typeM } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue("title", data?.groupTasks?.title ?? "");
    form.setValue("color", data?.groupTasks?.color ?? "");
    form.setValue("priceForHour", data?.groupTasks?.priceForHour ?? 10);
  }, [data?.groupTasks, form]);

  const open = isOpen && typeM === "settingsGroupTasks";

  const handleClose = () => {
    onClose();
  };

  const onSelectColor = (color: string) => {
    form.setValue("color", color);
  };

  const colorSelected = form.watch("color");

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.put("/api/board/group-tasks/update", {
          boardId: data?.idBoard,
          idTaks: data?.groupTasks?.id,
          ...value,
        });
        if (response.status != 200) {
          throw new Error("Ups something wrong in update data");
        }
        router.refresh();
        toast.success("Update data success");
      } catch (error) {
        toast.error(`Error:${error}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Opciones grupo:
            <span className="font-bold"> {data?.groupTasks?.title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del grupo de tareas</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Titulo del grupo de tareas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceForHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por hora</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="number"
                        placeholder="Precio por hora ejem: $5"
                        step="any"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel className="mt-2 mb-2">Color del grupo</FormLabel>
              <div className="grid grid-cols-5 gap-2">
                {colorsGroupTaks.map((color, index) => (
                  <div
                    onClick={() => onSelectColor(color)}
                    key={index}
                    className={cn(
                      "w-full h-12 rounded-sm cursor-pointer relative flex items-center justify-center",
                      colorSelected == color &&
                        "border-[5px] border-black shadow-lg"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {colorSelected == color && (
                      <CheckCircle2 className="size-8 text-white " />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Button
                  onClick={handleClose}
                  disabled={isPending}
                  type="button"
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button disabled={isPending}>Guardar</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
