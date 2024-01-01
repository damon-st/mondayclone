"use client";
import { Check, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use_moda";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { PermitionsBoard, SharedBoard } from "@prisma/client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";

const formSchema = z.object({
  permitions: z.enum([PermitionsBoard.read, PermitionsBoard.readAndWrite]),
});

export function SharedBoardModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permitions: "read",
    },
  });

  const [isPending, startTransition] = useTransition();

  const [valueURL, setValueURL] = useState("");
  const [copy, setCopy] = useState(false);
  const { isOpen, onClose, typeM, data } = useModal();
  const open = isOpen && typeM === "sharedBoard";

  const onCopy = async () => {
    try {
      if (copy) return;
      await navigator.clipboard.writeText(valueURL);
      setCopy(true);
      toast.success("Copy url into clipboard");
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    } catch (error) {
      setCopy(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await axios.post<ResponseModel<SharedBoard>>(
          "/api/shared-board",
          {
            ...values,
            idBoard: data?.idBoard,
          }
        );

        if (response.status != 200) {
          throw new Error("Error in create url shared");
        }
        setValueURL(
          `${process.env.NEXT_PUBLIC_URL}/invite/${response.data.data?.id}`
        );
        toast.success("Creating shared url succefully");
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  }

  const handleClose = () => {
    setValueURL("");
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir tablero</DialogTitle>
          <DialogDescription>
            Cualquier persona con este link podra unirse a este tablero
          </DialogDescription>
        </DialogHeader>
        {!valueURL.length && (
          <div className="w-full mt-2 mb-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="permitions"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Escoge los permisos para tu tablero</FormLabel>
                      <FormControl>
                        <RadioGroup
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="read" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Solo lectura
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="readAndWrite" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Lectura y escritura
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex items-center justify-end">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="flex items-center justify-center space-x-2"
                  >
                    <p className="text-sm"> Crear link</p>
                    {isPending && (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        {valueURL.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={valueURL} readOnly />
            </div>
            <Button onClick={onCopy} type="button" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              {copy ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
