import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SpaceWork } from "@prisma/client";
import {
  createSpaceWork,
  getOneSpacesWorkUser,
} from "@/lib/services/work_pasce.service";
import { createUserInfo, getUserInfo } from "@/lib/services/users.service";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadContentFirstBoardProps {
  children: ReactNode;
}
export const LoadContentFirstBoard = async ({
  children,
}: LoadContentFirstBoardProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const user = await currentUser();
  let spacesWorks: SpaceWork | null = null;
  spacesWorks = await getOneSpacesWorkUser(userId);

  if (!spacesWorks) {
    spacesWorks = await createSpaceWork({
      descriptionWork: "",
      nameWork: "Espacio de trabajo principal",
      userId,
    });
  }

  let userInfo = await getUserInfo(userId);
  if (!userInfo) {
    userInfo = await createUserInfo({
      email: `${user?.emailAddresses[0].emailAddress}`,
      name: `${user?.firstName} ${user?.lastName}`,
      userId,
      photo: user?.imageUrl,
    });
  }

  return (
    <div className="w-full h-full bg-gris">
      <Header spacesWorks={spacesWorks} />
      <div className="w-full h-[93%] flex">
        <div className="w-[15%] hidden md:block">
          <Sidebar spacesWorks={spacesWorks} />
        </div>
        <div className="w-[1%]"></div>
        <section className="w-[99%] md:w-[84%] h-full">{children}</section>
      </div>
    </div>
  );
};
LoadContentFirstBoard.skeleton = function () {
  return (
    <div className="w-full h-full bg-gris">
      <div className="w-full h-[7%] flex justify-between">
        <div className="flex space-x-2 items-center">
          <Skeleton className="size-12" />
        </div>
        <div className="flex items-center">
          <Skeleton className="size-12 rounded-full" />
        </div>
      </div>
      <div className="w-full h-[93%] flex">
        <div className="w-[15%] hidden md:block">
          <Skeleton className="w-full h-full rounded-sm" />
        </div>
        <div className="w-[1%]"></div>
        <section className="w-[99%] md:w-[84%] h-full">
          <Skeleton className="w-full h-full" />
        </section>
      </div>
    </div>
  );
};
