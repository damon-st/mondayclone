"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { SpaceWork } from "@prisma/client";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";
import { useRouter } from "next/navigation";

type Props = {
  spaceWork: SpaceWork;
};
export const MoreActionsSpaceWork = ({ spaceWork }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAlert, setShowAlert] = useState(false);
  const showConfirmDialog = () => {
    if (isPending) return;
    setShowAlert(true);
  };
  const handleDelete = () => {
    if (isPending) return;
    toast.loading("Please wait", {
      duration: 2000,
    });
    startTransition(async () => {
      try {
        const response = await axios.delete<ResponseModel<SpaceWork>>(
          "/api/space-work",
          {
            data: {
              idSpaceWork: spaceWork.id,
            },
          }
        );
        console.log(response);

        if (response.data.data == null) {
          toast.error("Something wrong");
          return;
        }
        router.push("/");
      } catch (error: any) {
        toast.error(`Ups something wrong ${error?.response?.data}`);
      }
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-[10%] cursor-pointer flex items-center justify-center">
            <MoreHorizontal className="w-8 h-8" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={showConfirmDialog}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Trash />
            <span>Eliminar espacio de trabajo</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showAlert} onOpenChange={(e) => setShowAlert(e)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Esta seguro de eliminar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede reacer. Se eliminara toda la informacion
              referente a este Espacio de trabajo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
