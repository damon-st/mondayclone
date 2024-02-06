"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";
import { SpaceWork } from "@prisma/client";
import toast from "react-hot-toast";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import { useRouter } from "next/navigation";
import { createRoute } from "@/routes/routes";

const formSchema = z.object({
  nameWork: z.string().min(1),
  descriptionWork: z.string(),
});

export const ModalCreateSpaceWork = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameWork: "Espacio de trabajo nuevo",
      descriptionWork: "",
    },
  });
  const { onClose, isOpen, typeM, data } = useModal();
  const open = isOpen && typeM === "createSpaceWork";
  const hadleClose = () => {
    onClose();
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post<ResponseModel<SpaceWork>>(
        "/api/space-work",
        {
          ...values,
          idUser: data?.userId,
        }
      );
      if (response.status != 200) {
        throw new Error("Error in create");
      }
      const url = createRoute("spaceWorkDetails", {
        idSpace: response.data!.data?.id ?? "",
        idSpaceWork: response.data!.data?.id ?? "",
      });
      router.push(url);
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(`Something wrong in create ${error}`);
    }
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <Dialog open={open} onOpenChange={hadleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Agregar espacio de trabajo nuevo
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="nameWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del espacio de trabajo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end space-x-2 mt-4">
                <Button
                  disabled={isLoading}
                  type="button"
                  onClick={hadleClose}
                  variant="secondary"
                >
                  Cancelar
                </Button>
                <Button disabled={isLoading} type="submit" className="bg-azul">
                  Agregar espacio de trabajo
                  {isLoading && <Loader2 className="animate-spin" />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
