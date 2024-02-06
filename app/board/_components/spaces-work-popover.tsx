"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { IconSpaceWork } from "@/components/icon_space_work";
import { SpaceWork } from "@prisma/client";
import { ChevronDown, LayoutGrid, MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ResponseModel } from "@/models/response_model";
import { Skeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/use_moda";
import { useRouter } from "next/navigation";
import { createRoute } from "@/routes/routes";
import { cn } from "@/lib/utils";
type Props = {
  spacesWorks: SpaceWork;
  idSpaceWork: string;
  userId: string;
};
export const SpacesWorkPopover = ({
  idSpaceWork,
  spacesWorks,
  userId,
}: Props) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [listSpaceUser, setListSpaceUser] = useState<SpaceWork[]>([]);
  const [isPending, starTransition] = useTransition();
  useEffect(() => {
    starTransition(async () => {
      try {
        const response = await axios.get<ResponseModel<SpaceWork[]>>(
          `/api/space-work/${userId}`
        );
        if (response.data) {
          setListSpaceUser(response.data.data!);
        }
      } catch (error) {
        console.log(error);

        toast.error("Something wrong get your spaces work");
      }
    });
  }, [userId]);

  const onCreateSpace = () => {
    setIsOpen(false);
    onOpen("createSpaceWork", {
      userId: userId,
    });
  };

  function goToDetails(e: React.MouseEvent, space: SpaceWork): void {
    setIsOpen(false);
    const url = createRoute("spaceWorkDetails", {
      idSpace: space.id,
      idSpaceWork: space.id,
    });
    router.push(`${url}`);
  }

  return (
    <>
      <div className="w-full mt-2 flex items-center justify-between relative">
        <Popover open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
          <PopoverTrigger asChild>
            <div className="w-[75%] flex items-center rounded-sm hover:bg-grisHover p-2 cursor-pointer transition-colors duration-200">
              <div className="w-[15%] flex items-center justify-center">
                <IconSpaceWork nameWork={spacesWorks.nameWork} size="sm" />
              </div>
              <div className="w-[70%] flex items-center whitespace-nowrap overflow-hidden font-bold">
                {spacesWorks.nameWork}
              </div>
              <div className="w-[15%] flex items-center justify-center">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]">
            <Command>
              <CommandInput placeholder="Buscar espacio de trabajo" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Mis espacios">
                  {listSpaceUser.map((space) => (
                    <CommandItem
                      key={space.id}
                      className={cn(
                        space.id === spacesWorks.id &&
                          "bg-accent hover:bg-transparent"
                      )}
                    >
                      <div
                        onClick={(e) => goToDetails(e, space)}
                        className={
                          "w-full flex items-center space-x-2 cursor-pointer"
                        }
                      >
                        <IconSpaceWork size="sm" nameWork={space.nameWork} />
                        <span>{space.nameWork}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <div className="w-full flex justify-between mt-2">
                <div
                  onClick={onCreateSpace}
                  className="flex items-center space-x-2 rounded-sm hover:bg-grisHover transition-colors cursor-pointer p-2"
                >
                  <Plus size={20} className="text-gray-500" />
                  <span>Espacio de Trabajo</span>
                </div>
                <div className="flex items-center space-x-2 rounded-sm hover:bg-grisHover transition-colors cursor-pointer p-2">
                  <LayoutGrid size={20} className="text-gray-500" />
                  <span>Explorar todo</span>
                </div>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="w-[23%] flex items-center justify-center">
          <div className="flex items-center rounded-sm hover:bg-grisHover p-2 transition-colors duration-200 cursor-pointer">
            <MoreHorizontal className="w-6 h-6" />
          </div>
        </div>
        {isPending && (
          <Skeleton className="absolute w-full h-full rounded-sm bg-grisHover p-1" />
        )}
      </div>
    </>
  );
};
