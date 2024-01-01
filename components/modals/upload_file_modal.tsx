import { Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { UploadDropzone } from "@/lib/uploadthing";
import { UploadFileResponse } from "uploadthing/client";
import { useTransition } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function UploadFileModal() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { isOpen, onClose, typeM, data } = useModal();
  const open = isOpen && typeM === "uploadFile";
  const onUploadImg = (
    res: UploadFileResponse<{
      uploadedBy: string;
    }>[]
  ) => {
    startTransition(async () => {
      try {
        const file = res[0];
        const exteions = file.name.split(".");
        const extension = exteions[exteions.length - 1];
        const url = file.url;
        await axios.post("/api/files", {
          extension,
          url,
          taskId: data?.idTask,
          name: file.name,
        });
        router.refresh();
        onClose();
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir archivo</DialogTitle>
          <DialogDescription>
            Puedes subir una imagen o un PDF
          </DialogDescription>
        </DialogHeader>
        {data?.files && (
          <div className="w-full p-2 flex flex-col">
            {data.files.map((f) => (
              <a
                href={f.url}
                target="_blank"
                className="mt-1 mb-1 w-full p-2 rounded-sm bg-celeste flex items-center justify-between"
                key={f.id}
              >
                <p className="text-sm">{f.name ?? "Archivo"}</p>
                <p className="text-sm">{f.extension}</p>
              </a>
            ))}
          </div>
        )}
        <div className="w-full relative ">
          <UploadDropzone
            onClientUploadComplete={onUploadImg}
            endpoint="imageUploader"
          />
          {isPending && (
            <div className="w-full h-full top-0 rounded-sm absolute z-10 bg-black/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
