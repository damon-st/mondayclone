import { ReactNode } from "react";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  createSpaceWork,
  getOneSpacesWorkUser,
} from "@/lib/services/work_pasce.service";
import { SpaceWork } from "@prisma/client";
import { createUserInfo, getUserInfo } from "@/lib/services/users.service";

export default async function BoardLayout({
  children,
}: {
  children: ReactNode;
}) {
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
}
