"use client";
import { CustomToolpip } from "@/components/custom_toltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  BarChart,
  BrainCircuit,
  ChevronDown,
  Home,
  Info,
  MoreHorizontal,
  Plug,
  Plus,
  Star,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { promise, z } from "zod";
import { TypesUpdateBoard } from "@/models/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useModal } from "@/hooks/use_moda";

interface HeadProps {
  title: string;
  description: string;
  boardId: string;
  favorite: boolean;
  usersLength: number;
}

const formSchema = z.object({
  title: z.string().min(2),
});

export const HeadBoard = ({
  boardId,
  favorite: favoriteM,
  title,
  description,
  usersLength,
}: HeadProps) => {
  const [favorite, setFavorite] = useState(favoriteM);
  const { onOpen } = useModal();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmitTitle = (value: z.infer<typeof formSchema>) => {
    try {
      const promise = axios.put(`/api/board/${boardId}/update`, {
        ...value,
        type: TypesUpdateBoard.title,
      });
      toast.promise(promise, {
        loading: "Actualizando informacion",
        error: (e) => `Error: ${e}`,
        success: (v) => {
          router.refresh();
          return "Actualizado correctamente";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(`Error:${error}`);
    }
  };

  const onFavorite = () => {
    try {
      const tempFavorite = !favorite;
      const promise = axios.put(`/api/board/${boardId}/update`, {
        favorite: tempFavorite,
        type: TypesUpdateBoard.favorite,
      });
      toast.promise(promise, {
        loading: "Actualizando informacion",
        error: (e) => `Error: ${e}`,
        success: (v) => {
          router.refresh();
          setFavorite(tempFavorite);
          return "Actualizado correctamente";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };

  const onShared = () => {
    onOpen("sharedBoard", {
      idBoard: boardId,
    });
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[70%] flex items-center">
        <div className="w-[70%] h-full">
          <div className="w-full  items-center ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitTitle)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          title="name"
                          className="mt-2 w-[25%] focus:w-[90%] outline-none border-none text-2xl hover:outline-neutral-200 focus:border-blue-400"
                          placeholder="Nombre del tablero"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center space-x-2 ml-2">
                        <CustomToolpip msg="Mostrar la descripción del tablero">
                          <div className="rounded-sm p-2 hover:bg-grisHover text-black transition duration-200">
                            <Info className="w-4 h-4" />
                          </div>
                        </CustomToolpip>

                        <CustomToolpip
                          msg={
                            favorite
                              ? "Eliminar de favoritos"
                              : "Agregar a favoritos"
                          }
                        >
                          <div
                            onClick={onFavorite}
                            className="rounded-sm p-2 hover:bg-grisHover text-black transition duration-200"
                          >
                            <Star
                              className={cn(
                                "w-4 h-4",
                                favorite && "text-yellow-300 fill-yellow-300"
                              )}
                            />
                          </div>
                        </CustomToolpip>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="w-full flex items-center space-x-2">
            <div className="w-[70%] flex items-center overflow-hidden">
              <p className="font-normal text-sm whitespace-nowrap">
                {description}
              </p>
            </div>
            <p className="text-azul underline cursor-pointer">Ver más</p>
          </div>
        </div>
        <div className="w-[30%] h-full flex items-center space-x-2">
          <div className="flex items-center rounded-sm p-2 hover:bg-grisHover transition-colors cursor-pointer duration-200">
            <p>Actividad</p>
            <BarChart className="text-azul h-4 w-4" />
          </div>
          <div
            onClick={onShared}
            className="flex items-center space-x-2 border rounded-sm p-2 hover:bg-grisHover transition-colors cursor-pointer duration-200"
          >
            <UserPlus className="text-black h-4 w-4" />
            <p>Invitar/{usersLength}</p>
          </div>
          <div className="flex items-center rounded-sm p-2 hover:bg-grisHover transition-colors cursor-pointer duration-200">
            <MoreHorizontal className="text-black h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="w-full h-[30%] flex items-center border-b justify-between">
        <div className="h-full items-center flex space-x-2">
          <div className="flex items-center border-b-2 border-azul space-x-2 cursor-pointer p-2 rounded-sm hover:bg-grisHover duration-200 transition">
            <Home className="w-4 h-4" />
            <p className="text-sm">Tabla principal</p>
          </div>
          <div className="w-[1px] h-4 bg-grisHover"></div>
          <div className="cursor-pointer flex items-center justify-center p-2 rounded-sm duration-200 transition-colors hover:bg-grisHover">
            <Plus className="w-4 h-4 " />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="group hover:bg-grisHover  cursor-pointer rounded-sm space-x-2 p-2 duration-200 transition-colors  flex items-center justify-center">
            <Plug className="w-4 h-4" />
            <p>Integrar</p>
            <div className="w-8 h-8 relative rounded-sm border opacity-50 group-hover:opacity-100">
              <Image src="/slack-icon3.png" fill alt="icon" />
            </div>
            <div className="w-8 h-8 relative rounded-sm border opacity-50 group-hover:opacity-100">
              <Image src="/jira-icon2.png" fill alt="icon" />
            </div>
            <div className="w-8 h-8 relative rounded-sm border opacity-50 group-hover:opacity-100">
              <Image src="/git-lab-icon.png" fill alt="icon" />
            </div>
          </div>
          <div className=" hover:bg-grisHover  cursor-pointer rounded-sm space-x-2 p-2 duration-200 transition-colors  flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
            <p>Automatizar</p>
          </div>
          <CustomToolpip msg="Contraer encabezado">
            <div className="border hover:bg-grisHover cursor-pointer rounded-full h-6 w-6 flex items-center justify-center">
              <ChevronDown className="w-4 h-4" />
            </div>
          </CustomToolpip>
        </div>
      </div>
    </div>
  );
};
