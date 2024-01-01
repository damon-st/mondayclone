import { IconSpaceWork } from "@/components/icon_space_work";
import { getSingleSpaceWorkUser } from "@/lib/services/work_pasce.service";
import { auth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { EditNameDesSpaceWork } from "./_components/edit_name_des_space";
import { Tabs } from "./_components/tabs";

interface SpaceWorkDetails {
  params: {
    idSpace: string;
  };
}

export default async function SpaceWorkDetails({ params }: SpaceWorkDetails) {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const spaceWork = await getSingleSpaceWorkUser(userId, params.idSpace);
  if (!spaceWork) return redirect("/");

  return (
    <div className="w-full h-full bg-white rounded-l-lg relative">
      <div className="w-full h-[30%] bg-[#f5f6f8] rounded-l-lg"></div>
      <div className="w-full h-[70%] pr-10 pl-10 overflow-y-auto">
        <div className="w-full flex items-center justify-between">
          <div className="w-[90%] flex items-center">
            <IconSpaceWork size="lg" nameWork={spaceWork.nameWork} hover />
            <EditNameDesSpaceWork
              descriptionWork={spaceWork.descriptionWork}
              nameWork={spaceWork.nameWork}
              id={params.idSpace}
              userId={userId}
            />
          </div>
          <div className="w-[10%] flex items-center justify-center">
            <MoreHorizontal className="w-8 h-8" />
          </div>
        </div>
        <div className="w-full mt-2">
          <Tabs boards={spaceWork.board} />
        </div>
      </div>
    </div>
  );
}
