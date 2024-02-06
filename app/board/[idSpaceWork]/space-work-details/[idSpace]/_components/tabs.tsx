"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ResponseModel } from "@/models/response_model";
import { createRoute } from "@/routes/routes";
import { Board, SpaceWork, Users } from "@prisma/client";
import axios from "axios";
import { Crown, LayoutDashboard, Star, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TabsProps {
  boards: Board[];
  spaceWork: SpaceWork;
}
type TabSelect = "boards" | "members" | "permissions";

export const Tabs = ({ boards, spaceWork }: TabsProps) => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<Users[]>([]);
  const [tabSelect, setTabSelect] = useState<TabSelect>("boards");
  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await Promise.all(
          spaceWork.usersIds.map((userId) =>
            axios.get<ResponseModel<Users>>(`/api/user/${userId}`)
          )
        );
        setUsers([...response.map((e) => e.data.data!)]);
      } catch (error) {
        toast.error("Something wrong in get members");
      }
    });
  }, [spaceWork.usersIds]);
  const onSelectType = (type: TabSelect) => {
    setTabSelect(type);
  };
  return (
    <div className="w-full relative">
      {isPending && (
        <Skeleton className="absolute w-full h-full rounded-sm bg-grisHover" />
      )}
      <div className="w-full flex items-center space-x-2">
        <div
          onClick={() => onSelectType("boards")}
          className={cn(
            "border-b-2 cursor-pointer ",
            tabSelect === "boards" && "border-azul text-azul"
          )}
        >
          Tableros recientes
        </div>
        <div
          onClick={() => onSelectType("members")}
          className={cn(
            "border-b cursor-pointer",
            tabSelect === "members" && "border-azul text-azul"
          )}
        >
          Miembros
        </div>
        <div
          onClick={() => onSelectType("permissions")}
          className={cn(
            "border-b cursor-pointer",
            tabSelect === "permissions" && "border-azul text-azul"
          )}
        >
          Permisos
        </div>
      </div>
      <p className="mt-2 text-sm mb-2">
        Tableros y paneles que visitaste recientemente en este espacio de
        trabajo
      </p>
      {tabSelect === "boards" &&
        boards.map((v) => (
          <Link
            key={v.id}
            href={createRoute("board", {
              idBoard: v.id,
              idSpaceWork: v.spaceWorkId,
            })}
            className="w-[50%] flex items-center justify-between p-2 border-b rounded-sm transition-colors duration-200 hover:bg-grisHover"
          >
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4" />
              <p>{v.title}</p>
            </div>
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </Link>
        ))}
      {tabSelect === "members" && (
        <>
          <p>Miembros /{users.length}</p>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between w-full md:w-[45%] mt-2 mb-2"
            >
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.photo ?? ""} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="cursor-pointer hover:text-azul transition-colors">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {user.userId === spaceWork.userIdCreated && (
                  <div className="p-2 bg-azul flex items-center justify-center rounded-full">
                    <Crown size={15} className="text-white" />
                  </div>
                )}
                <X className="cursor-pointer" size={15} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
