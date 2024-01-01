"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ResponseModel } from "@/models/response_model";
import { BoardUser, Users } from "@prisma/client";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TaskResponsible {
  idTasks: string;
  idUser: string;
  boardUsers: BoardUser[];
}

export const TaskResponsible = ({
  idTasks,
  idUser,
  boardUsers,
}: TaskResponsible) => {
  const [userId, setUserId] = useState(idUser);
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<Users | null>(null);
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const onChangeUser = (u: Users) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        const response = await axios.put("/api/board/tasks/update", {
          idTask: idTasks,
          userIdNew: u.userId,
        });
        if (response.status !== 200) {
          toast.error(`Error: ${response.data.message}`);
          return;
        }
        const tempUser = users.find((v) => v.userId == u.userId);
        setUser(tempUser!);
        setUserId(u.userId);
        toast.success("Updated user succefully");
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const resultUsers = await Promise.all(
          boardUsers.map(async (u) => {
            const response = await axios.get<ResponseModel<Users>>(
              `/api/user/${u.userId}`
            );
            return response.data.data!;
          })
        );

        if (resultUsers) {
          setUsers(resultUsers);
          const tempUser = resultUsers.find((v) => v.userId == idUser);
          setUser(tempUser!);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    startTransition(async () => {
      await getData();
    });
  }, [boardUsers, idUser]);

  if (loading) {
    return (
      <div className="w-[10.4rem] border-r h-10 border-grisHover flex items-center justify-center">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="group w-[10.4rem] cursor-pointer border-r h-10 border-grisHover relative flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <div className=" w-full c h-10  relative flex items-center justify-center">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.photo ?? ""} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden group-hover:flex  absolute left-2 p-1 rounded-full  items-center justify-center bg-azul">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="outline-none right-0 ring-offset-0"
          side="top"
        >
          <Input className="p-0 m-0" placeholder="Buscar por nombre" />
          <DropdownMenuSeparator />
          {users.map((u) => (
            <DropdownMenuItem
              key={u.userId}
              onClick={() => onChangeUser(u)}
              className={cn(
                "flex items-center space-x-2 cursor-pointer",
                u.userId === userId && "bg-celeste"
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={u.photo ?? ""} />
                <AvatarFallback>
                  {u.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm">{u.name}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
