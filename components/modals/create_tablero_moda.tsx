"use client";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ResponseModel } from "@/models/response_model";
import { Board } from "@prisma/client";
import { createRoute } from "@/routes/routes";
import { useTransition } from "react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Escribe el nombre del tablero por favor",
  }),
  privacity: z.enum(["public", "private", "shared"]).default("public"),
});

export const CreateTableroModal = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Tablero nuevo",
      privacity: "public",
    },
  });

  const { isSubmitting } = form.formState;

  const { isOpen, onClose, typeM, data } = useModal();
  const open = isOpen && typeM == "createTablero";

  const onCloseModal = (event: boolean) => {
    onClose();
  };

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const promise = axios.post<ResponseModel<Board>>(
        "/api/board/create-tablero",
        {
          ...value,
          idSpaceWork: data?.idSpaceWork,
        }
      );
      toast.promise(promise, {
        loading: "Creando tablero espera...",
        error: (e) => `Error ${e}`,
        success: (d) => {
          router.refresh();
          onClose();
          startTransition(() => {
            const url = createRoute("board", {
              idBoard: d?.data?.data?.id,
              idSpaceWork: data?.idSpaceWork,
            });
            setTimeout(() => {
              router.push(url);
            }, 1000);
          });
          return "Tablero creado correctamente";
        },
      });
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Tablero</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal">
                        Nombre del tablero
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del tablero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacity"
                  render={({ field }) => (
                    <FormItem className="space-y-3 mt-5">
                      <FormLabel>Privacidad</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center justify-between "
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="public" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Principal
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Privado
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="shared" />
                            </FormControl>
                            <FormLabel className="font-normal flex space-x-2 text-black">
                              <Share2 className="w-4 h-4 text-black" />
                              Compartible
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full mt-2 flex items-center justify-end gap-x-2">
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button disabled={isSubmitting} className="bg-azul">
                    Crear tablero
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
