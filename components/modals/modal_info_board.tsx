"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use_moda";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "../ui/skeleton";
import { LucideLayoutDashboard, MessagesSquareIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { IconSpaceWork } from "../icon_space_work";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomToolpip } from "../custom_toltip";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
});

export const ModalInfoBoard = () => {
  const router = useRouter();
  const [userCreated, setUserCreated] = useState<Users | null>(null);
  const [usersPropiertes, setUsersPropiertes] = useState<Users[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [isPendingUsers, startTransitionUsers] = useTransition();
  const { onClose, data, typeM, isOpen } = useModal();
  const open = isOpen && typeM === "infoBoard";
  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  useEffect(() => {
    form.setValue("title", data?.boardInfo?.title ?? "");
    form.setValue("description", data?.boardInfo?.description ?? "");
  }, [data, form]);

  useEffect(() => {
    startTransitionUsers(async () => {
      try {
        if (!data?.boardInfo) return;
        const response = await axios.get<ResponseModel<Users>>(
          `/api/user/${data?.boardInfo?.createdUser}`
        );
        if (response.status != 200) {
          throw new Error("User created not found");
        }
        setUserCreated(response.data.data!);
        const responseUsers = await Promise.all(
          (data?.boardInfo?.boardUser ?? []).map((u) => {
            return axios.get<ResponseModel<Users>>(`/api/user/${u.userId}`);
          })
        );
        const users = responseUsers.map((u) => u.data.data!);
        setUsersPropiertes(users);
      } catch (error) {
        console.log(error);
      }
    });
  }, [
    data?.boardInfo,
    data?.boardInfo?.boardUser,
    data?.boardInfo?.createdUser,
  ]);

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const response = await axios.put(
          `/api/board/${data?.boardInfo?.boardId}/update`,
          {
            ...value,
          }
        );
        if (response.status != 200) {
          throw new Error("Something wrong in update data");
        }
        router.refresh();
        toast.success(`Update data success`);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 " style={{ maxWidth: "51rem" }}>
        <div className="w-full h-[60vh] flex">
          <div className="w-[60%] h-full">
            <div className="w-full h-[90%] p-2">
              <Form {...form}>
                <form
                  className="w-full h-full"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Nombre del tablero"
                            className="outline-none ring-offset-0 right-0 border-none text-2xl ring-grisHover hover:ring-1 focus:ring-azul focus:ring-offset-0"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="mt-4"></div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <Textarea
                          placeholder="Descripcion"
                          className="resize-none border-dotted border-transparent hover:border-grisHover focus:h-[70%]"
                          {...field}
                        ></Textarea>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            <div className="w-full h-[10%] flex items-center pl-4 space-x-2 hover:text-azul cursor-pointer transition-colors duration-200">
              <MessagesSquareIcon className="size-6" />
              <p className="text-sm">Dejar comentarios</p>
            </div>
          </div>
          <div className="w-[40%] h-full bg-grisDialog relative p-4 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center mt-4 mb-4">
              <p className="text-lg">Información del tablero</p>
            </div>
            <div className="flex flex-col items-start mt-2 mb-2">
              <p className="text-sm font-normal ">Información del tablero</p>
              <div className="flex items-center space-x-2">
                <IconSpaceWork
                  size="sm"
                  nameWork={data?.boardInfo?.nameSpace ?? ""}
                />
                <p className="text-sm font-normal">
                  {data?.boardInfo?.nameSpace}
                </p>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <p className="text-sm font-normal ">Creador por</p>
              <div className="flex space-x-2 relative h-10">
                {userCreated && (
                  <CustomToolpip msg={userCreated.name ?? ""}>
                    <Avatar>
                      <AvatarImage src={userCreated.photo ?? ""} />
                      <AvatarFallback>
                        {userCreated.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </CustomToolpip>
                )}
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm font-normal">
                    {formatDate(
                      data?.boardInfo?.createdAt ?? new Date(),
                      "dd MMMM yyyy"
                    )}
                  </p>
                </div>
                {isPendingUsers && (
                  <Skeleton className="w-full h-full absolute" />
                )}
              </div>
            </div>
            <div className="mt-4 mb-4 relative">
              <p className="text-sm font-normal ">Propietarios</p>
              {usersPropiertes.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 mt-2">
                  <CustomToolpip msg={user.name ?? ""}>
                    <Avatar>
                      <AvatarImage src={user.photo ?? ""} />
                      <AvatarFallback>
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </CustomToolpip>
                  <p className="text-sm font-normal">{user.name}</p>
                </div>
              ))}
              {isPendingUsers && <Skeleton className="w-full h-12 absolute" />}
            </div>
            <div className="mt-4 w-full">
              <p className="text-sm font-normal">Tipo de tablero</p>
              <div className="w-full flex space-x-2">
                <LucideLayoutDashboard className="size-6" />
                <p className="text-sm font-normal">
                  Este tablero es público; lo pueden ver todos los miembros del
                  equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
