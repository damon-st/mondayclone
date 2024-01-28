"use client";

import { useModal } from "@/hooks/use_moda";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { UploadFileResponse } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { X } from "lucide-react";
import axios from "axios";

export const ModalPaidGroupTasks = () => {
  const [paidImgUrl, setPaidImgUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { isOpen, data, onClose, typeM } = useModal();
  const open = isOpen && typeM == "paidGroupTasks";
  const handleClose = () => {
    onClose();
  };

  const onUploadImg = (
    res: UploadFileResponse<{
      uploadedBy: string;
    }>[]
  ) => {
    const file = res[0];
    setPaidImgUrl(file.url);
  };

  const removImg = () => {
    setPaidImgUrl(null);
  };

  const onSave = () => {
    if (isPending) return;
    if (!paidImgUrl) {
      toast.error("Please upload image is required");
      return;
    }
    startTransition(async () => {
      try {
        const existPaid = {
          paid: true,
          paidImgUrl,
        };
        await axios.put("/api/board/group-tasks/update", {
          boardId: data?.idBoard,
          idTaks: data?.groupTasks?.id,
          paid: existPaid,
        });
        setPaidImgUrl(null);
        toast.success("Save paid success");
        router.refresh();
        onClose();
      } catch (error) {
        toast.error(`Error:${error}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir pago al grupo de tareas?</DialogTitle>
          <DialogDescription>Añade el comprobante del pago</DialogDescription>
        </DialogHeader>
        {paidImgUrl ? (
          <div className="w-full border-dotted h-52 flex items-center justify-center relative">
            <Image src={paidImgUrl} fill alt="paid" />
            <div
              onClick={removImg}
              className="cursor-pointer shadow-sm size-10 rounded-full bg-red-500 flex items-center justify-center absolute top-3 right-3"
            >
              <X className="size-6 text-white" />
            </div>
          </div>
        ) : (
          <UploadDropzone
            onClientUploadComplete={onUploadImg}
            endpoint="imageUploader"
          />
        )}
        <div className="w-full mt-2 flex items-center justify-between">
          <Button
            disabled={isPending}
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isPending} type="button">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
