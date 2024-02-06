import { ReactNode, Suspense } from "react";
import { Header } from "../_components/header";
import { getSingleSpaceWorkUser } from "@/lib/services/work_pasce.service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Sidebar } from "../_components/sidebar";

export default async function BoardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { idSpaceWork: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const spacesWorks = await getSingleSpaceWorkUser(userId, params.idSpaceWork);
  if (!spacesWorks) {
    return redirect("/");
  }
  return (
    <div className="w-full h-full bg-gris">
      <Header userId={userId} spacesWorks={spacesWorks} />
      <div className="w-full h-[93%] flex">
        <div className="w-[15%] hidden md:block">
          <Sidebar
            userId={userId}
            idSpaceWork={params.idSpaceWork}
            spacesWorks={spacesWorks}
          />
        </div>
        <div className="w-[1%]"></div>
        <section className="w-[99%] md:w-[84%] h-full">{children}</section>
      </div>
    </div>
  );
}
